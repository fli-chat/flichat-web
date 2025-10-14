import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { META_MAP } from "@/app/chat/[roomId]/metaMap";
import ChatClient from "@/app/chat/[roomId]/ChatClient";

// eslint-disable-next-line react-refresh/only-export-components
export async function generateMetadata(
  { params }: { params: { roomId: string } }
): Promise<Metadata> {
  const id = Number(params.roomId);
  const meta = META_MAP[id];

  return (
    meta ?? {
      title: "FliChat 채팅방",
      description: "영화 팬 커뮤니티 실시간 채팅",
    }
  );
}

export default async function Page({
  params,
}: {
  params: { roomId: string };
}) {
  const id = Number(params.roomId);

  if (Number.isNaN(id)) {
    notFound();
  }

  const meta = META_MAP[id];
  if (!meta) {
    notFound();
  }

  return <ChatClient roomId={id} title={meta.title as string} />;
}