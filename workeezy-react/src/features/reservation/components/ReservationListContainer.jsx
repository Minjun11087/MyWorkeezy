import { useEffect, useState } from "react";
import axios from "../../../api/axios.js";
import ReservationListView from "./ReservationListView.jsx";

export default function ReservationListContainer() {
  const [reservations, setReservations] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 해당 사용자의 예약 불러오기
  useEffect(() => {
    const fetchMyReservations = async () => {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        setError("로그인이 필요합니다.");
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get(
          "http://localhost:8080/api/reservations/me",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
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

  const handleBackgroundClick = (e) => {
    if (e.target.classList.contains("reservation-container")) {
      setSelectedId(null);
    }
  };

  if (loading) return <p>로딩 중...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div onClick={handleBackgroundClick}>
      <ReservationListView
        reservations={reservations}
        selectedId={selectedId}
        setSelectedId={setSelectedId}
      />
    </div>
  );
}
