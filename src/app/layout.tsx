import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import RQProvider from '@/libs/RQProvider';
import { Toaster } from 'react-hot-toast';
import MixpanelProvider from '@/libs/MixpanelProvider';

const inter = Inter({ subsets: ['latin'] });

// eslint-disable-next-line react-refresh/only-export-components
export const metadata: Metadata = {
  title: '플리챗',
  description: '최신 영화와 콘텐츠를 주제로 다양한 사람들과 실시간으로 소통하고 토론할 수 있는 오픈채팅 플랫폼입니다.',
  keywords: '플리챗, 영화, 채팅, 실시간, 토론, 콘텐츠, 오픈채팅, Flichat',
  icons: {
    icon: '/favicon.svg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <html lang="ko">
      <head>
        <meta name="google-site-verification" content="_uCvUXZVi-dzExe44ojvjnUdfgFn98SyQSD8jEL5GCY" />
        <meta name="naver-site-verification" content="c4823fbc1c0582f9be53f316de9f7ac4c8a65fbf" />
      </head>
      <body className={inter.className}>
        <MixpanelProvider>

          <RQProvider>
            {children}
          </RQProvider>
        </MixpanelProvider>

        <Toaster
          position="top-center"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#363636',
              color: '#fff',
            },
          }}
        />
      </body>
    </html>
  );
}