package com.together.workeezy.user.repository;

import com.together.workeezy.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User,Long> {

    // 로그인/조회 시 사용
    // 존재하지 않을 수 있으므로 Optional 반환
    Optional<User> findByEmail(String email);
}
