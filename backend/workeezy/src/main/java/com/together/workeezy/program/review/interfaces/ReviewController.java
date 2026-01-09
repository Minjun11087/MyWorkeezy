package com.together.workeezy.program.review.interfaces;

import com.together.workeezy.program.review.interfaces.dto.ReviewCreateRequest;
import com.together.workeezy.program.review.interfaces.dto.ReviewDto;
import com.together.workeezy.program.review.application.service.ReviewService;
import com.together.workeezy.user.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    @GetMapping
    public List<ReviewDto> getAllReviews() {
        return reviewService.getReviewCards();
    }

    @PostMapping
    public ResponseEntity<String> createReview(
            @RequestBody ReviewCreateRequest dto,
            Authentication authentication
    ) {
        System.out.println("AUTH = " + authentication);
        System.out.println("AUTH NAME = " + (authentication != null ? authentication.getName() : null));

        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).body("로그인이 필요합니다.");
        }

        String email = authentication.getName();
        reviewService.createReview(dto, email);

        return ResponseEntity.ok("리뷰 등록 완료");
    }




}