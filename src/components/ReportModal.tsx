import close from "../assets/icons/close.svg";

interface ReportModalProps {
  selectedReason: string;
  onClose: () => void;
  handleReport: () => void;
  setSelectedReason: (reason: string) => void;
}

const REPORT_REASONS = [
  "불법촬영물",
  "음란물",
  "성희롱",
  "욕설/비방",
  "스팸/광고",
  "기타"
];

export default function ReportModal({ selectedReason, onClose, handleReport, setSelectedReason }: ReportModalProps) {


  const handleSubmit = async () => {
    if (selectedReason) {
      setSelectedReason("");

      handleReport();
    }
  };


  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        {/* 배경 오버레이 */}
        <div
          className="absolute inset-0 bg-black bg-opacity-50"
          onClick={onClose}
        />

        {/* 모달 컨텐츠 */}
        <div className="relative bg-semantic-teriary rounded-[10px] w-[295px] mx-[20px]">
          {/* 헤더 */}
          <div className="flex justify-between items-center p-[20px] ">
            <h3 className="title4 font-bold text-font-primary">신고 사유</h3>
            <img
              src={close}
              alt="close"
              className="cursor-pointer w-[24px] h-[24px] hover:opacity-70 transition-opacity duration-200"
              onClick={onClose}
            />
          </div>

          {/* 신고 사유 선택 */}
          <div className="px-[20px] py-[16px]">
            <div className="flex flex-col gap-[16px]">
              {REPORT_REASONS.map((reason) => (
                <label
                  key={reason}
                  className="flex items-center gap-[12px] cursor-pointer py-[2px]  rounded-[8px]  transition-colors duration-200 "
                  onClick={() => setSelectedReason(reason)}
                >
                  <div className="w-[26px] h-[26px] rounded-full border border-grayscale-gray3 relative">
                    <div className={`w-[14px] h-[14px] rounded-full ${selectedReason === reason ? 'bg-semantic-accent' : 'bg-semantic-teriary'} absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2`} />
                  </div>
                  <span className="body1 font-medium text-font-primary">{reason}</span>
                </label>
              ))}
            </div>
          </div>

          {/* 신고하기 버튼 */}
          <div className="px-[20px] pb-[20px] pt-[40px]">
            <button
              onClick={handleSubmit}
              disabled={!selectedReason}
              className={`w-full h-[42px] rounded-[8px] body1 font-medium transition-colors duration-200 ${selectedReason
                ? 'bg-semantic-accent text-semantic-primary'
                : 'bg-semantic-fourth text-font-disabled cursor-not-allowed'
                }`}
            >
              신고하기
            </button>
          </div>
        </div>
      </div>


    </>

  );
}
