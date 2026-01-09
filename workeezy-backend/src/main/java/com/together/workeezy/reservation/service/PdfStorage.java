package com.together.workeezy.reservation.service;

import java.io.InputStream;

public interface PdfStorage {

    void uploadPdf(byte[] pdfBytes, String key);

    InputStream downloadPdf(String key);
}
