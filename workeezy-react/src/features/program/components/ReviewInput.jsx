import "./ReviewInput.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useProgramDetail } from "../context/ProgramDetailContext.jsx";
import api from "../../../api/axios.js"; // withCredentials: true 인 인스턴스

export default function ReviewInput({ onReviewSubmitted }) {
    const { programId } = useProgramDetail();
    const [rating, setRating] = useState(0);
    const [reviewText, setReviewText] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async () => {
        console.log("POST /api/reviews payload:", { programId, rating, reviewText });

        if (!rating) return alert("별점을 선택해주세요!");
        if (!reviewText.trim()) return alert("리뷰 내용을 입력해주세요!");

        try {
            await api.post("/api/reviews", {
                programId,
                rating,
                reviewText: reviewText.trim(),
            });

            alert("리뷰가 등록되었습니다!");
            setRating(0);
            setReviewText("");
            onReviewSubmitted?.();
            navigate("/reviews");
        } catch (err) {
            console.error("리뷰 등록 실패:", err);
            const status = err?.response?.status;
            if (status === 401) {
                alert("로그인이 필요합니다.");
                navigate("/login");
            } else {
                alert("리뷰 등록에 실패했습니다.");
            }
        }
    };

    return (
        <div className="review-write-box">
            <div className="rating-row">
                {[1, 2, 3, 4, 5].map((star) => (
                    <span
                        key={star}
                        className={star <= rating ? "star filled" : "star"}
                        onClick={() => setRating(star)}
                    >
            ★
          </span>
                ))}
            </div>

            <textarea
                className="review-input"
                placeholder="리뷰를 입력해주세요"
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
            />

            <button className="submit-review-btn" onClick={handleSubmit}>
                리뷰 등록하기
            </button>
        </div>
    );
}
