import { useEffect, useRef } from "react";


declare global {
  interface Window {
    google: any;
  }
}

export default function useLogin() {
  const btnRef = useRef<HTMLDivElement>(null);


  useEffect(() => {
    if (!window.google || !btnRef.current) return;

    window.google.accounts.id.initialize({
      client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
      callback: async (response: any) => {
        const idToken = response.credential;

        // 서버에 전송 (앱과 동일한 페이로드 규격)
        await fetch('http://localhost:4000/auth/social', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
            oauthProvider: 'GOOGLE',
            token: idToken,
          }),
        });
      },
    });

    window.google.accounts.id.renderButton(btnRef.current, {
      theme: 'outline',
      size: 'large',
      width: '260',
    });
  }, []);

  return {
    btnRef,
  };
}