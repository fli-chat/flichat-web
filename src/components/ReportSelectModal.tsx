interface ReportSelectModalProps {
  onClickReportSuccess: () => void;
  onClose: () => void;
}

export default function ReportSelectModal({ onClickReportSuccess, onClose }: ReportSelectModalProps) {

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
          <h3 className="title4 font-bold text-font-primary">이 사용자를</h3>
          <h3 className="title4 font-bold text-font-primary">신고하시겠습니까?</h3>
        </div>



        {/* 신고하기 버튼 */}
        <div className="flex gap-[7px] justify-between items-center px-[32px] py-[16px]">
          <button className="w-full h-[42px] rounded-[8px] body1 font-medium transition-colors duration-200 bg-semantic-fourth text-font-primary" onClick={onClose}>취소</button>
          <button className="w-full h-[42px] rounded-[8px] body1 font-medium transition-colors duration-200 bg-semantic-accent text-semantic-primary" onClick={onClickReportSuccess}>확인</button>
        </div>
      </div>
    </div>
  );
}