import { Outlet } from "react-router-dom";

export default function ChatLayout() {
  return (
    <div className="h-screen max-w-[750px] bg-semantic-primary mx-auto">
      <Outlet />
    </div>
  )
}