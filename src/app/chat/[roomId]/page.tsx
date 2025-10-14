import type { Metadata } from "next";
import ChatRoomClient from "@/app/chat/[roomId]/chatRoomClient";
import { META_MAP } from "@/app/chat/[roomId]/metaMap";

// eslint-disable-next-line react-refresh/only-export-components
export async function generateMetadata(
  { params }: { params: Promise<{ roomId: number }> }
): Promise<Metadata> {
  const { roomId } = await params;

  return META_MAP[roomId] ?? {
    title: "FliChat 채팅방",
    description: "영화 팬 커뮤니티 실시간 채팅",
  };
}

export default async function Page({
  params
}: {
  params: Promise<{ roomId: number }>
}) {
  const { roomId } = await params;

  const meta = META_MAP[roomId] ?? {
    title: "FliChat 채팅방",
    description: "영화 팬 커뮤니티 실시간 채팅",
  };

  return (
    <ChatRoomClient roomId={roomId} title={meta.title as string} />
  );
}