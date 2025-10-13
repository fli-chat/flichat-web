/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";
import { getCookie, setCookie } from "../utils/cookie";
import { AuthApi } from "./auth.api";

type RetriableConfig = InternalAxiosRequestConfig & { _retry?: boolean };

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: { "Content-Type": "application/json" },
});

export const chatApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_CHAT_API_URL,
  headers: { "Content-Type": "application/json" },
});

const withAuthHeader = (config: InternalAxiosRequestConfig, token: string) => {
  config.headers = config.headers ?? {};
  (config.headers as any).Authorization = `Bearer ${token}`;
  return config;
};

// ===== Request interceptors =====
const attachAccessToken = (config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem("accessToken");
  if (token) withAuthHeader(config, token);
  return config;
};

api.interceptors.request.use(attachAccessToken, Promise.reject);
chatApi.interceptors.request.use(attachAccessToken, Promise.reject);

// ===== Refresh queue state =====
let isRefreshing = false;
let failedQueue: Array<{ resolve: (t: string) => void; reject: (e: any) => void }> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error || !token) reject(error || new Error("No refreshed token"));
    else resolve(token);
  });
  failedQueue = [];
};

// const redirectToLogin = async () => {
//   if (window.location.pathname !== "/") {
//     window.location.replace("/chat/login");
//   }
//   await useAuth.getState().setAuthStatus(AuthStatus.unauthorized);
// };

// 공통 401 처리기: 어떤 axios 인스턴스에서 호출됐는지에 따라 재시도 시 인스턴스를 주입
const makeResponseInterceptor =
  (client: typeof api) =>
  async (response: any) => {
    console.log('client', client);
    return response;
  };

/**
 * 공통 에러 처리(401 → refresh → 재시도)
 * - 현재 인스턴스(client)로 재시도
 */
const makeErrorInterceptor =
  (client: typeof api) =>
  async (error: AxiosError) => {
    const originalConfig = (error.config || {}) as RetriableConfig;

    // 응답 자체가 없으면(네트워크 등) 그대로 던짐
    if (!error.response) {
      return Promise.reject(error);
    }

    const status = error.response.status;

    // refresh 호출이 401이면 즉시 로그아웃/리다이렉트
    // if (originalConfig.url?.includes("/refresh") && status === 401) {
    //   await redirectToLogin();
    //   return Promise.reject(error);
    // }

    // 401 처리
    if (status === 401 && !originalConfig._retry) {
      if (isRefreshing) {
        // 새 토큰이 나올 때까지 대기
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: (token: string) => {
                try {
                  originalConfig.headers = { ...(originalConfig.headers as any) };
                  withAuthHeader(originalConfig, token);
                  resolve(client.request(originalConfig)); 
              } catch (e) {
                reject(e);
              }
            },
            reject,
          });
        });
      }

      originalConfig._retry = true;
      isRefreshing = true;

      try {
        const storedAccessToken = localStorage.getItem("accessToken");
        const storedRefreshToken = getCookie("refreshToken");

        if (!storedAccessToken || !storedRefreshToken) {
          throw new Error("토큰이 없습니다.");
        }

        const { accessToken, refreshToken } = await AuthApi.refreshToken(
          storedAccessToken,
          storedRefreshToken
        );

        if (!accessToken || !refreshToken) {
          throw new Error("토큰 갱신 실패");
        }

        // 새 토큰 저장
        localStorage.setItem("accessToken", accessToken);
        setCookie("refreshToken", refreshToken, {
          path: "/",
          // 운영 환경에서는 보안 옵션 권장
          secure: true,
          sameSite: "Lax",
        });

        // 대기 중이던 요청들 처리
        processQueue(null, accessToken);

        // 현재 실패했던 이 요청에도 새 토큰 주입해서 재시도
        withAuthHeader(originalConfig, accessToken);
        return client(originalConfig);
      } catch (refreshErr) {
        // 대기열 전부 실패 처리
        processQueue(refreshErr, null);
        // await redirectToLogin();
        return Promise.reject(refreshErr);
      } finally {
        isRefreshing = false;
      }
    }

    // 기타 에러는 그대로
    return Promise.reject(error);
  };

// ===== Response interceptors 등록 =====
api.interceptors.response.use(makeResponseInterceptor(api), makeErrorInterceptor(api));
chatApi.interceptors.response.use(makeResponseInterceptor(chatApi), makeErrorInterceptor(chatApi));