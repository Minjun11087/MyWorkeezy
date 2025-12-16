package com.together.workeezy.reservation.controller;

import com.together.workeezy.reservation.ReservationStatus;
import com.together.workeezy.reservation.dto.AdminReservationListDto;
import com.together.workeezy.reservation.service.AdminReservationService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/reservations")
@RequiredArgsConstructor
@PreAuthorize("hasRole('admin')") // 관리자만 접근
public class AdminReservationController {

    private final AdminReservationService adminReservationService;

    @GetMapping
    public ResponseEntity<Page<AdminReservationListDto>> getReservationList(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(required = false) ReservationStatus status, // 예약 상태
            @RequestParam(required = false) String keyword // 프로그램명/예약자
    ) {
        return ResponseEntity.ok(
                adminReservationService.getReservationList(page, status, keyword)
        );
    }
}
