import React from 'react';
import { GoogleLogin, GoogleOAuthProvider, type CredentialResponse } from '@react-oauth/google';
import { api } from '../apis/axios';
import { useRouter } from 'next/navigation';
import Image from 'next/image';


declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    google: any;
  }
}

interface GoogleLoginButtonProps {
  className?: string;
}

const GoogleLoginButton: React.FC<GoogleLoginButtonProps> = () => {
  const router = useRouter();

  const handleSuccess = async (credentialResponse: CredentialResponse) => {
    // 구글에서 발급한 JWT(id_token)
    const idToken = credentialResponse.credential;

    console.log(credentialResponse);
    const response = await api.post('/api/v1/oauth/login', {
      oauthProvider: 'GOOGLE_WEB',
      identifier: '',
      token: idToken,

    });
    if (response.status === 200) {
      router.push('/chat');
      // window.location.reload();
    }
  }


  return (
    <GoogleOAuthProvider clientId="430508454350-rkt5ue8tjk5qkroddliv2nb0d1po51gr.apps.googleusercontent.com">
      <div className='relative w-full cursor-pointer'>
        <div className="relative w-full h-[48px] bg-transparent border border-font-point font-semibold rounded-[4px] flex items-center justify-center transition-all duration-200 cursor-pointer">
          <Image src="/icons/logo/google.svg" alt="google" className="w-6 h-6 absolute left-4" width={24} height={24} />
          <p className="body1 text-font-point   font-medium">
            Google로 시작하기
          </p>
        </div>

        <div className="absolute inset-0 opacity-0 pointer-events-auto border border-red-700">
          <GoogleLogin
            onSuccess={handleSuccess}
            onError={() => { console.log('error'); }}
            useOneTap={false}
            theme="outline"
            size="large"
            width="450"
            text="continue_with"
            shape="square"
            logo_alignment="left"
            locale="ko"
            auto_select={false}
          />
        </div>
      </div>
    </GoogleOAuthProvider>
  );
};

export default GoogleLoginButton;