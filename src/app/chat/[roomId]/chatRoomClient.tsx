'use client';

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState } from "react";
import Image from 'next/image';
import { useQuery } from "@tanstack/react-query";
import { useSidebar } from "@/store/useSidebar";
import { ChatMessage } from "@/type/chat.type";
import { UserApi } from "@/apis/user.api";
import { ChatApi } from "@/apis/chat.api";
import useStompChat from "@/hooks/useStompChat";
import { formatKoreanTime } from "@/utils/format";
import ProfileModal from "@/components/ProfileModal";
import LoginModal from "@/components/LoginModal";
import AppInstallModal from "@/components/AppInstallModal";
import { parseTitle } from "@/utils/parseTitle";

const MOCK_MESSAGES = [
  {
    id: 'mock-1',
    userId: 'mock-user-1',
    sender: '영화광',
    message: '이 영화 정말 명작이네요! 결말이 인상적이었어요',
    timeStamp: new Date(Date.now() - 3600000),
    profileColorType: 'PURPLE',
    roomId: '1',
  },
  {
    id: 'mock-2',
    userId: 'mock-user-2',
    sender: '시네마러버',
    message: '저도 감동받았어요. 특히 마지막 장면이...',
    timeStamp: new Date(Date.now() - 1800000),
    profileColorType: 'BLUE',
    roomId: '1',
  },
  {
    id: 'mock-3',
    userId: 'mock-user-3',
    sender: '무비매니아',
    message: '감독의 연출력이 돋보이는 작품이었습니다',
    timeStamp: new Date(Date.now() - 900000),
    profileColorType: 'RED',
    roomId: '1',
  },
];

