/* eslint-disable @typescript-eslint/no-explicit-any */
import KakaoLogin from "react-kakao-login";
import { AuthApi } from "../apis/auth.api";
import { setCookie } from "../utils/cookie";
import useAuthStore, { AuthStatus } from "../store/useAuth";
import { useRouter } from 'next/navigation';
import Image from 'next/image';

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
  const router = useRouter();

  const handleSuccess = async (kakaoData: any) => {
    const { id_token, access_token } = kakaoData.response;
    const response = await AuthApi.postLogin('KAKAO', id_token, access_token);
    console.log(response);
    const accessToken = response.data.accessToken;
    const refreshToken = response.data.refreshToken;

    if (response.code === 200) {
      if (response.data.isNewAccount) {
        alert('새로운 계정입니다. 앱에서 플리챗 회원가입을 진행해주세요.');
        return;
      }
      localStorage.setItem('accessToken', accessToken);
      setCookie('refreshToken', refreshToken, { path: '/' });
      useAuthStore.getState().setAuthStatus(AuthStatus.authorized);

      router.push('/chat');
      // window.location.reload();
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
          borderRadius: '4px',
          width: '100%',
        }}
      >
        <div className="relative w-full h-[48px] bg-[#FFE539] text-semantic-primary font-semibold rounded-[4px] flex items-center justify-center transition-all duration-200">
          <Image src="/icons/logo/kakao.svg" alt="Kakao" className="w-6 h-6 absolute left-4" width={24} height={24} />
          <p className="body1 text-font-dark font-medium">
            카카오로 시작하기
          </p>
        </div>
      </KakaoLogin>
    </>
  )
}