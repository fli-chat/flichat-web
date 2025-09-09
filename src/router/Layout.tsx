import { Outlet } from 'react-router-dom';

export default function Layout() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* 페이지 컨텐츠 */}
      <main className="w-full">
        <Outlet />
      </main>
    </div>
  );
}