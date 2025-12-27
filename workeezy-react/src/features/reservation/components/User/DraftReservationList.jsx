import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../components/Admin/AdminReservationList.css"; // 기존 관리자 CSS 재사용
import Pagination from "../../../../shared/common/Pagination";
import { fetchDraftList } from "../../api/draft.api.js";
import { normalizeDraft } from "../../utils/draftNormalize.js";
import { normalizeDraftToForm } from "../../utils/draftNormalize";
import Swal from "sweetalert2";
import { deleteDraft } from "../../api/draft.api.js";

export default function DraftReservationList() {
  const [drafts, setDrafts] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const navigate = useNavigate();

  useEffect(() => {
    fetchDrafts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const fetchDrafts = async () => {
    const res = await fetchDraftList();

    const normalized = res.data.map((draft) => {
      const normalizedDraft = normalizeDraft(draft);
      console.log("📦 전체 응답 res:", res);
      console.log("📦 res.data:", res.data);
      return {
        ...normalizedDraft,
        data: normalizeDraftToForm(normalizedDraft.data),
      };
    });

    setDrafts(normalized);
  };

  const handleDelete = async (e, key) => {
    e.stopPropagation();

    const result = await Swal.fire({
      title: "임시저장 삭제",
      text: "이 임시저장을 삭제하시겠습니까?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "삭제",
      cancelButtonText: "취소",
    });

    if (!result.isConfirmed) return;

    await deleteDraft(key);
    await fetchDrafts();

    Swal.fire("삭제 완료", "임시저장이 삭제되었습니다.", "success");
  };

  // 프로그램 상세 이동
  const goToProgramDetail = (e, programId) => {
    e.stopPropagation();
    navigate(`/programs/${programId}`);
  };

  return (
    <div className="admin-reservation-list">
      <h2 className="list-title">임시 저장 목록</h2>

      <table className="reservation-table">
        <thead>
          <tr>
            <th>프로그램</th>
            <th>숙소</th>
            <th>기간</th>
            <th>인원</th>
            <th>저장일</th>
            <th>작업</th>
          </tr>
        </thead>

        <tbody>
          {drafts.length === 0 && (
            <tr>
              <td colSpan={5} style={{ textAlign: "center", padding: "30px" }}>
                임시 저장된 예약이 없습니다.
              </td>
            </tr>
          )}

          {drafts.map((draft) => {
            const data = draft.data;

            return (
              <tr
                key={draft.key}
                className="clickable-row"
                onClick={() =>
                  navigate("/reservation/new", {
                    state: { draftKey: draft.key },
                  })
                }
              >
                <td>{data.programTitle || "-"}</td>
                <td>{data.stayName || "-"}</td>
                <td>
                  {data.startDate?.toLocaleDateString()} ~{" "}
                  {data.endDate?.toLocaleDateString()}
                </td>
                <td>{data.peopleCount ? `${data.peopleCount}명` : "-"}</td>
                <td>
                  {data.savedAt?.toLocaleString("ko-KR", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </td>
                <td className="action-cell">
                  <button
                    className="btn-detail"
                    onClick={(e) => goToProgramDetail(e, data.programId)}
                  >
                    워케이션 정보
                  </button>

                  <button
                    className="btn-delete"
                    onClick={(e) => handleDelete(e, draft.key)}
                  >
                    삭제
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />
    </div>
  );
}
