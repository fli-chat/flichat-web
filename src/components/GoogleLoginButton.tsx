import React from 'react';
import { GoogleLogin, GoogleOAuthProvider, type CredentialResponse } from '@react-oauth/google';
import { useRouter } from 'next/navigation';
// import Image from 'next/image';
import { AuthApi } from '@/apis/auth.api';
import { setCookie } from '@/utils/cookie';
import useAuthStore, { AuthStatus } from '@/store/useAuth';
import { useMutation } from '@tanstack/react-query';
import { ChatApi } from '@/apis/chat.api';
import { UserApi } from '@/apis/user.api';
import mixpanel from 'mixpanel-browser';


declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    google: any;
  }
}

const GoogleLoginButton = ({ roomId }: { roomId?: string }) => {
  const router = useRouter();
  const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

  const { mutateAsync: postChatEntryMutation } = useMutation({
    mutationFn: (chatRoomId: string) => ChatApi.postChatEntry(chatRoomId),
  })

  const handleSuccess = async (credentialResponse: CredentialResponse) => {
    // 구글에서 발급한 JWT(id_token)
    const idToken = credentialResponse.credential;

    if (!idToken) {
      console.log('idToken is null');
      return;
    }

    const response = await AuthApi.postLogin('GOOGLE_WEB', '', idToken);

    const accessToken = response.data.accessToken;
    const refreshToken = response.data.refreshToken;


    if (response.code === 200) {
      localStorage.setItem('accessToken', accessToken);
      setCookie('refreshToken', refreshToken, { path: '/' });
      useAuthStore.getState().setAuthStatus(AuthStatus.authorized);

      if (response.data.isNewAccount) {
        router.push('/chat/register');
        return;
      }

      const userInfoResponse = await UserApi.getUser();

      if (userInfoResponse.code === 200) {
        mixpanel.people.set({
          $nickName: userInfoResponse.data.nickName,
          $userId: userInfoResponse.data.userId,
        });
      }

      router.push('/chat');

      mixpanel.track('login_google_web');

      if (roomId) {
        postChatEntryMutation(roomId);
      }

      window.location.reload();
    }
  }


  return (
    <GoogleOAuthProvider clientId={`${GOOGLE_CLIENT_ID}`}>
      <div className='relative w-full cursor-pointer md:hidden'>
        <div className="relative w-full h-[48px] bg-transparent font-semibold rounded-[4px] flex items-center justify-center transition-all duration-200 cursor-pointer">
          {/* <Image src="/icons/logo/google.svg" alt="google" className="w-6 h-6 absolute left-4" width={24} height={24} />
          <p className="body1 text-font-point font-medium">
            Google로 시작하기
          </p> */}
        </div>

        <div className="absolute inset-0 opacity-100 cursor-pointer z-20">
          <GoogleLogin
            onSuccess={handleSuccess}
            onError={() => { console.log('error'); }}
            useOneTap={false}
            theme="outline"
            size="large"
            width="450"
            auto_select={false}
            text="continue_with"
            shape="square"
            logo_alignment="left"
            locale="ko"
          />
        </div>
      </div>

      <div className='relative w-full cursor-pointer hidden md:block'>
        <div className="relative w-full h-[48px] bg-transparent font-semibold rounded-[4px] flex items-center justify-center transition-all duration-200 cursor-pointer">
          {/* <Image src="/icons/logo/google.svg" alt="google" className="w-6 h-6 absolute left-4" width={24} height={24} />
          <p className="body1 text-font-point font-medium">
            Google로 시작하기
          </p> */}
        </div>

        <div className="absolute inset-0 opacity-100 cursor-pointer z-20">
          <GoogleLogin
            onSuccess={handleSuccess}
            onError={() => { console.log('error'); }}
            useOneTap={false}
            theme="outline"
            size="large"
            width="300"
            auto_select={false}
            text="continue_with"
            shape="square"
            logo_alignment="left"
            locale="ko"
          />
        </div>
      </div>
    </GoogleOAuthProvider>
  );
};

export default GoogleLoginButton;