import { MetadataRoute } from "next";
import { META_MAP } from "./chat/[roomId]/metaMap";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://chatting.flichat.co.kr";
  
  const rooms = Object.keys(META_MAP).map((k) => ({
    url: `${base}/chat/${k}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: 0.8,
  }));

  return [
    { url: `${base}/`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 1 },
    { url: `${base}/chat`, lastModified: new Date(), changeFrequency: "daily" as const, priority: 0.9 },
    { url: `${base}/qna`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.7 },
    {
      url: `${base}/account-data-deletion`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
    ...rooms,
  ];
}
