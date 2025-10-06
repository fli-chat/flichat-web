/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { getCookie, setCookie } from "../utils/cookie";
import useAuth, { AuthStatus } from "../store/useAuth";
import { AuthApi } from "./auth.api";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
})

let isRefreshing = false; // 토큰 갱신 상태
let failedQueue: any = []; // 실패한 요청을 저장하는 큐

const processQueue = (error: any, token: any = null) => {
  failedQueue.forEach((prom: any) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

api.interceptors.response.use(
  response => response,
  async error => {
    const { config, response } = error;
    const status = response.status;

    if (
      config.url.includes('/refresh') && 
      status === 401
    ) {
      // root 페이지로 이동
      if (window.location.pathname !== '/') {
        window.location.replace('/chat/login');
      }
      await useAuth.getState().setAuthStatus(AuthStatus.unauthorized);

      return Promise.reject(error);
    }

    if (status === 401 && !config._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(token => {
            config.headers.Authorization = `Bearer ${token}`;
            return axios(config);
          })
          .catch(err => Promise.reject(err));
      }

      config._retry = true;
      isRefreshing = true;

      try {
        const storedRefreshToken = getCookie('refreshToken');
        const storedAccessToken = localStorage.getItem('accessToken');
        
        if (!storedAccessToken || !storedRefreshToken) {
          throw new Error('토큰이 없습니다.');
        }
          const { accessToken, refreshToken } =  await AuthApi.refreshToken(storedAccessToken, storedRefreshToken);
          if (
            accessToken &&
            refreshToken
          ) {
            localStorage.setItem('accessToken', accessToken);
            setCookie('refreshToken', refreshToken, { path: '/' });
            processQueue(null, accessToken);
          }

        return await api(config);
      } catch (err) {
        processQueue(err, null);
        return await Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);