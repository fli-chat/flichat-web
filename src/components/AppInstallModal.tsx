import { useEffect } from "react";
import Image from 'next/image';
import mixpanel from "mixpanel-browser";
interface AppInstallModalProps {
  setIsAppInstallModalOpen: (isOpen: boolean) => void;
}

export default function AppInstallModal({ setIsAppInstallModalOpen }: AppInstallModalProps) {
  const APP_STORE_URL = 'https://apps.apple.com/kr/app/%ED%94%8C%EB%A6%AC%EC%B1%97/id6746469918';
  const GOOGLE_PLAY_URL = 'https://play.google.com/store/apps/details?id=com.flichat.app'

  useEffect(() => {
    // ESC 키로 닫기
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsAppInstallModalOpen(false);
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [setIsAppInstallModalOpen]);

  const handleBackgroundClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setIsAppInstallModalOpen(false);
    }
  };

  const handleInstall = () => {
    // 앱 설치 로직 (App Store / Google Play 이동)
    // iOS 감지
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isMac = /Macintosh|MacIntel|MacPPC|Mac68K/.test(navigator.userAgent);

    if (isIOS || isMac) {
      window.location.href = `${APP_STORE_URL}`;
      mixpanel.track('click_install', { platform: isIOS ? 'ios' : 'mac' });
    } else {
      window.location.href = `${GOOGLE_PLAY_URL}`;
      mixpanel.track('click_install', { platform: 'android' });
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-end justify-center z-50"
      onClick={handleBackgroundClick}
    >
      <div className="bg-semantic-teriary w-full max-w-[750px] rounded-t-[10px] p-[20px] animate-slide-up">
        <div className="flex justify-end">
          <Image src="/icons/close.svg" alt="close" className="cursor-pointer" onClick={() => setIsAppInstallModalOpen(false)} width={24} height={24} />
        </div>

        <div className="flex flex-col justify-between h-[148px] mt-[20px]">
          <div className="flex flex-col gap-[10px] ">
            <p className="title4 font-bold text-font-primary">앱에서 더 편하게 실시간 채팅을 즐겨보세요!</p>
            <p className="font-medium text-font-secondary text-[16px]">OTT 인기 콘텐츠 채팅방에도 참여할 수 있습니다.</p>
          </div>

          <button
            onClick={handleInstall}
            className="bg-system-mint h-[48px] w-full rounded-[4px] body1 font-medium text-font-dark"
          >
            앱에서 실시간 채팅하기
          </button>
        </div>
      </div>
    </div >
  );
}
