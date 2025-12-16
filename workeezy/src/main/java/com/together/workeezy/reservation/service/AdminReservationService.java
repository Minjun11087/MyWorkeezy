package com.together.workeezy.reservation.service;

import com.together.workeezy.reservation.Reservation;
import com.together.workeezy.reservation.ReservationStatus;
import com.together.workeezy.reservation.dto.AdminReservationListDto;
import com.together.workeezy.reservation.repository.ReservationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AdminReservationService {

    private final ReservationRepository reservationRepository;

    public Page<AdminReservationListDto> getReservationList(
            int page,
            ReservationStatus status,
            String keyword
    ) {
        Pageable pageable = PageRequest.of(page, 5, Sort.by("id").descending());

        Page<Reservation> result =
                reservationRepository.findAdminReservations(status, keyword, pageable);

        return result.map(r -> new AdminReservationListDto(
                r.getId(),
                r.getReservationNo(),
                r.getProgram().getTitle(),
                r.getUser().getUserName(),
                r.getStatus()
        ));
    }
}
