/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import Image from 'next/image';
import ReportModal from "./ReportModal";
import ReportSelectModal from "./ReportSelectModal";
import ReportSuccessModal from "./ReportSuccessModal";
import { useMutation } from "@tanstack/react-query";
import { ProfileColorType, UserApi, type ReportPayload } from "../apis/user.api";
import BlockSelectModal from "./BlockSelectModal";
import BlockSuccessModal from "./BlockSuccessModa";
import toast from "react-hot-toast";

interface ProfileModalProps {
  reportPayload: {
    chatRoomName: string;
    reporterId: string;
    reporterdUserId: string;
    reportedMessageId: string;
    reportedMessageContent: string;
    message: string;
    chatRoomId: number;
  }
  profile: {
    nickName: string;
    profileColorType: ProfileColorType;
  }
  setIsProfileModalOpen: (isProfileModalOpen: boolean) => void;
}

const convertProfileColorType = (profileColorType: ProfileColorType) => {
  switch (profileColorType) {
    case ProfileColorType.PURPLE:
      return "/icons/profile_dafault_purple.svg";
    case ProfileColorType.RED:
      return "/icons/profile_dafault_coral.svg";
    case ProfileColorType.GREEN:
      return "/icons/profile_dafault_mint.svg";
    case ProfileColorType.BLUE:
      return "/icons/profile_dafault_skyblue.svg";
    case ProfileColorType.YELLOW:
      return "/icons/profile_dafault_yellow.svg";
  }
}


export default function ProfileModal({ reportPayload, profile, setIsProfileModalOpen }: ProfileModalProps) {
  const [selectedReason, setSelectedReason] = useState<string>("불법촬영물");

  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isReportSelectModalOpen, setIsReportSelectModalOpen] = useState(false);
  const [isReportSuccessModalOpen, setIsReportSuccessModalOpen] = useState(false);
  const [isBlockSelectModalOpen, setIsBlockSelectModalOpen] = useState(false);
  const [isBlockSuccessModalOpen, setIsBlockSuccessModalOpen] = useState(false);

  const { mutateAsync: reportMutation } = useMutation({
    mutationFn: (reportPayload: ReportPayload) => UserApi.postReport(reportPayload),
  });

  const { mutateAsync: blockMutation } = useMutation({
    mutationFn: ({ blockedUserId, chatRoomId }: { blockedUserId: string, chatRoomId: number }) => UserApi.postBlock(blockedUserId, chatRoomId),
    onError: (error: any) => {
      console.log(error.response.data.msg);
      toast.error(error.response.data.msg);
    },
  });

  const convertReportType = (reason: string) => {
    switch (reason) {
      case "불법촬영물":
        return "ILLEGAL_CONTENT";
      case "음란물":
        return "PORNOGRAPHY";
      case "성희롱":
        return "SEXUAL_HARASSMENT";
      case "욕설/비방":
        return "ABUSE";
      case "스팸/광고":
        return "SPAM";
      case "기타":
        return "ETC";
      default:
        return "ETC";
    }
  }

  const onClickReport = () => {
    setIsReportModalOpen(true);
  }

  const onClickBlock = () => {
    setIsBlockSelectModalOpen(true);
  }

  const handleReport = () => {
    setIsReportModalOpen(false);
    setIsReportSelectModalOpen(true);
  }

  const onClickBlockSuccess = async () => {
    await blockMutation({ blockedUserId: reportPayload.reporterdUserId, chatRoomId: reportPayload.chatRoomId });
    setIsBlockSelectModalOpen(false);
    setIsBlockSuccessModalOpen(true);
  }

  const onClickReportSuccess = async () => {

    await reportMutation(
      {
        chatRoomName: reportPayload.chatRoomName,
        reporterId: reportPayload.reporterId,
        reporterdUserId: reportPayload.reporterdUserId,
        reportedMessageId: reportPayload.reportedMessageId,
        reportedMessageContent: reportPayload.reportedMessageContent,
        reportType: convertReportType(selectedReason),
        message: reportPayload.message
      });

    setIsReportSelectModalOpen(false);
    setIsReportSuccessModalOpen(true);
  }

  return (
    <>
      {!isReportModalOpen && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[373px] bg-semantic-teriary rounded-[10px] md:w-[320px]">
          <div className="px-[20px] py-[24px] pb-[32px]">
            <div className="w-full flex justify-end">
              <Image
                src="/icons/close.svg"
                alt="close"
                className="cursor-pointer hover:opacity-70 transition-opacity duration-200"
                onClick={() => setIsProfileModalOpen(false)}
                width={24}
                height={24}
              />
            </div>

            <div className="w-full flex flex-col items-center gap-[16px] justify-center pt-[16px]">
              <Image src={convertProfileColorType(profile.profileColorType)} alt="profile" className="w-[80px] h-[80px]" width={80} height={80} />
              <p className="title4 font-bold text-font-primary">{profile.nickName}</p>
            </div>
          </div>

          <div className="w-full h-[1px] bg-semantic-fourth" />
          <div className="pt-[16px] flex flex-col pb-[24px]" onClick={onClickBlock}>
            <div className="flex items-center gap-[8px] px-[20px] py-[16px] cursor-pointer hover:bg-semantic-fourth transition-colors duration-200">
              <Image src="/icons/block.svg" alt="block" width={24} height={24} />
              <p className="body1 font-medium text-font-primary">사용자 차단하기</p>
            </div>
            <div
              className="flex items-center gap-[8px] px-[20px] py-[16px] cursor-pointer hover:bg-semantic-fourth transition-colors duration-200"
              onClick={onClickReport}
            >
              <Image src="/icons/report.svg" alt="report" width={24} height={24} />
              <p className="body1 font-medium text-font-primary">사용자 신고하기</p>
            </div>
          </div>
        </div>
      )}

      {/* 신고 모달 */}
      {isReportModalOpen && (
        <ReportModal
          onClose={() => setIsReportModalOpen(false)}
          handleReport={handleReport}
          selectedReason={selectedReason}
          setSelectedReason={setSelectedReason}
        />
      )}

      {/* 신고 선택 모달 */}
      {isReportSelectModalOpen && (
        <ReportSelectModal
          onClickReportSuccess={onClickReportSuccess}
          onClose={() => setIsReportSelectModalOpen(false)}
        />
      )}

      {/* 신고 성공 모달 */}
      {isReportSuccessModalOpen && (
        <ReportSuccessModal
          onClose={() => setIsReportSuccessModalOpen(false)}
        />
      )}

      {/* 차단 선택 모달 */}
      {isBlockSelectModalOpen && (
        <BlockSelectModal
          onClickBlockSuccess={onClickBlockSuccess}
          onClose={() => setIsBlockSelectModalOpen(false)}
        />
      )}

      {/* 차단 성공 모달 */}
      {isBlockSuccessModalOpen && (
        <BlockSuccessModal
          onClose={() => setIsBlockSuccessModalOpen(false)}
        />
      )}
    </>
  )
}