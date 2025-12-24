import {useEffect, useState} from "react";
import axios from "../../../../api/axios.js";
import ReservationListView from "./ReservationListView.jsx";

export default function ReservationListContainer({
                                                     selectedId,
                                                     setSelectedId,
                                                 }
) {
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // 해당 사용자의 예약 불러오기

    useEffect(() => {
        const fetchMyReservations = async () => {
            try {
                const res = await axios.get("/api/reservations/me");
                setReservations(res.data);
            } catch (err) {
                setError("예약 목록 불러오기 실패");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchMyReservations();
    }, []);

    if (loading) return <p>로딩 중...</p>;
    if (error) return <p>{error}</p>;

    return (
        <ReservationListView
            reservations={reservations}
            selectedId={selectedId}
            setSelectedId={setSelectedId}
        />
    );
}
