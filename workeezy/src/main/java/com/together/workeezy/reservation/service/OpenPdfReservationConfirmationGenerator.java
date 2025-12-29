package com.together.workeezy.reservation.service;

import com.lowagie.text.*;
import com.lowagie.text.pdf.*;
import com.lowagie.text.pdf.draw.LineSeparator;
import com.together.workeezy.reservation.domain.Reservation;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;

import java.awt.Color;
import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.text.NumberFormat;
import java.util.Locale;

@Component
public class OpenPdfReservationConfirmationGenerator {

    private final BaseFont baseFont;

    public OpenPdfReservationConfirmationGenerator() {
        this.baseFont = loadKoreanBaseFont();
    }

    public byte[] generate(Reservation r) {
        try (ByteArrayOutputStream baos = new ByteArrayOutputStream()) {

            Document document = new Document(PageSize.A4, 36, 36, 48, 36);
            PdfWriter.getInstance(document, baos);
            document.open();

            Font titleFont = new Font(baseFont, 18, Font.BOLD);
            Font headerFont = new Font(baseFont, 11, Font.BOLD);
            Font bodyFont = new Font(baseFont, 11);

            /* =========================
               HEADER (LOGO + TITLE)
            ========================= */
            PdfPTable headerTable = new PdfPTable(2);
            headerTable.setWidthPercentage(100);
            headerTable.setWidths(new int[]{2, 8});

            PdfPCell logoCell = new PdfPCell(loadLogoImage());
            logoCell.setBorder(Rectangle.NO_BORDER);
            logoCell.setVerticalAlignment(Element.ALIGN_MIDDLE);
            headerTable.addCell(logoCell);

            PdfPCell titleCell = new PdfPCell(new Phrase("예약 확정서", titleFont));
            titleCell.setBorder(Rectangle.NO_BORDER);
            titleCell.setVerticalAlignment(Element.ALIGN_MIDDLE);
            titleCell.setHorizontalAlignment(Element.ALIGN_RIGHT);
            headerTable.addCell(titleCell);

            document.add(headerTable);
            document.add(Chunk.NEWLINE);

            LineSeparator line = new LineSeparator();
            line.setLineWidth(1);
            document.add(line);
            document.add(Chunk.NEWLINE);

            /* =========================
               예약 정보
            ========================= */
            addSectionTitle(document, "예약 정보", headerFont);

            PdfPTable reservationTable = createInfoTable();
            addRow(reservationTable, "예약번호", r.getReservationNo(), headerFont, bodyFont);
            addRow(reservationTable, "프로그램", r.getProgram().getTitle(), headerFont, bodyFont);
            addRow(reservationTable, "숙소명", r.getStay().getName(), headerFont, bodyFont);
            addRow(reservationTable, "룸 타입", r.getRoom().getRoomType().name(), headerFont, bodyFont);
            addRow(reservationTable, "오피스", r.getOffice().getName(), headerFont, bodyFont);
            addRow(reservationTable, "이용 기간", r.getStartDate() + " ~ " + r.getEndDate(), headerFont, bodyFont);
            addRow(reservationTable, "인원", r.getPeopleCount() + "명", headerFont, bodyFont);

            document.add(reservationTable);

            /* =========================
               결제 정보
            ========================= */
            addSectionTitle(document, "결제 정보", headerFont);

            PdfPTable paymentTable = createInfoTable();
            String price = NumberFormat.getNumberInstance(Locale.KOREA)
                    .format(r.getTotalPrice());
            addRow(paymentTable, "결제 금액", price + "원", headerFont, bodyFont);
            document.add(paymentTable);

            /* =========================
               예약자 정보
            ========================= */
            addSectionTitle(document, "예약자 정보", headerFont);

            PdfPTable userTable = createInfoTable();
            addRow(userTable, "이름", r.getUser().getUserName(), headerFont, bodyFont);
            addRow(userTable, "연락처", r.getUser().getPhone(), headerFont, bodyFont);
            addRow(userTable, "이메일", r.getUser().getEmail(), headerFont, bodyFont);
            document.add(userTable);

            /* =========================
               FOOTER
            ========================= */
            Paragraph footer = new Paragraph(
                    "\n본 문서는 전자적으로 생성된 문서로, 별도의 서명 없이 유효합니다.",
                    new Font(baseFont, 9)
            );
            footer.setAlignment(Element.ALIGN_CENTER);
            footer.setSpacingBefore(30);
            document.add(footer);

            document.close();
            return baos.toByteArray();

        } catch (Exception e) {
            throw new RuntimeException("OpenPDF 확정서 생성 실패", e);
        }
    }

    private PdfPTable createInfoTable() {
        PdfPTable table = new PdfPTable(2);
        table.setWidthPercentage(100);
        table.setWidths(new int[]{3, 7});
        table.setSpacingBefore(8);
        return table;
    }

    private void addSectionTitle(Document document, String title, Font font) throws DocumentException {
        Paragraph p = new Paragraph(title, font);
        p.setSpacingBefore(15);
        p.setSpacingAfter(5);
        document.add(p);
    }

    private void addRow(PdfPTable table, String label, String value,
                        Font headerFont, Font bodyFont) {

        PdfPCell cell1 = new PdfPCell(new Phrase(label, headerFont));
        cell1.setPadding(8);
        cell1.setBackgroundColor(new Color(245, 245, 245));
        table.addCell(cell1);

        PdfPCell cell2 = new PdfPCell(new Phrase(value, bodyFont));
        cell2.setPadding(8);
        table.addCell(cell2);
    }

    private BaseFont loadKoreanBaseFont() {
        try {
            ClassPathResource fontResource =
                    new ClassPathResource("fonts/AritaDotumKR-Medium.ttf");

            try (InputStream is = fontResource.getInputStream()) {
                byte[] fontBytes = is.readAllBytes();
                return BaseFont.createFont(
                        "AritaDotumKR-Medium.ttf",
                        BaseFont.IDENTITY_H,
                        BaseFont.EMBEDDED,
                        true,
                        fontBytes,
                        null
                );
            }
        } catch (Exception e) {
            throw new RuntimeException("한글 폰트 로드 실패", e);
        }
    }

    private Image loadLogoImage() {
        try {
            ClassPathResource resource = new ClassPathResource("images/logo.png");
            byte[] imageBytes = resource.getInputStream().readAllBytes();

            Image logo = Image.getInstance(imageBytes);
            logo.scaleToFit(120, 40);
            logo.setAlignment(Image.ALIGN_LEFT);

            return logo;
        } catch (Exception e) {
            throw new RuntimeException("로고 이미지 로드 실패", e);
        }
    }
}
