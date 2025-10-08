export interface ChatMessage {
  id: string;
  message: string;
  profileColorType: 'BLUE' | 'PURPLE' | 'RED' | 'GREEN' | 'YELLOW' | null;
  roomId: string;
  sender: string;
  timeStamp: string;
  userId: number;
}

export interface ChatRoom {
  chatRoomId: number;
  title: string;
  genre: string;
  releaseYear: string;
  posterUrl: string;
  alarmOn: boolean;
  joinedUserCount: number;
}
