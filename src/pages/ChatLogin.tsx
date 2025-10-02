import logo from "../assets/icons/logo.svg";
import kakao from "../assets/icons/logo/kakao.svg";
import apple from "../assets/icons/logo/apple.svg";
import { useNavigate } from "react-router-dom";
import GoogleLoginButton from "../components/GoogleLoginButton";

export default function ChatLogin() {
  const navigate = useNavigate();

  const handleKakaoLogin = () => {
    // 카카오 로그인 로직
    navigate('/chat');
  }

  const handleAppleLogin = () => {
    // Apple 로그인 로직
    navigate('/chat');
  }

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
      <div className="w-full flex flex-col items-center space-y-[12px] mb-[104px]">
        {/* 카카오로 시작하기 */}
        <button onClick={handleKakaoLogin} className="relative w-[450px] h-[48px] bg-[#FFE539] hover:bg-opacity-90 text-semantic-primary font-semibold rounded-[4px] flex items-center justify-center transition-all duration-200">
          <div className="absolute left-4">
            <img src={kakao} alt="Kakao" className="w-6 h-6" />
          </div>
          <p className="body1 text-font-dark font-medium">
            카카오로 시작하기
          </p>
        </button>

        {/* Apple로 시작하기 */}
        <button onClick={handleAppleLogin} className="relative w-[450px] h-[48px] bg-[#fff] hover:bg-opacity-90 text-semantic-primary font-semibold rounded-[4px] flex items-center justify-center transition-all duration-200">
          <div className="absolute left-4">
            <img src={apple} alt="Apple" className="w-6 h-6" />
          </div>
          <p className="body1 text-font-dark font-medium">
            Apple로 시작하기
          </p>
        </button>

        {/* Google로 시작하기 - 컴포넌트 사용 */}
        <GoogleLoginButton />
      </div>
    </div>
  );
}