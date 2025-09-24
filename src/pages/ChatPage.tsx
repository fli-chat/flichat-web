import { useState } from "react";
import user from "../assets/icons/profile.svg";
import profile from "../assets/icons/purple.svg";
import album from "../assets/icons/album.svg";

export default function ChatPage() {
  const [message, setMessage] = useState("");

  const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
  };

  const handleSend = () => {
    if (message.trim()) {
      // 메시지 전송 로직
      console.log("메시지 전송:", message);
      setMessage(""); // 전송 후 입력창 초기화
    }
  };

  return (
    <div className="relative h-screen">
      {/* header */}
      <div className="flex justify-between items-center px-[20px] py-[18px]">
        <div className="flex items-center gap-[8px] ">
          <p className="text-font-point title4 font-bold">듄</p>
          <p className="text-font-secondary title4 font-medium">110명</p>
        </div>
        <div className="cursor-pointer">
          <img src={user} alt="close" />
        </div>
      </div>

      {/* chat */}
      <div className="flex flex-col gap-[12px] mx-[20px] mt-[24px]">
        {/* 채팅 메세지 */}
        <div className="flex items-start gap-[8px]">
          <div className="w-[28px] h-[28px]">
            <img src={profile} alt="user" className="w-[28px] h-full" />
          </div>
          <div className="flex items-end gap-[6px]">
            <div className="flex flex-col items-start gap-[6px]">
              <p className="caption font-medium text-font-primary">Jay Park</p>
              <div className="bg-semantic-teriary rounded-[10px] rounded-tl-none px-[20px] py-[10px] max-w-[253px] text-left">
                <p className="font-medium text-font-primary text-[14px]">
                  티모시 샬라메 진짜 연기 미쳤음..
                  그동안 필모 중에 인생작입니다..
                </p>
              </div>
            </div>
            <div className="flex items-start flex-col">
              <p className="text-font-secondary text-[9px] font-medium">읽음 13</p>
              <p className="text-font-secondary text-[9px] font-medium">오후 2:40</p>
            </div>
          </div>
        </div>

        <div className="flex items-end justify-end gap-[8px]">
          <div className="flex items-end flex-col">
            <p className="text-font-secondary text-[9px] font-medium">읽음 13</p>
            <p className="text-font-secondary text-[9px] font-medium">오후 2:40</p>
          </div>
          <div className="flex flex-col items-start gap-[6px]">
            <div className="bg-system-mint2 rounded-[10px] px-[20px] py-[10px] max-w-[253px] text-left rounded-tr-none">
              <p className="font-medium text-font-dark text-[14px]">
                티모시 샬라메 진짜 연기 미쳤음..
                그동안 필모 중에 인생작입니다..
              </p>
            </div>
          </div>

        </div>

        <div className="flex items-end justify-end gap-[8px]">
          <div className="flex items-end flex-col">
            <p className="text-font-secondary text-[9px] font-medium">읽음 13</p>
            <p className="text-font-secondary text-[9px] font-medium">오후 2:40</p>
          </div>
          <div className="flex flex-col items-start gap-[6px]">
            <div className="bg-system-mint2 rounded-[10px] px-[20px] py-[10px] max-w-[253px] text-left rounded-tr-none">
              <p className="font-medium text-font-dark text-[14px]">
                티모시 샬라메 진짜 연기 미쳤음..
              </p>
            </div>
          </div>
        </div>

        {/* footer */}
        <div className="absolute bottom-0 left-0 right-0 w-full h-[116px] bg-semantic-secondary flex flex-col justify-between p-[16px]">
          <div>
            <textarea
              rows={2}
              value={message}
              onChange={handleMessageChange}
              className="w-full h-full resize-none bg-transparent text-font-primary body2 flex-wrap overflow-hidden font-medium focus:outline-none"
              placeholder="메시지를 입력해주세요"
            />
          </div>
          <div className="flex items-center justify-between">
            <img src={album} alt="album" className="w-[24px] h-[24px] cursor-pointer" />
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
      </div>
    </div>
  );
}