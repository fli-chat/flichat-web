export interface ChatMessage {
  id: string | null;
  message: string;
  profileColorType: 'BLUE' | 'PURPLE' | 'RED' | 'GREEN' | 'YELLOW' | null;
  roomId: string;
  sender: string;
  timeStamp: string;
  userId: string;
  clientMessageId: string;
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
