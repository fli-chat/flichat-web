import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-semantic-primary">
      <div className="text-center px-4">
        <h2 className="text-font-point title2 font-bold mb-4">
          채팅방을 찾을 수 없습니다
        </h2>
        <p className="text-font-secondary body1 mb-6">
          존재하지 않거나 삭제된 채팅방입니다.
        </p>
        <Link
          href="/qna"
          className="inline-block bg-primary text-semantic-primary px-6 py-3 rounded-lg font-medium"
        >
          홈으로 돌아가기
        </Link>
      </div>
    </div>
  );
}
