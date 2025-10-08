import type { ApiResponse, NestedDataResponse } from "../type/apiBaseType";
import type { ChatMessage } from "../type/chat.type";
import { chatApi } from "./axios";

export class ChatApi {
  static async getChatHistory(roomId: number) {
    const response = await chatApi.get<ApiResponse<NestedDataResponse<ChatMessage[]>>>(`/api/v1/chat/rooms/${roomId}/messages`, {
      params: {
        size: 100,
      },
    });
    return response.data;
  }
} 