import type { Metadata } from "next";
import ChatRoomClient from "@/app/chat/[roomId]/chatRoomClient";
import { META_MAP } from "@/app/chat/[roomId]/metaMap";

// eslint-disable-next-line react-refresh/only-export-components
export async function generateMetadata(
  { params }: { params: { roomId: number } }
): Promise<Metadata> {
  return META_MAP[params.roomId] ?? {
    title: "FliChat 채팅방",
    description: "영화 팬 커뮤니티 실시간 채팅",
  };
}



export default async function Page({ params }: { params: { roomId: number, title: string } }) {
  const { roomId } = params;


  // ✅ 동일한 데이터 소스 재사용
  const meta = META_MAP[roomId] ?? {
    title: "FliChat 채팅방",
    description: "영화 팬 커뮤니티 실시간 채팅",
  };

  // (선택) 방 존재여부/권한 체크(없으면 notFound())
  // const room = await fetchRoomMeta(roomId);
  // if (!room) notFound();

  return (
    <ChatRoomClient roomId={roomId} title={meta.title as string} />
  );
}