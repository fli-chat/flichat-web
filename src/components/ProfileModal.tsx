import { useState } from "react";
import close from "../assets/icons/close.svg";
import profile from "../assets/icons/purple.svg";
import block from "../assets/icons/block.svg";
import report from "../assets/icons/report.svg";
import ReportModal from "./ReportModal";

interface ProfileModalProps {
  setIsProfileModalOpen: (isProfileModalOpen: boolean) => void;
}

export default function ProfileModal({ setIsProfileModalOpen }: ProfileModalProps) {
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  const onClickReport = () => {
    setIsReportModalOpen(true);
  }

  const handleReport = (reason: string) => {
    console.log("신고 사유:", reason);
    // 여기에 실제 신고 API 호출 로직 추가
    alert(`${reason}으로 신고되었습니다.`);
  };

  return (
    <>
      {!isReportModalOpen && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[373px] bg-semantic-teriary rounded-[10px]">
          <div className="px-[20px] py-[24px] pb-[32px]">
            <div className="w-full flex justify-end">
              <img
                src={close}
                alt="close"
                className="cursor-pointer hover:opacity-70 transition-opacity duration-200"
                onClick={() => setIsProfileModalOpen(false)}
              />
            </div>

            <div className="w-full flex flex-col items-center gap-[16px] justify-center pt-[16px]">
              <img src={profile} alt="profile" className="w-[80px] h-[80px]" />
              <p className="title4 font-bold text-font-primary">Jay Park</p>
            </div>
          </div>

          <div className="w-full h-[1px] bg-semantic-fourth" />
          <div className="pt-[16px] flex flex-col pb-[24px]">
            <div className="flex items-center gap-[8px] px-[20px] py-[16px] cursor-pointer hover:bg-semantic-fourth transition-colors duration-200">
              <img src={block} alt="block" />
              <p className="body1 font-medium text-font-primary">사용자 차단하기</p>
            </div>
            <div
              className="flex items-center gap-[8px] px-[20px] py-[16px] cursor-pointer hover:bg-semantic-fourth transition-colors duration-200"
              onClick={onClickReport}
            >
              <img src={report} alt="report" />
              <p className="body1 font-medium text-font-primary">사용자 신고하기</p>
            </div>
          </div>
        </div>
      )}

      {/* 신고 모달 */}
      <ReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        onReport={handleReport}
      />
    </>
  )
}