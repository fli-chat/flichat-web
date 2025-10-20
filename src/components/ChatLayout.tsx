import { Outlet } from "react-router-dom";
import UserSidebar from "./UserSidebar";
import { useSidebar } from "../store/useSidebar";

export default function ChatLayout() {
  const { isOpen } = useSidebar();


  return (
    <div className="relative h-dvh max-w-[750px] bg-semantic-primary mx-auto overflow-hidden">
      <Outlet />

      {isOpen && (
        <UserSidebar />
      )}
    </div>
  )
}