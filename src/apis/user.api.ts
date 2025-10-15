import type { ApiResponse } from "../type/apiBaseType";
import { api, chatApi } from "./axios";

export enum ProfileColorType {
  YELLOW = 'YELLOW',
  RED = 'RED',
  GREEN = 'GREEN',
  BLUE = 'BLUE',
  PURPLE = 'PURPLE',
}

interface User { 
  userId: string;
  nickName: string;
  profileColorType: ProfileColorType;
}
export interface ReportPayload {
  chatRoomName: string;
  reporterId: string;
  reporterdUserId: string;
  reportedMessageId: string;
  reportedMessageContent: string;
  reportType: string;
  message: string;
}

export class UserApi {
  static async getUser() {
    const response = await api.get<ApiResponse<User>>('/api/v1/user/info');
    return response.data;
  }

  // 신고하기
  static async postReport(reportPayload: ReportPayload) {
    const response = await chatApi.post('/api/v1/report', {
      chatRoomName: reportPayload.chatRoomName,
      reporterId: reportPayload.reporterId,
      reporterdUserId: reportPayload.reporterdUserId,
      reportedMessageId: reportPayload.reportedMessageId,
      reportedMessageContent: reportPayload.reportedMessageContent,
      reportType: reportPayload.reportType,
      message: reportPayload.message,
    });
    return response.data;
  }

  static async postBlock(blockedUserId: string, chatRoomId: number) {
    const response = await chatApi.post('/api/v1/block', {
      blockedUserId,
      chatRoomId,
    });
    return response.data;
  }

  static async patchUserProfile(profileColorType: ProfileColorType, nickName: string) {
    const response = await api.patch(`/api/v1/user/detail`, 
      {
      profileColorType,
      nickName,
    },
  
  );
    return response.data;
  }
}