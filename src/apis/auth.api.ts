import { api } from "./axios";

export class AuthApi {
  static async postLogin(oauthProvider: "KAKAO" | "GOOGLE" | "GOOGLE_WEB", identifier: string, token: string) {
    const response = await api.post('/api/v1/oauth/login', {
      oauthProvider,
      identifier,
      token,
    });
   return response.data;
  }

  static async refreshToken(accessToken: string, refreshToken: string) {
    const response = await api.post<{ accessToken: string, refreshToken: string }>('/api/v1/oauth/refresh', {
      accessToken,
      refreshToken,
    });
    return response.data;
  }

  static async postLogout() {
    const response = await api.post('/api/v1/oauth/logout');
    return response.data;
  }
}