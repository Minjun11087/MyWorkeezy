import PageLayout from "../../../Layout/PageLayout.jsx";
import ReservationListContainer from "../components/ReservationListContainer.jsx";

export default function ReservationListPage() {
  return (
    <PageLayout>
      <div className="reservation-container">
        <h2 className="reservation-title">✏️ 예약 조회</h2>
        <ReservationListContainer />
      </div>
    </PageLayout>
  );
}
