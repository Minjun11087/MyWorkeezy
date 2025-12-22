import axios from "../../../api/axios.js";

// 예약 취소 api
export async function cancelReservation(reservationId) {
  const token = localStorage.getItem("accessToken");

  return axios.patch(
    `/api/reservations/${reservationId}/cancel`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
}

// 확정서 presigned url 요청
export function fetchConfirmDocUrl(reservationId) {
  return axios.get(`/api/reservations/${reservationId}/confirm-doc`);
}
