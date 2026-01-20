package com.together.workeezy.payment.service;

import com.together.workeezy.common.exception.CustomException;
import com.together.workeezy.payment.client.TossPaymentClient;
import com.together.workeezy.payment.dto.request.PaymentCancelRequest;
import com.together.workeezy.payment.dto.response.PaymentCancelResponse;
import com.together.workeezy.payment.entity.Payment;
import com.together.workeezy.payment.entity.Refund;
import com.together.workeezy.payment.enums.PaymentStatus;
import com.together.workeezy.payment.repository.PaymentRepository;
import com.together.workeezy.reservation.domain.Reservation;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import static com.together.workeezy.common.exception.ErrorCode.PAYMENT_NOT_FOUND;

@Slf4j
@Service
@RequiredArgsConstructor
public class PaymentCancelService {

    private final PaymentRepository paymentRepository;
    private final TossPaymentClient tossPaymentClient;

    @Transactional
    public PaymentCancelResponse cancel(Long reservationId, PaymentCancelRequest request) {

        // 결제 조회
        Payment payment = paymentRepository
                .findTopByReservationIdAndStatusOrderByIdDesc(reservationId, PaymentStatus.paid)
                .orElseThrow(() -> new CustomException(PAYMENT_NOT_FOUND));

        log.info("🔥 CANCEL reservationId={}, paymentId={}, paymentKey={}",
                reservationId, payment.getId(), payment.getPaymentKey());

        Reservation reservation = payment.getReservation();

        boolean cancelledImmediately = reservation.cancelByUser();

        // 즉시 취소 가능한 경우 - 결제 취소 진행
        if (cancelledImmediately) {
            // toss 취소
            tossPaymentClient.cancel(
                    payment.getPaymentKey(),
                    request.getReason()
            );

            // 결제 상태 변경(paid -> cancelled)
            payment.cancel();

            // refund 생성
            Refund.create(
                    payment,
                    payment.getAmount(),
                    request.getReason()
            );

            // payment만 저장하면 refund도 같이 저장됨
            paymentRepository.save(payment);

            return PaymentCancelResponse.completed(payment);
        }
        // 취소 요청 상태(관리자 승인 대기)
        return PaymentCancelResponse.requested(reservation);
    }
}
