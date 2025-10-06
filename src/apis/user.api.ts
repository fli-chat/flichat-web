import type { ApiResponse } from "../type/apiBaseType";
import { api } from "./axios";

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

export class UserApi {
  static async getUser() {
    const response = await api.get<ApiResponse<User>>('/api/v1/user/info');
    return response.data;
  }
}