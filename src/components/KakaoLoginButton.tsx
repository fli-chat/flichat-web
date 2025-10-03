import KakaoLogin from "react-kakao-login";
import { api } from "../apis/axios";
import { useNavigate } from "react-router-dom";
import kakao from "../assets/icons/logo/kakao.svg";

// interface KakaoResponse {
//   profile: {
//     connected_at: string;
//     id: number;
//   }
//   response: {
//     access_token: string;
//     expires_in: number;
//     id_token: string;
//     refresh_token: string;
//     refresh_token_expires_in: number;
//     token_type: string;
//   }
// }
export default function KakaoLoginButton() {
  const navigate = useNavigate();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSuccess = async (kakaoData: any) => {
    const response = await api.post('/api/v1/oauth/login', {
      oauthProvider: 'KAKAO',
      identifier: kakaoData.response.id_token,
      token: kakaoData.response.access_token,
    });

    if (response.status === 200) {
      navigate('/chat');
    }
  }

  return (
    <>
      <KakaoLogin
        token="90dae4b1b418922811579bf331dd82cf"
        onSuccess={handleSuccess}
        onFail={() => { console.log('error'); }}
        style={{
          backgroundColor: '#FFE539',
          color: '#141517',
          fontSize: '16px',
          fontWeight: 'bold',
        }}
      >
        <button className="relative w-[450px] h-[48px] bg-[#FFE539]  text-semantic-primary font-semibold rounded-[4px] flex items-center justify-center transition-all duration-200">
          <img src={kakao} alt="Kakao" className="w-6 h-6 absolute left-4" />
          <p className="body1 text-font-dark font-medium">
            카카오로 시작하기
          </p>
        </button>
      </KakaoLogin>
    </>
  )
}