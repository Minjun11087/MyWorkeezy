import { useEffect, useState } from "react";
import axios from "../../../../api/axios.js";
import ReservationListView from "./ReservationListView.jsx";

export default function ReservationListContainer({
  selectedId,
  setSelectedId,
}) {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMyReservations = async () => {
      try {
        const res = await axios.get("/api/reservations/me");

        setReservations(res.data);
        console.log("서버 응답:", res.data);
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
