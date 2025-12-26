import AdminReservationSection from "../components/Admin/AdminReservationSection";
import DraftReservationList from "../components/User/DraftReservationList";

export default function DraftReservationPage() {
  return (
    <PageLayout>
      <AdminReservationSection>
        <h2 className="page-title">📝 임시 저장된 예약</h2>
        <DraftReservationList />
      </AdminReservationSection>
    </PageLayout>
  );
}
