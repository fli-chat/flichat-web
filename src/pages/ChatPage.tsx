import { useEffect, useRef, useState } from "react";
import user from "../assets/icons/profile.svg";
import profile from "../assets/icons/purple.svg";
import ProfileModal from "../components/ProfileModal";
import LoginModal from "../components/LoginModal";
import AppInstallModal from "../components/AppInstallModal";
import { useSidebar } from "../store/useSidebar";
import { useQuery } from "@tanstack/react-query";
import { ChatApi } from "../apis/chat.api";
import { formatKoreanTime } from "../utils/format";
import { UserApi } from "../apis/user.api";
import useStompChat from "../hooks/useStompChat";
import type { ChatMessage } from "../type/chat.type";

const roomId = 3;

export default function ChatPage() {
  const { setIsOpen } = useSidebar();

  const chatContainerRef = useRef<HTMLDivElement>(null);

  const [message, setMessage] = useState("");
  const [lastSendTime, setLastSendTime] = useState(0);
  const [sentMessageCount, setSentMessageCount] = useState(0);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isAppInstallModalOpen, setIsAppInstallModalOpen] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<ChatMessage | null>(null);

  const { data: chatMessageData, refetch: refetchChatMessage } = useQuery({
    queryKey: ['chatMessage', roomId],
    queryFn: () => ChatApi.getChatHistory(roomId),
    retry: false,
  })

  const { data: chatRoomData } = useQuery({
    queryKey: ['chatRoom', roomId],
    queryFn: () => ChatApi.getChatRoomInfo(roomId),
    retry: false,
  })

  const { data: userInfoData } = useQuery({
    queryKey: ['userInfo'],
    queryFn: () => UserApi.getUser(),
    retry: false,
  })

  const { messages, setMessages, sendMessage } = useStompChat(roomId, userInfoData?.data?.userId ?? '');


  const onClickInput = () => {
    if (!userInfoData?.data) {
      setIsLoginModalOpen(true);
      return;
    }
  }

  const handleMessageChange = (text: string) => {
    setMessage(text);
  };

  const onClickProfile = (clickedMessage: ChatMessage) => {
    setSelectedMessage(clickedMessage);
    setIsProfileModalOpen(true);
  };


  const keyboardDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSend();
    }
  }

  const handleSend = async () => {
    const now = Date.now();
    if (!message.trim() || now - lastSendTime < 500) {
      return;
    }

    setLastSendTime(now);
    console.log("메시지 전송:", message);
    sendMessage(message);

    // 메시지 카운트 증가
    const newCount = sentMessageCount + 1;
    setSentMessageCount(newCount);

    // 5번째 메시지일 때 앱 설치 모달 표시
    if (newCount === 5) {
      setIsAppInstallModalOpen(true);
    }

    await refetchChatMessage();
    setMessage(""); // 전송 후 입력창 초기화
  };

  useEffect(() => {
    if (chatMessageData?.data.data && chatMessageData?.data.data.length > 0) {

      const newMessages = [...messages, ...chatMessageData.data.data];
      setMessages(
        newMessages
      );
    }
  }, [setMessages, chatRoomData])

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [chatMessageData?.data.data, messages]);

  return (
    <div className="relative h-screen">
      {/* header */}
      <div className="flex justify-between items-center px-[20px] py-[18px]">
        <div className="flex items-center gap-[8px] ">
          <p className="text-font-point title4 font-bold">{chatRoomData?.data.title}</p>
          <p className="text-font-secondary title4 font-medium">{chatRoomData?.data.joinedUserCount}명</p>
        </div>
        <div className="cursor-pointer" onClick={() => setIsOpen(true)}>
          <img src={user} alt="close" />
        </div>
      </div>

      <div ref={chatContainerRef} className="overflow-y-scroll h-screen pb-[206px]">
        {/* chat */}
        {messages.map((message) => {
          const isMe = message.userId === userInfoData?.data?.userId;

          return (
            <div className="flex flex-col gap-[0px] mx-[20px] mt-[12px]">
              {/* 채팅 메세지 */}
              {isMe ? (
                <div className="flex items-end justify-end gap-[8px]">
                  <div className="flex items-end flex-col">
                    {/* <p className="text-font-secondary text-[9px] font-medium">읽음 13</p> */}
                    <p className="text-font-secondary text-[9px] font-medium">{formatKoreanTime(message.timeStamp)}</p>
                  </div>
                  <div className="flex flex-col items-start gap-[6px]">
                    <div className="bg-system-mint2 rounded-[10px] px-[20px] py-[10px] max-w-[253px] text-left rounded-tr-none">
                      <p className="font-medium text-font-dark text-[14px]">
                        {message.message}
                      </p>
                    </div>
                  </div>

                </div>
              ) : (
                <div className="flex items-start gap-[8px]">
                  <div
                    className="w-[28px] h-[28px] cursor-pointer hover:opacity-80 transition-opacity duration-200"
                    onClick={() => onClickProfile(message)}
                  >
                    <img src={profile} alt="user" className="w-[28px] h-full" />
                  </div>
                  <div className="flex items-end gap-[6px]">
                    <div className="flex flex-col gap-[6px]">
                      <p className="caption font-medium text-font-primary text-left">{message.sender}</p>
                      <div className="bg-semantic-teriary rounded-[10px] rounded-tl-none px-[20px] py-[10px] max-w-[253px] text-left">
                        <p className="font-medium text-font-primary text-[14px]">
                          {message.message}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start flex-col">
                      {/* <p className="text-font-secondary text-[9px] font-medium">읽음 13</p> */}
                      <p className="text-font-secondary text-[9px] font-medium">{formatKoreanTime(message.timeStamp)}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* footer */}
      <div className="absolute bottom-0 left-0 right-0 w-full h-[116px] bg-semantic-secondary flex flex-col justify-between p-[16px]">
        <div onClick={onClickInput}>
          <textarea
            rows={2}
            value={message}
            onChange={(e) => handleMessageChange(e.target.value)}
            onKeyDown={(e) => keyboardDown(e)}
            className="w-full h-full resize-none bg-transparent text-font-primary body2 flex-wrap overflow-hidden font-medium focus:outline-none"
            placeholder="메시지를 입력해주세요"
          />
        </div>
        <div className="flex items-center justify-between">
          {/* <img src={album} alt="album" className="w-[24px] h-[24px] cursor-pointer" /> */}
          <div />
          <button
            onClick={handleSend}
            disabled={!message.trim()}
            className={`body1 font-medium rounded-[4px] px-[10px] py-[4px] transition-colors duration-200 ${message.trim()
              ? 'bg-primary text-semantic-primary'
              : 'bg-semantic-teriary text-font-disabled'
              }`}
          >
            보내기
          </button>
        </div>
      </div>

      {isProfileModalOpen && (
        <ProfileModal
          setIsProfileModalOpen={setIsProfileModalOpen}
          reportPayload={{
            chatRoomName: chatRoomData?.data.title ?? '',
            reporterId: userInfoData?.data?.userId ?? '',
            reporterdUserId: selectedMessage?.userId ?? '',
            reportedMessageId: selectedMessage?.id ?? '',
            reportedMessageContent: selectedMessage?.message ?? '',
            message: selectedMessage?.message ?? ''
          }} />
      )}

      {isLoginModalOpen && (
        <LoginModal setIsLoginModalOpen={setIsLoginModalOpen} />
      )}

      {/* 앱 설치 모달 추가 */}
      {isAppInstallModalOpen && (
        <AppInstallModal setIsAppInstallModalOpen={setIsAppInstallModalOpen} />
      )}

    </div>
  );
}