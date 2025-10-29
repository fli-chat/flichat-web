import Image from 'next/image';
import GoogleLoginButton from "./GoogleLoginButton";
import KakaoLoginButton from "./KakaoLoginButton";


interface LoginModalProps {
  roomId?: string;
  setIsLoginModalOpen: (isLoginModalOpen: boolean) => void;
}

export default function LoginModal({ setIsLoginModalOpen, roomId }: LoginModalProps) {
  return (
    <div className="fixed inset-0  flex items-center justify-center">
      <div className="bg-semantic-teriary rounded-[10px] shadow-xl max-w-[440px] w-full p-[20px]  overflow-y-auto md:w-[340px]">
        <div className="flex justify-end">
          <Image src="/icons/close.svg" alt="close" className="cursor-pointer" onClick={() => setIsLoginModalOpen(false)} width={24} height={24} />
        </div>

        <div className="pt-[80px] text-center flex flex-col gap-[4px]">
          <p className="font-semibold text-[18px] text-font-primary">플리챗에 로그인 후</p>
          <p className="font-semibold text-[18px] text-font-primary">실시간으로 더 많은 대화를 해보세요!</p>
        </div>

        <div className="flex flex-col items-center mx-auto gap-[12px]  pt-[80px] md:w-[300px]">
          <KakaoLoginButton roomId={roomId} />
          <GoogleLoginButton roomId={roomId} />
        </div>
      </div>
    </div>
  )
}