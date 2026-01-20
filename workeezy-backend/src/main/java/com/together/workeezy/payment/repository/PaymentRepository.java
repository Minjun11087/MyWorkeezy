package com.together.workeezy.payment.repository;

import com.together.workeezy.payment.entity.Payment;
import com.together.workeezy.payment.enums.PaymentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {

    Optional<Payment> findTopByReservationIdAndStatusOrderByIdDesc(Long reservationId, PaymentStatus paymentStatus);
}