export default function ChatRoomClient({ roomId, title }: { roomId: number, title: string }) {
  const { setIsOpen } = useSidebar();
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const [message, setMessage] = useState("");
  const [lastSendTime, setLastSendTime] = useState(0);
  const [sentMessageCount, setSentMessageCount] = useState(0);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isAppInstallModalOpen, setIsAppInstallModalOpen] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<ChatMessage | null>(null);

  const { movieTitle } = parseTitle(title);

  const { data: userInfoData } = useQuery({
    queryKey: ['userInfo'],
    queryFn: () => UserApi.getUser(),
    retry: false,
    staleTime: Infinity,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  // 초기 히스토리: "한 번만" 조회
  const { data: chatMessageData } = useQuery({
    queryKey: ['chatMessage:init', roomId],
    queryFn: () => ChatApi.getChatHistory(roomId),
    retry: false,
    staleTime: Infinity,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  const { data: chatRoomData } = useQuery({
    queryKey: ['chatRoom', roomId],
    queryFn: () => ChatApi.getChatRoomInfo(roomId),
    retry: false,
    staleTime: 60000,
  });

  const { messages, sendMessage, mergeInitial } = useStompChat(
    roomId,
    userInfoData?.data?.userId ?? ''
  );

  // ✅ messages가 비어있으면 mock 사용
  const displayMessages = messages.length > 0 ? messages : MOCK_MESSAGES;

  const onClickInput = () => {
    if (!userInfoData?.data) setIsLoginModalOpen(true);
  };

  const handleSend = () => {
    const now = Date.now();
    if (!message.trim() || now - lastSendTime < 500) return;
    setLastSendTime(now);
    sendMessage(message);
    const cnt = sentMessageCount + 1;
    setSentMessageCount(cnt);
    if (cnt === 5) setIsAppInstallModalOpen(true);
    setMessage("");
  };

  const keyboardDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      // 한글 조합 중일 때는 무시
      if (e.nativeEvent.isComposing) {
        return;
      }
      e.preventDefault();
      handleSend();
    }
  };

  // 초기 히스토리 1회 병합
  useEffect(() => {
    const initial = chatMessageData?.data?.data as ChatMessage[] | undefined;
    if (initial?.length) mergeInitial(initial as any);
  }, [chatMessageData?.data?.data, mergeInitial]);

  // 메시지 변경 시 바닥 스크롤
  useEffect(() => {
    chatContainerRef.current?.scrollTo({
      top: chatContainerRef.current.scrollHeight,
      behavior: 'smooth',
    });
  }, [messages.length]);

  return (
    <div className="relative h-screen">
      {/* header */}
      <div className="flex justify-between items-center px-[20px] py-[18px]">
        <div className="flex items-center gap-[8px] ">
          <p className="text-font-point title4 font-bold">{movieTitle}</p>
          <p className="text-font-secondary title4 font-medium">{chatRoomData?.data?.joinedUserCount || 13}명</p>
        </div>
        <div className="cursor-pointer" onClick={() => setIsOpen(true)}>
          <Image src="/icons/profile.svg" alt="close" width={28} height={28} />
        </div>
      </div>

      {/* chat list */}
      <div ref={chatContainerRef} className="overflow-y-scroll h-screen pb-[206px]">
        {displayMessages.map((m: any) => {
          const isMe = m.userId === (userInfoData?.data?.userId || 'mock-user-1');
          const key = (m as any).clientMessageId ?? m.id ?? `${m.timeStamp}-${m.userId}`;

          return (
            <div key={key} className="flex flex-col gap-[0px] mx-[20px] mt-[12px]">
              {isMe ? (
                <div className="flex items-end justify-end gap-[8px]">
                  <div className="flex items-end flex-col">
                    <p className="text-font-secondary text-[9px] font-medium">
                      {formatKoreanTime(m.timeStamp)}{m.optimistic ? ' · 전송중…' : ''}
                    </p>
                  </div>
                  <div className="flex flex-col items-start gap-[6px]">
                    <div className={`rounded-[10px] px-[20px] py-[10px] max-w-[253px] text-left rounded-tr-none ${m.optimistic ? 'bg-system-mint2/70' : 'bg-system-mint2'}`}>
                      <p className="font-medium text-font-dark text-[14px]">{m.message}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-start gap-[8px]">
                  <div
                    className="w-[28px] h-[28px] cursor-pointer hover:opacity-80 transition-opacity duration-200"
                    onClick={() => { setSelectedMessage(m as any); setIsProfileModalOpen(true); }}
                  >
                    <Image src="/icons/purple.svg" alt="user" className="w-[28px] h-full" width={28} height={28} />
                  </div>
                  <div className="flex items-end gap-[6px]">
                    <div className="flex flex-col gap-[6px]">
                      <p className="caption font-medium text-font-primary text-left">{m.sender}</p>
                      <div className="bg-semantic-teriary rounded-[10px] rounded-tl-none px-[20px] py-[10px] max-w-[253px] text-left">
                        <p className="font-medium text-font-primary text-[14px]">{m.message}</p>
                      </div>
                    </div>
                    <div className="flex items-start flex-col">
                      <p className="text-font-secondary text-[9px] font-medium">{formatKoreanTime(m.timeStamp)}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* footer */}
      <div className="absolute bottom-0 left-0 right-0 w-full h-[116px] bg-semantic-secondary flex flex-col justify-between p-[16px]">
        <div onClick={() => !userInfoData?.data && setIsLoginModalOpen(true)}>
          <textarea
            rows={2}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={keyboardDown}
            className="w-full h-full resize-none bg-transparent text-font-primary body2 font-medium focus:outline-none"
            placeholder="메시지를 입력해주세요"
          />
        </div>
        <div className="flex items-center justify-between" onClick={onClickInput}>
          <div />
          <button
            onClick={handleSend}
            disabled={!message.trim()}
            className={`body1 font-medium rounded-[4px] px-[10px] py-[4px] transition-colors duration-200 ${message.trim() ? 'bg-primary text-semantic-primary' : 'bg-semantic-teriary text-font-disabled'}`}
          >
            보내기
          </button>
        </div>
      </div>

      {isProfileModalOpen && selectedMessage && (
        <ProfileModal
          setIsProfileModalOpen={setIsProfileModalOpen}
          reportPayload={{
            chatRoomName: chatRoomData?.data?.title ?? '',
            reporterId: userInfoData?.data?.userId ?? '',
            reporterdUserId: selectedMessage?.userId ?? '',
            reportedMessageId: selectedMessage?.id ?? '',
            reportedMessageContent: selectedMessage?.message ?? '',
            message: selectedMessage?.message ?? '',
            chatRoomId: roomId,
          }}
        />
      )}

      {isLoginModalOpen && <LoginModal setIsLoginModalOpen={setIsLoginModalOpen} />}
      {isAppInstallModalOpen && <AppInstallModal setIsAppInstallModalOpen={setIsAppInstallModalOpen} />}
    </div>
  );
}