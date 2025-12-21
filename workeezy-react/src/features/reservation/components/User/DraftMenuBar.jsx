import { useEffect, useRef, useState } from "react";
import "./DraftMenuBar.css";
import DraftMenuCard from "./DraftMenuCard";
import { useNavigate } from "react-router-dom";
import {
  fetchDraftList,
  fetchDraft,
  saveDraft,
  deleteDraft,
} from "../../api/draft.api";

import { isSameDraft } from "../../utils/draftCompare.js";
import { normalizeDraftToForm } from "../../utils/draftNormalize";

export default function DraftMenuBar({
  isOpen,
  onClose,
  latestDraftId,
  form,
  onSaved,
  onSnapshotSaved,
  lastSavedSnapshot,
}) {
  const menuRef = useRef(null);
  const navigate = useNavigate();

  const [draftList, setDraftList] = useState([]);
  const [openKey, setOpenKey] = useState(null);

  /* ===========
  바깥 클릭 닫기 
  ==============*/
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) onClose();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [isOpen, onClose]);

  /* ==========
  목록 불러오기
  =============*/
  useEffect(() => {
    if (!isOpen) return;
    const token = localStorage.getItem("accessToken");
    if (!token) return;

    fetchDraftList(token).then((res) => {
      console.log("draftList raw =", res.data);
      setDraftList(res.data || []);
    });
  }, [isOpen]);

  /* ===========
    임시 저장
    ==============*/
  const handleSave = async () => {
    const token = localStorage.getItem("accessToken");
    if (!token) return alert("로그인이 필요합니다.");

    const payload = {
      ...form,
      startDate: form.startDate?.toISOString(),
      endDate: form.endDate?.toISOString(),
    };

    if (isSameDraft(lastSavedSnapshot, payload)) {
      alert("변경된 내용이 없습니다.");
      return;
    }

    const res = await saveDraft(payload, token);
    // 스냅샷 + latest id
    onSnapshotSaved(payload);
    onSaved?.(res.data.id);

    const listRes = await fetchDraftList(token);
    setDraftList(listRes.data || []);
    alert("임시저장 완료!");
  };

  /* 불러오기 */
  const handleLoad = async (key) => {
    const token = localStorage.getItem("accessToken");
    const res = await fetchDraft(key, token);
    const normalized = normalizeDraftToForm(res.data);

    navigate("/reservation/new", {
      state: { ...normalized, draftKey: key },
    });
  };

  /* 삭제 */
  const handleDelete = async (key) => {
    const token = localStorage.getItem("accessToken");
    await deleteDraft(key, token);
    setDraftList((prev) => prev.filter((d) => d.key !== key));
  };

  const formatDateTime = (value) =>
    value
      ? new Date(value).toLocaleString("ko-KR", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
        })
      : "-";

  return (
    <div ref={menuRef} className={`draft-menu-bar ${isOpen ? "open" : ""}`}>
      <button onClick={onClose}>✕</button>
      <button onClick={handleSave}>현재 내용 임시저장</button>

      {draftList.map((draft) => (
        <DraftMenuCard
          key={draft.key}
          draft={draft}
          isOpen={openKey === draft.key}
          isNew={draft.key === latestDraftId}
          onToggle={() => setOpenKey(openKey === draft.key ? null : draft.key)}
          onLoad={() => handleLoad(draft.key)}
          onDelete={() => handleDelete(draft.key)}
          formatDateTime={formatDateTime}
        />
      ))}
    </div>
  );
}
