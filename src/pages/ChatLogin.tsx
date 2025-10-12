import logo from "../assets/icons/logo.svg";
import GoogleLoginButton from "../components/GoogleLoginButton";
import KakaoLoginButton from "../components/KakaoLoginButton";

export default function ChatLogin() {

  return (
    <div className="min-h-screen flex flex-col items-center justify-end">
      {/* 로고 및 텍스트 영역 */}
      <div className="flex flex-col items-center justify-center mb-[347px]">
        {/* 로고 */}
        <div className="flex items-center mb-6">
          <img src={logo} alt="Flichat" className="w-[175px] h-[27px]" />
        </div>

        {/* 서브 텍스트 */}
        <p className="text-font-point body1">
          지금 보는 그 장면, 같이 떠들어봐
        </p>
      </div>

      {/* 로그인 버튼들 */}
      <div className="w-[450px] flex flex-col items-center space-y-[12px] mb-[104px] md:w-[320px]">
        <KakaoLoginButton />
        <GoogleLoginButton />
      </div>
    </div>
  );
}