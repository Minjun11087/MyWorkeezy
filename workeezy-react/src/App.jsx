import { Routes, Route } from "react-router-dom";

import PrivateRoute from "./route/PrivateRoute";
import ProfileGuard from "./route/ProfileGuard";

import LoginPage from "./pages/LoginPage";
import Home from "./pages/Home";
import MyPage from "./pages/MyPage";
import ProfilePasswordCheck from "./pages/ProfilePasswordCheck";

import ProgramDetailPage from "./pages/ProgramDetailPage";
import ReviewPage from "./pages/ReviewPage";
import SearchPage from "./pages/SearchPage";
import NewReservationPage from "./pages/NewReservationPage";
import ModifyReservationPage from "./pages/ModifyReservationPage";


export default function App() {
    return (
        <Routes>
            <Route path="/" element={<Home/>}/>
            <Route path="/login" element={<LoginPage/>}/>

            {/* 비밀번호 재확인 단계 */}
            <Route
                path="/profile-check"
                element={
                    <PrivateRoute>
                        <ProfilePasswordCheck />
                    </PrivateRoute>
                }
            />

            {/* 마이페이지 */}
            <Route
                path="/profile"
                element={
                    <PrivateRoute>
                        <ProfileGuard>
                            <MyPage />
                        </ProfileGuard>
                    </PrivateRoute>
                }
            />

            {/* 기타 페이지 */}
            <Route path="/program" element={<ProgramDetailPage/>}/>
            <Route path="/reviews" element={<ReviewPage/>}/>
            <Route path="/search" element={<SearchPage/>}/>
            <Route path="/newreservation" element={<NewReservationPage/>}/>
            <Route path="/modifyreservation" element={<ModifyReservationPage/>}/>
        </Routes>
    );
}
