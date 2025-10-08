import close from "../assets/icons/close.svg";
import GoogleLoginButton from "./GoogleLoginButton";
import KakaoLoginButton from "./KakaoLoginButton";


interface LoginModalProps {
  setIsLoginModalOpen: (isLoginModalOpen: boolean) => void;
}

export default function LoginModal({ setIsLoginModalOpen }: LoginModalProps) {
  return (
    <div className="fixed inset-0  flex items-center justify-center">
      <div className="bg-semantic-teriary rounded-[10px] shadow-xl max-w-[440px] w-full p-[20px]  overflow-y-auto">
        <div className="flex justify-end">
          <img src={close} alt="close" className="cursor-pointer" onClick={() => setIsLoginModalOpen(false)} />
        </div>

        <div className="pt-[80px] text-center flex flex-col gap-[4px]">
          <p className="font-bold text-[18px] text-font-primary">플리챗에 로그인 후</p>
          <p className="font-bold text-[18px] text-font-primary">실시간으로 더 많은 대화를 해보세요!</p>
        </div>

        <div className="flex flex-col gap-[12px]  w-[400px] pt-[80px]">
          <KakaoLoginButton />
          <GoogleLoginButton />
        </div>
      </div>
    </div>
  )
}