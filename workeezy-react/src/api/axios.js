import axios from "axios";

/**
 * 기본 API axios
 * - accessToken은 Authorization 헤더로만 전송
 * - refreshToken은 HttpOnly 쿠키로 자동 전송
 */
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true, // refreshToken 쿠키 전송용
});

/**
 * refresh 전용 axios
 * - Authorization 헤더 절대 붙이지 않음
 */
const refreshAxios = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true,
});

/**
 * 요청 인터셉터
 * - 모든 요청에 accessToken을 Authorization 헤더로 첨부
 */
api.interceptors.request.use((config) => {
    const accessToken = localStorage.getItem("accessToken");

    if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
});

/**
 * 응답 인터셉터
 * - 401 → refresh 시도
 * - refresh 성공 시 기존 요청 재시도
 */
api.interceptors.response.use(
    (response) => response,

    async (error) => {
        const originalRequest = error.config;
        const status = error.response?.status;

        // accessToken 만료 → refresh 시도
        if (status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                // refreshToken은 쿠키로 자동 전송됨
                const refreshRes = await refreshAxios.post("/api/auth/refresh");

                // 서버가 내려준 새 accessToken
                const newAccessToken = refreshRes.data.token;

                // accessToken 갱신
                localStorage.setItem("accessToken", newAccessToken);

                // 재요청 헤더 갱신
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

                return api(originalRequest);
            } catch (refreshError) {
                console.error("🔥 refresh 실패 → 로그아웃 처리");

                localStorage.removeItem("accessToken");
                localStorage.removeItem("profileVerified");

                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default api;