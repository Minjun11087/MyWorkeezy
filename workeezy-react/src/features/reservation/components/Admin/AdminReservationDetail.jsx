import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ReservationStatusButton from "../../../../shared/common/ReservationStatusButton";
import axios from "../../../../api/axios";
import "./AdminReservationDetail.css";
import Swal from "sweetalert2";

export default function AdminReservationDetail({ reservationId }) {
  const [reservation, setReservation] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDetail();
  }, [reservationId]);

  const fetchDetail = async () => {
    const token = localStorage.getItem("accessToken");
    const res = await axios.get(`/api/admin/reservations/${reservationId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setReservation(res.data);
  };

  if (!reservation) return <div>로딩중...</div>;

  //   console.log("DETAIL reservation =", reservation);

  const handleApprove = async () => {
    const result = await Swal.fire({
      title: "예약을 승인하시겠습니까?",
      text: "승인 후에는 예약자가 결제할 수 있습니다.",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "승인",
      cancelButtonText: "취소",
      confirmButtonColor: "#4caf50",
      cancelButtonColor: "#d33",
    });

    if (!result.isConfirmed) return;

    try {
      const token = localStorage.getItem("accessToken");

      await axios.patch(
        `/api/admin/reservations/${reservationId}/approve`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      await Swal.fire({
        icon: "success",
        title: "승인 완료",
        text: "예약이 승인되었습니다.",
        confirmButtonColor: "#4caf50",
      });

      fetchDetail(); // 상태 다시 조회
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "승인 실패",
        text:
          error.response?.data?.message || "예약 승인 중 오류가 발생했습니다.",
      });
    }
  };

  const canReject =
    reservation.status === "waiting_payment" ||
    reservation.status === "cancel_requested";

  const handleReject = async () => {
    const result = await Swal.fire({
      title: "예약을 반송하시겠습니까?",
      input: "textarea",
      inputLabel: "반송 사유",
      inputPlaceholder: "반송 사유를 입력해주세요",
      showCancelButton: true,
      confirmButtonText: "반송",
      cancelButtonText: "취소",
      confirmButtonColor: "#d33",
      inputValidator: (value) => {
        if (!value) return "반송 사유를 입력해주세요.";
      },
    });

    if (!result.isConfirmed) return;

    try {
      const token = localStorage.getItem("accessToken");

      await axios.patch(
        `/api/admin/reservations/${reservationId}/reject`,
        { reason: result.value },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      await Swal.fire({
        icon: "success",
        title: "반송 완료",
        text: "예약이 반송 처리되었습니다.",
      });

      fetchDetail();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "반송 실패",
        text:
          error.response?.data?.message || "예약 반송 중 오류가 발생했습니다.",
      });
    }
  };

  return (
    <div className="admin-detail-card">
      {/* 상단 상태/예약번호 */}
      <div className="detail-top">
        <div className="status-group">
          <ReservationStatusButton status={reservation.status} />
          <span className="reservation-no">{reservation.reservationNo}</span>
        </div>
      </div>

      {/* 본문 */}
      <div className="detail-body">
        {/* 이미지 */}
        <div className="image-box">
          <img src={reservation.imageUrl} alt="숙소 이미지" />
        </div>

        {/* 정보 */}
        <div className="info-box">
          <p>
            <strong>예약자 :</strong> {reservation.userName}
          </p>
          <p>
            <strong>소속 :</strong> {reservation.company}
          </p>
          <p>
            <strong>연락처 :</strong> {reservation.phone}
          </p>
          <p>
            <strong>이메일 :</strong> {reservation.email}
          </p>
          <p>
            <strong>예약 날짜 :</strong> {reservation.startDate} ~{" "}
            {reservation.endDate}
          </p>
          <p>
            <strong>프로그램명 :</strong> {reservation.programTitle}
          </p>
          <p>
            <strong>숙소 :</strong> {reservation.stayName}
          </p>
          <p>
            <strong>룸타입 :</strong> {reservation.roomType}
          </p>
          <p>
            <strong>인원수 :</strong> {reservation.peopleCount}
          </p>
          <p>
            <strong>오피스명 :</strong> {reservation.officeName}
          </p>
        </div>
      </div>

      {/* 하단 버튼 */}
      <div className="detail-actions">
        <button
          className="btn-approve"
          onClick={handleApprove}
          disabled={reservation.status !== "waiting_payment"}
        >
          승인
        </button>
        <button
          className="btn-reject"
          onClick={handleReject}
          disabled={!canReject}
        >
          반송
        </button>
      </div>
    </div>
  );
}
