'use client';

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.push('/qna');
  }, [router]);

  return (
    <div>
      <h1>Home</h1>
    </div>
  );
}