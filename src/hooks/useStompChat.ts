import { useEffect, useRef, useState } from 'react';
import { Client, type StompSubscription } from '@stomp/stompjs';
import { UserApi } from '../apis/user.api';
import { useQuery } from '@tanstack/react-query';
import { v4 as uuidv4 } from 'uuid';
import type { ChatMessage } from '../type/chat.type';

export default function useStompChat(roomId: number, userId: string) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [connected, setConnected] = useState(false);
  const clientRef = useRef<Client | null>(null);
  const subRef = useRef<StompSubscription | null>(null);

  const { data: userInfoData } = useQuery({
    queryKey: ['userInfo'],
    queryFn: () => UserApi.getUser(),
    retry: false,
  });

  useEffect(() => {
    console.log('🔌 STOMP 초기화 시작...', { roomId });

    const client = new Client({
      brokerURL: 'wss://chat.flichat.co.kr/ws-chat',
      reconnectDelay: 50000,
      heartbeatIncoming: 10000,
      heartbeatOutgoing: 10000,
      debug: (msg) => console.log('[STOMP DEBUG]', msg),
    });

    client.onConnect = (frame) => {
      console.log('✅ STOMP 연결 성공:', frame.headers);
      setConnected(true);

      console.log(`📡 /topic/chat/room/${roomId} 구독 시작`);
      subRef.current = client.subscribe(`/topic/chat/room/${roomId}`, (msg) => {
        console.log('📨 메시지 수신:', msg.body);
        try {
          const payload = JSON.parse(msg.body);
          setMessages((prev) => [...prev, payload]);
        } catch (e) {
          console.error('❌ 메시지 파싱 실패:', e);
        }
      });
    };

    client.onStompError = (frame) => {
      console.error('🚨 STOMP 프로토콜 오류:', frame.headers['message'], frame.body);
    };

    client.onWebSocketClose = (evt) => {
      console.warn('⚠️ WebSocket 연결 종료:', evt);
      setConnected(false);
    };

    client.onWebSocketError = (evt) => {
      console.error('❌ WebSocket 에러 발생:', evt);
    };

    client.activate();
    clientRef.current = client;

    return () => {
      console.log('🧹 STOMP 연결 해제 및 구독 해제 중...');
      subRef.current?.unsubscribe();
      subRef.current = null;
      client.deactivate();
      clientRef.current = null;
    };
  }, [roomId]);

  const sendMessage = (content: string) => {
    const client = clientRef.current;
    if (!client) {
      console.warn('⚠️ STOMP 클라이언트가 초기화되지 않음');
      return;
    }
    if (!client.connected) {
      console.warn('⚠️ STOMP 클라이언트가 아직 연결되지 않음');
      return;
    }

    const messagePayload = {
      userId: userId,
      message: content,
      sender: userInfoData?.data?.nickName,
      profileColorType: userInfoData?.data?.profileColorType,
      roomId: roomId?.toString() ?? '',
      clientMessageId: uuidv4()
    };

    console.log('📤 메시지 전송 시도:', messagePayload);

    try {
      client.publish({
        destination: '/send/chat/message',
        body: JSON.stringify(messagePayload),
      });
      console.log('✅ 메시지 전송 완료');
    } catch (e) {
      console.error('❌ 메시지 전송 실패:', e);
    }
  };

  return { connected, messages,setMessages, sendMessage };
}