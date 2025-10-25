import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { META_MAP } from "@/app/chat/[roomId]/metaMap";
import ChatClient from "@/app/chat/[roomId]/ChatClient";

type ChatPageParams = {
  params: Promise<{ roomId: string }>;
}
// eslint-disable-next-line react-refresh/only-export-components
export async function generateMetadata(
  { params }: ChatPageParams
): Promise<Metadata> {
  const { roomId } = await params;

  const id = Number(roomId);
  const meta = META_MAP[id];

  // canonical, twitter 추가
  const canonical = `https://chatting.flichat.co.kr/chat/${id}`;

  return meta ?? {
    title: "FliChat 채팅방",
    description: "영화 팬 커뮤니티 실시간 채팅",
    alternates: { canonical },
    openGraph: {
      title: "FliChat 채팅방",
      description: "영화 팬 커뮤니티 실시간 채팅",
      url: canonical,
      siteName: "Flichat 플리챗",
      type: "website",
      locale: "ko_KR",
    },
    twitter: {
      card: "summary_large_image",
      title: "FliChat 채팅방",
      description: "영화 팬 커뮤니티 실시간 채팅",
    },
  };
}
export default async function Page({
  params,
}: ChatPageParams) {
  const { roomId } = await params;

  const id = Number(roomId);

  if (Number.isNaN(id)) {
    notFound();
  }

  const meta = META_MAP[id];
  if (!meta) {
    notFound();
  }

  return <ChatClient roomId={id} title={meta.title as string} />;
}