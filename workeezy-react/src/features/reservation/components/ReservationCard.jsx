import "./ReservationCard.css";

export default function ReservationCard({ data, isSelected, onSelect }) {
  const { title, date, hotel, roomType, status, images = [] } = data;

  return (
    <div
      className={`reservation-card ${isSelected ? "selected" : ""}`}
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
    >
      {isSelected ? (
        <div className="image-grid">
          {images.slice(0, 3).map((src, i) => (
            <img key={i} src={src} alt={`${title}-${i}`} />
          ))}
        </div>
      ) : (
        <img className="thumbnail" src={images[0]} alt={title} />
      )}

      <div className="info">
        <div className={`status ${status}`}>{status}</div>
        <div className="title">{title}</div>
        <div className="details">
          <p>예약일자: {date}</p>
          <p>호텔명: {hotel}</p>
          <p>룸타입: {roomType}</p>
        </div>
      </div>

      {isSelected && (
        <div className="buttons">
          <button>예약 조회서</button>
          <button>호텔 정보</button>
          <button>예약 변경 신청</button>
        </div>
      )}
    </div>
  );
}
