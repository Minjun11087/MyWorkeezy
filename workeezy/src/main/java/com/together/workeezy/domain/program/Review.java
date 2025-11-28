package com.together.workeezy.domain.program;

import com.together.workeezy.domain.user.User;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;

import java.time.Instant;

@Getter
@Setter
@Entity
@Table(name = "tb_review")
public class Review {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "review_id", nullable = false)
    private Long id;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "program_id", nullable = false)
    private Program program;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Size(max = 100)
    @NotNull
    @Column(name = "review_title", nullable = false, length = 100)
    private String title;

    @Lob
    @Column(name = "review_content")
    private String content;

    @ColumnDefault("CURRENT_TIMESTAMP")
    @Column(name = "review_date")
    private Instant reviewDate;

    @ColumnDefault("0")
    @Column(name = "review_point")
    private Integer reviewPoint;

}