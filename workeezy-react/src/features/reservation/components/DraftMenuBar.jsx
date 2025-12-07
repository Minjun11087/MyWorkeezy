import React, { useState, useEffect } from "react";
import "./DraftMenuBar.css";
import axios from "../../../api/axios.js";

export default function DraftMenuBar({
  isAdmin = false,
  isOpen = false, // 기본 false 테스트시 ture로
  onClose,
  latestDraftId,
}) {
  const [openItems, setOpenItems] = useState([]); // 펼침 관리
  const [draftList, setDraftList] = useState([]); // Redis 임시저장 리스트
  const [loading, setLoading] = useState(false); // 수정: 로딩 상태

  // 임시저장 리스트 메뉴
  const userMenu = [
    {
      title: "임시저장 목록",
      sub: draftList.map((draft) => ({
        id: draft.id,
        name: (
          <>
            {draft.data.title || "제목 없음"}
            {draft.id === latestDraftId && (
              <span className="new-tag"> New!</span>
            )}
          </>
        ),
        path: "#",
      })),
    },
  ];

  // Redis 임시저장 목록 불러오기
  useEffect(() => {
    if (!isOpen) return;
    const token = localStorage.getItem("accessToken");
    if (!token) return;
    // eslint-disable-next-line react-hooks/exhaustive-deps
    setLoading(true);
    axios
      .get("http://localhost:8080/api/reservations/draft/me", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setDraftList(res.data || []))
      .catch((err) => console.error("임시저장 목록 불러오기 실패", err))
      .finally(() => setLoading(false));
  }, [isOpen]);

  const toggleItem = (id) => {
    setOpenItems((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
    );
  };

  return (
    <div className={`menu-bar ${isOpen ? "open" : "close"}`}>
      <button className="menu-close-btn" onClick={onClose}>
        ✕
      </button>

      {loading && <p>불러오는 중...</p>}

      {userMenu.map((item, idx) => (
        <div key={idx} className="menu-item">
          <div className="menu-title">{item.title}</div>

          {/* 서브 목록에서 id 기준으로 토글 */}
          {item.sub && (
            <div className="submenu">
              {item.sub.map((sub, subIdx) => (
                <div
                  key={sub.id} //
                  className="submenu-item"
                  onClick={() => toggleItem(sub.id)}
                >
                  {sub.name}

                  {openItems.includes(sub.id) && (
                    <span className="open-indicator">▼</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
