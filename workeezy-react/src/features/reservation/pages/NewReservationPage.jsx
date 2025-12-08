import PageLayout from "../../../layout/PageLayout.jsx";
import ReservationForm from "../components/ReservationForm.jsx";
import { useLocation } from "react-router-dom";

export default function NewReservationPage() {
  const location = useLocation();
  const { state } = location || {};
  return (
    <PageLayout>
      <ReservationForm initialData={state} />
    </PageLayout>
  );
}
