import useAuth from "../hooks/useAuth";
import {AuthContext} from "./AuthContext";

export default function AuthProvider({children}) {
    const auth = useAuth(); // 여기서 단 1번만 실행

    return (
        <AuthContext.Provider value={auth}>
            {children}
        </AuthContext.Provider>
    );
}