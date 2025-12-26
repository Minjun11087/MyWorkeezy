import axios from "axios";

// 기본 API axios - 인증 정보는 HttpOnly Cookie로만 전달
export const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true,
});

// refresh 전용 axios - 쿠키만 사용
export const refreshAxios = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true,
});


// 응답 인터셉터 -401 → refresh 시도
// refresh 성공 시 기존 요청 그대로 재시도
api.interceptors.response.use(
    response => response,
    async (error) => {
        const originalRequest = error.config;

        // refresh 요청 자체는 제외
        // if (originalRequest.url.includes("/api/auth/refresh")) {
        //     return Promise.reject(error);
        // }

        // silentAuth 요청은 refresh 시도 X
        if (
            error.response?.status === 401 &&
            originalRequest?.meta?.silentAuth
        ) {
            return Promise.reject(error);
        }

        // 일반 API만 refresh 시도
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                await refreshAxios.post("/api/auth/refresh");
                return api(originalRequest);
            } catch {
                return Promise.reject(error);
            }
        }

        return Promise.reject(error);
    }
);

export default api;