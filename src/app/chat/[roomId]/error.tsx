'use client'; // ✅ 에러 바운더리는 클라이언트 컴포넌트여야 함

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('채팅방 에러:', error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center h-dvh bg-semantic-primary">
      <div className="text-center px-4">
        <h2 className="text-font-point title2 font-bold mb-4">
          채팅방을 불러올 수 없습니다
        </h2>
        <p className="text-font-secondary body1 mb-6">
          {error.message || '일시적인 오류가 발생했습니다.'}
        </p>
        <button
          onClick={reset}
          className="bg-primary text-semantic-primary px-6 py-3 rounded-lg font-medium"
        >
          다시 시도
        </button>
      </div>
    </div>
  );
}
