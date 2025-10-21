'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { Client, type StompSubscription } from '@stomp/stompjs';
import { useQuery } from '@tanstack/react-query';
import { v4 as uuidv4 } from 'uuid';
import { UserApi } from '../apis/user.api';
import type { ChatMessage } from '../type/chat.type';

type AnyMsg = ChatMessage & {
  clientMessageId?: string;
  optimistic?: boolean;
};

export default function useStompChat(roomId: number, userId: string) {
  const [messages, setMessages] = useState<AnyMsg[]>([]);
  const clientRef = useRef<Client | null>(null);
  const subRef = useRef<StompSubscription | null>(null);

  // 간단한 중복 체크: clientMessageId → id
  const hasMsg = (m: Partial<AnyMsg>) =>
    messages.some(
      (x) =>
        (m.clientMessageId && x.clientMessageId === m.clientMessageId) ||
        (m.id && x.id === m.id)
    );

  const replaceOptimistic = (incoming: AnyMsg) => {
    setMessages((prev) => {
      const idx = incoming.clientMessageId
        ? prev.findIndex((p) => p.clientMessageId === incoming.clientMessageId)
        : -1;
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = { ...next[idx], ...incoming, optimistic: false };
        return next;
      }
      // 없으면 신규 추가(중복만 피함)
      if (hasMsg(incoming)) return prev;
      return [...prev, { ...incoming, optimistic: false }];
    });
  };

  const { data: userInfoData } = useQuery({
    queryKey: ['userInfo'],
    queryFn: () => UserApi.getUser(),
    retry: false,
    staleTime: Infinity,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    const client = new Client({
      brokerURL: 'wss://chat.flichat.co.kr/ws-chat',
      reconnectDelay: 5000,
      heartbeatIncoming: 10000,
      heartbeatOutgoing: 10000,
    });

    client.onConnect = () => {
      subRef.current = client.subscribe(`/topic/chat/room/${roomId}`, (msg) => {
        const payload = JSON.parse(msg.body) as AnyMsg;
        replaceOptimistic(payload);
      });
    };

    client.activate();
    clientRef.current = client;

    return () => {
      subRef.current?.unsubscribe();
      client.deactivate();
      clientRef.current = null;
    };
  }, [roomId]);

  const sendMessage = (content: string) => {
    const client = clientRef.current;
    if (!client?.connected) return;

    const clientMessageId = uuidv4();
    const optimistic: AnyMsg = {
      clientMessageId,
      optimistic: true,
      id: null,
      userId,
      sender: userInfoData?.data?.nickName ?? '',
      profileColorType: userInfoData?.data?.profileColorType ?? null,
      roomId: String(roomId),
      message: content,
      timeStamp: new Date().toISOString(),
    };

    // 낙관적 추가
    setMessages((prev) => [...prev, optimistic]);

    // 서버 전송(서버가 같은 clientMessageId를 되돌려주면 위 replaceOptimistic이 교체)
    client.publish({
      destination: '/send/chat/message',
      body: JSON.stringify({
        roomId: String(roomId),
        userId,
        message: content,
        sender: optimistic.sender,
        profileColorType: optimistic.profileColorType,
        clientMessageId,
      }),
    });
  };

  const mergeInitial = useCallback((list: AnyMsg[]) => {
    setMessages((prev) => {
      if (!list?.length) return prev;
      const next = [...prev];
      list.forEach((m) => {
        if (!messages.some(x => (m.clientMessageId && x.clientMessageId === m.clientMessageId) || (m.id && x.id === m.id))) {
          next.push({ ...m, optimistic: false });
        }
      });
      return next;
    });
  }, []); // 빈 의존성 배열

  return { messages, sendMessage, mergeInitial };
}