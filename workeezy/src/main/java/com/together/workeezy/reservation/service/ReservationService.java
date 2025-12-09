package com.together.workeezy.reservation.service;

import com.together.workeezy.program.entity.Program;
import com.together.workeezy.program.entity.Room;
import com.together.workeezy.program.entity.RoomType;
import com.together.workeezy.program.repository.ProgramRepository;
import com.together.workeezy.reservation.Reservation;
import com.together.workeezy.reservation.ReservationStatus;
import com.together.workeezy.reservation.dto.ReservationCreateDto;
import com.together.workeezy.reservation.repository.ReservationRepository;
import com.together.workeezy.search.repository.RoomRepository;
import com.together.workeezy.user.entity.User;
import com.together.workeezy.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ReservationService {

    private final UserRepository userRepository;
    private final ProgramRepository programRepository;
    private final RoomRepository roomRepository;
    private final ReservationRepository reservationRepository;


    // 예약 신청
    public Reservation createNewReservation(ReservationCreateDto dto, String email) {

        // 사용자 조회
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("해당 이메일의 유저가 존재하지 않습니다."));

        // 프로그램 조회
        Program program = programRepository.findById(dto.getProgramId())
                .orElseThrow(() -> new IllegalArgumentException("해당 ID의 프로그램이 존재하지 않습니다."));
        // 3️⃣ 룸 조회 (roomType Enum 문자열 변환)
        RoomType roomType;
        try {
            roomType = RoomType.valueOf(dto.getRoomType().toLowerCase());
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("잘못된 룸 타입입니다: " + dto.getRoomType());
        }

        // 여러 개 룸 반환
        List<Room> rooms = roomRepository.findByRoomType(roomType);

        if (rooms.isEmpty()) {
            throw new IllegalArgumentException("해당 타입의 룸이 존재하지 않습니다.");
        }


        Reservation reservation = new Reservation();
        reservation.setUser(user);
        reservation.setProgram(program);
        reservation.setRoom((Room) rooms);
        reservation.setStartDate(dto.getStartDate());
        reservation.setEndDate(dto.getEndDate());
        reservation.setPeopleCount(dto.getPeopleCount());
        reservation.setStatus(ReservationStatus.waiting); // 기본 - 대기상태

        System.out.println("✅ 예약 저장 완료: " + dto.getProgramId() + " / " + dto.getRoomType());


        return reservationRepository.save(reservation);

    }
}
