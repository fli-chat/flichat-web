import type { Metadata } from 'next';

// eslint-disable-next-line react-refresh/only-export-components
export const metadata: Metadata = {
  title: '피로몽(Piromong) 계정 및 데이터 삭제 안내',
  description:
    '피로몽(Piromong) 앱의 계정 및 데이터 삭제 방법, 처리 기간, 문의 채널을 안내합니다.',
};

const developerName = '이주현';
const supportEmail = 'teamtuesa@gmail.com';
const requestFormUrl = 'https://chatting.flichat.co.kr/qna';
const processingPeriod = '요청 접수 후 최대 30일';

export default function AccountDataDeletionPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-12 text-gray-900">
      <h1 className="text-3xl font-bold leading-tight">
        피로몽(Piromong) 계정 및 데이터 삭제 안내
      </h1>

      <section className="mt-8 space-y-3 text-base leading-7">
        <p>
          <strong>개발자:</strong> {developerName}
        </p>
        <p>
          <strong>앱 내 삭제 경로:</strong> 설정 &gt; 탈퇴하기
        </p>
        <p>
          <strong>요청 이메일:</strong> {supportEmail}
        </p>
        <p>
          <strong>대체 요청 채널(폼):</strong>{' '}
          <a className="text-blue-600 underline" href={requestFormUrl}>
            {requestFormUrl}
          </a>
        </p>
        <p>
          <strong>삭제 대상:</strong> 계정 정보 및 서비스 이용 데이터
        </p>
        <p>
          <strong>처리 기간:</strong> {processingPeriod}
        </p>
        <p>
          <strong>문의 연락처:</strong> {supportEmail}
        </p>
      </section>

      <hr className="my-10 border-gray-200" />

      <section className="space-y-3 text-base leading-7">
        <h2 className="text-2xl font-semibold">Account & Data Deletion (Piromong)</h2>
        <p>
          <strong>Developer:</strong> {developerName}
        </p>
        <p>
          <strong>In-app deletion path:</strong> Settings &gt; Delete Account
        </p>
        <p>
          <strong>Request email:</strong> {supportEmail}
        </p>
        <p>
          <strong>Alternative request channel (form):</strong>{' '}
          <a className="text-blue-600 underline" href={requestFormUrl}>
            {requestFormUrl}
          </a>
        </p>
        <p>
          <strong>Data to be deleted:</strong> Account information and service usage data
        </p>
        <p>
          <strong>Processing period:</strong> Up to 30 days after request receipt
        </p>
        <p>
          <strong>Contact:</strong> {supportEmail}
        </p>
      </section>
    </main>
  );
}
