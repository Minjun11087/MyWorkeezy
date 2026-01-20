package com.together.workeezy.payment.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;

import java.time.OffsetDateTime;

@Getter
@Setter
public class TossConfirmResponse {

    @JsonProperty("paymentKey")
    private String paymentKey;

    @JsonProperty("orderId")
    private String orderId;

    @JsonProperty("totalAmount")
    private Long totalAmount;

    @JsonProperty("method")
    private String method;

    @JsonProperty("approvedAt")
    private OffsetDateTime approvedAt; // 안되면 String으로 받고 LocalDateTime 파싱
}
