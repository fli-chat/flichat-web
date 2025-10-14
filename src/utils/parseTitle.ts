/**
 * "<영화제목> 설명" 형식의 문자열을 파싱
 * @example
 * parseTitle("<어쩔수가 없다> 후기 채팅방 - 결말 해석 · 현실 반응")
 * // { movieTitle: "어쩔수가 없다", description: "후기 채팅방 - 결말 해석 · 현실 반응" }
 */
export function parseTitle(fullTitle: string): {
  movieTitle: string;
  description: string;
} {
  const match = fullTitle.match(/^<(.+?)>\s*(.*)$/);
  
  if (match) {
    return {
      movieTitle: match[1].trim(),
      description: match[2].trim(),
    };
  }
  
  // 매칭 실패 시 전체를 영화 제목으로 반환
  return {
    movieTitle: fullTitle,
    description: "",
  };
}

/**
 * 영화 제목만 추출
 */
export function extractMovieTitle(fullTitle: string): string {
  return parseTitle(fullTitle).movieTitle;
}

/**
 * 설명 부분만 추출
 */
export function extractDescription(fullTitle: string): string {
  return parseTitle(fullTitle).description;
}
