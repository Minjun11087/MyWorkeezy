import {useEffect} from "react";
import {useNavigate} from "react-router-dom";
import {useAuthContext} from "../../auth/AuthContext";

export default function ProfileGuard({children}) {
    const navigate = useNavigate();
    const {user, isAuthenticated, loading} = useAuthContext();

    useEffect(() => {
        if (loading) return;

        // user 로딩 전에는 아무 것도 하지 말 것
        if (isAuthenticated && user == null) {
            return;
        }

        // 미로그인
        if (!isAuthenticated) {
            navigate("/login", {replace: true});
            return;
        }

        // 로그인은 했지만 프로필 미검증
        if (user.profileVerified === false) {
            navigate("/profile-check", {replace: true});
        }
    }, [loading, isAuthenticated, user, navigate]);

    if (loading || (isAuthenticated && user == null)) {
        return null;
    }

    return children;
}