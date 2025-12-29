package com.together.workeezy.payment.enums;

public enum PaymentMethod {
    unknown, card, transfer, easy_pay;

    public static PaymentMethod from(String value) {
        if (value == null || value.isBlank()) return unknown;

        return switch (value.toUpperCase()) {
            case "CARD" -> card;
            case "TRANSFER" -> transfer;
            case "EASY_PAY", "EASYPAY" -> easy_pay;
            default -> unknown;
        };
    }
}
