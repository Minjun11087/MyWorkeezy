import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./MenuBar.css";

export default function MenuBar({ isAdmin = false }) {
  const [openItems, setOpenItems] = useState([]); // 펼침 관리
  const [isOpen, setIsOpen] = useState(true); // 메뉴 자체 열림/닫힘

  const userMenu = [
    { title: "Home", path: "/home" },
    {
      title: "마이페이지",
      sub: [
        { name: "개인 정보 조회", path: "/mypage/profile" },
        { name: "찜 목록", path: "/mypage/likes" },
      ],
    },
    {
      title: "나의 예약",
      sub: [
        { name: "예약 조회", path: "/reservation/list" },
        { name: "예약 변경", path: "/reservation/modify" },
      ],
    },
    { title: "프로그램 찾기", path: "/program" },
    { title: "리뷰", path: "/review" },
  ];

  const adminMenu = [
    { title: "Home", path: "/home" },
    {
      title: "예약 관리",
      sub: [
        { name: "예약 조회", path: "/admin/reservations" },
        { name: "예약 승인", path: "/admin/approval" },
      ],
    },
    { title: "프로그램 찾기", path: "/program" },
    { title: "리뷰", path: "/review" },
    { title: "Admin", isFooter: true, path: "/admin" },
  ];

  const menu = isAdmin ? adminMenu : userMenu;

  // ✅ 처음 한 번만 기본으로 모든 소메뉴 열기
  useEffect(() => {
    const allWithSub = menu.filter((m) => m.sub).map((m) => m.title);
    setOpenItems(allWithSub);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // ✅ 의존성 배열 비워서 최초 1회만 실행

  const toggleItem = (title) => {
    setOpenItems(
      (prev) =>
        prev.includes(title)
          ? prev.filter((t) => t !== title) // 이미 열려 있으면 닫기
          : [...prev, title] // 닫혀 있으면 열기
    );
  };

  return (
    <div className={`menu-bar ${isOpen ? "open" : "close"}`}>
      <button className="menu-close-btn" onClick={() => setIsOpen(false)}>
        ✕
      </button>

      {menu.map((item, idx) => (
        <div key={idx} className="menu-item">
          {item.path ? (
            <Link
              to={item.path}
              className={`menu-title ${item.isFooter ? "menu-footer" : ""}`}
              onClick={() => toggleItem(item.title)}
            >
              {item.title}
            </Link>
          ) : (
            <div
              className={`menu-title ${item.isFooter ? "menu-footer" : ""}`}
              onClick={() => toggleItem(item.title)}
            >
              {item.title}
            </div>
          )}

          {/* ✅ 각 메뉴별로 독립적으로 열고 닫히게 */}
          {item.sub && openItems.includes(item.title) && (
            <div className="submenu">
              {item.sub.map((sub, subIdx) => (
                <Link
                  to={sub.path}
                  key={subIdx}
                  className="submenu-item"
                  onClick={() => setIsOpen(false)}
                >
                  {sub.name}
                </Link>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
