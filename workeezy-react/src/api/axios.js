import axios from "axios";

// 기본 API axios - 인증 정보는 HttpOnly Cookie로만 전달
export const api = axios.create({
    baseURL: "",
    withCredentials: true,
});

// refresh 전용 axios - 쿠키만 사용
export const refreshAxios = axios.create({
    baseURL: "",
    withCredentials: true,
});


// 응답 인터셉터 -401 → refresh 시도
// refresh 성공 시 기존 요청 그대로 재시도
api.interceptors.response.use(
    response => response,

    async (error) => {
        const originalRequest = error.config;

        // 인증 상태 확인용 401은 조용히 처리
        if (
            error.response?.status === 401 &&
            originalRequest?.meta?.silentAuth
        ) {
            // 아무 것도 안 함 = 비로그인 상태 확정
            return Promise.reject(error);
        }

        // 일반 API에서만 refresh 시도
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