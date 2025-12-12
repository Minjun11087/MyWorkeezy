import ReservationCard from "./ReservationCard.jsx";

export default function ReservationListView({
  reservations,
  selectedId,
  setSelectedId,
}) {
  const handleCardClick = (id) => {
    setSelectedId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="reservation-list">
      {reservations.length === 0 ? (
        <p>예약 내역이 없습니다 😢</p>
      ) : (
        reservations.map((r) => (
          <ReservationCard
            key={r.id}
            data={r}
            isSelected={selectedId === r.id}
            onSelect={() => handleCardClick(r.id)}
          />
        ))
      )}
    </div>
  );
}
