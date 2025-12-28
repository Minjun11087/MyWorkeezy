import axios from "../../../api/axios.js";

export default function ReservationConfirmActions({ reservationId }) {
  const handleDownload = async () => {
    const res = await axios.get(
      `/api/reservations/${reservationId}/confirmation/pdf`,
      { responseType: "blob" }
    );

    const url = window.URL.createObjectURL(res.data);
    const a = document.createElement("a");
    a.href = url;
    a.download = `reservation_${reservationId}.pdf`;
    a.click();
  };

  return (
    <div className="confirm-actions">
      <button onClick={handleDownload}>PDF 다운로드</button>
      <button onClick={() => window.print()}>출력</button>
    </div>
  );
}
