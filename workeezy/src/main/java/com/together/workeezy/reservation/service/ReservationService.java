package com.together.workeezy.reservation.service;

import com.together.workeezy.program.entity.Program;
import com.together.workeezy.program.repository.ProgramRepository;
import com.together.workeezy.reservation.Reservation;
import com.together.workeezy.reservation.ReservationStatus;
import com.together.workeezy.reservation.dto.ReservationCreateDto;
import com.together.workeezy.reservation.repository.ReservationRepository;
import com.together.workeezy.user.entity.User;
import com.together.workeezy.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ReservationService {

    private final ReservationRepository reservationRepository;
    private final ProgramRepository programRepository;
    private final UserRepository userRepository;

    // 예약 신청 메서드
    public Reservation createNewReservation(ReservationCreateDto dto, Long programId, String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("해당 이메일의 유저를 찾을 수 없습니다: " + email));

        Program program = programRepository.findById(programId)
                .orElseThrow(()-> new IllegalArgumentException("해당 프로그램을 찾을 수 없습니다."));

        Reservation reservation = new Reservation();
        reservation.setUser(user);
        reservation.setProgram(program);
        reservation.setStartDate(dto.getStartDate());
        reservation.setEndDate(dto.getEndDate());
        reservation.setOffice(dto.getOfficeName());
        reservation.setRoomType(dto.getRoomType());
        reservation.setPeopleCount(dto.getPeopleCount());
        reservation.setStatus(ReservationStatus.valueOf("waiting"));




    }
}
