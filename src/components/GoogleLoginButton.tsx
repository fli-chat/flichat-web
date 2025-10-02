import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import google from "../assets/icons/logo/google.svg";
import { GoogleLogin, GoogleOAuthProvider, type CredentialResponse } from '@react-oauth/google';
import { api } from '../apis/axios';

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
  const navigate = useNavigate();

  const handleSuccess = async (credentialResponse: CredentialResponse) => {
    // 구글에서 발급한 JWT(id_token)
    const idToken = credentialResponse.credential;

    console.log(credentialResponse);
    const response = await api.post('/api/v1/oauth/login', {
      oauthProvider: 'GOOGLE',
      identifier: '',
      token: idToken,

    });

    if (response.status === 200) {
      navigate('/chat');
    }
  }


  return (
    <GoogleOAuthProvider clientId="430508454350-rkt5ue8tjk5qkroddliv2nb0d1po51gr.apps.googleusercontent.com">
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={() => { console.log('error'); }}
      />
    </GoogleOAuthProvider>
  );
};

export default GoogleLoginButton;