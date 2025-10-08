export function formatKoreanTime(isoString: string) {
  // UTC 시간으로 파싱
  const utcDate = new Date(isoString + 'Z'); // Z를 붙여서 UTC로 명시

  // 한국 시간대로 변환
  return utcDate.toLocaleTimeString('ko-KR', {
    timeZone: 'Asia/Seoul',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}