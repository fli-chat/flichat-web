interface ReportSuccessModalProps {
  onClose: () => void;
}


export default function ReportSuccessModal({ onClose }: ReportSuccessModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* 배경 오버레이 */}
      <div
        className="absolute inset-0 bg-black bg-opacity-80"
        onClick={onClose}
      />

      {/* 모달 컨텐츠 */}
      <div className="relative bg-semantic-teriary rounded-[10px] w-[295px] mx-[20px]">
        {/* 헤더 */}
        <div className="flex flex-col justify-center items-center px-[32px] py-[22px] pb-[16px] ">
          <h3 className="title4 font-bold text-font-primary">신고가 완료되었습니다.</h3>
        </div>

        <div className="flex gap-[7px] justify-between items-center px-[32px] py-[16px]">
          <button className="w-full h-[42px] rounded-[8px] body1 font-medium transition-colors duration-200 bg-semantic-accent text-font-dark" onClick={onClose}>확인</button>
        </div>
      </div>
    </div>
  );
}