import { useEffect, useRef, useState } from "react";
import api from "../../../api/axios.js"; // 너 프로젝트 axios 인스턴스 경로에 맞춰서
import "./SearchBar.css";

export default function SearchBar({ value, onChange, onSearch }) {
    const [open, setOpen] = useState(false);
    const [recentKeywords, setRecentKeywords] = useState([]);
    const wrapperRef = useRef(null);

    // ✅ 포커스 될 때 최근검색어 불러오기
    const fetchRecent = async () => {
        try {
            const res = await api.get("/api/search/recent?limit=10");
            setRecentKeywords(res.data ?? []);
        } catch (e) {
            setRecentKeywords([]); // 비로그인/에러면 그냥 비우기
        }
    };

    useEffect(() => {
        const handler = (e) => {
            if (!wrapperRef.current?.contains(e.target)) setOpen(false);
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    const filtered = recentKeywords.filter((k) =>
        (k ?? "").includes(value ?? "")
    );

    const handleSelect = (keyword) => {
        onChange?.(keyword);
        onSearch?.();
        setOpen(false);
    };

    return (
        <div className="search-wrapper" ref={wrapperRef}>
            <div className="search-bar">
                <input
                    className="search-input"
                    placeholder="검색어를 입력하세요"
                    value={value ?? ""}
                    onChange={(e) => {
                        onChange?.(e.target.value);
                        setOpen(true);
                    }}
                    onFocus={async () => {
                        setOpen(true);
                        await fetchRecent();
                    }}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            onSearch?.();
                            setOpen(false);
                        }
                    }}
                />
                <i className="fa-solid fa-magnifying-glass search-icon" onClick={onSearch} />
            </div>

            {open && filtered.length > 0 && (
                <div className="search-suggest">
                    {filtered.map((k, i) => (
                        <div key={i} className="suggest-item" onClick={() => handleSelect(k)}>
                            <i className="fa-solid fa-clock-rotate-left" />
                            <span>{k}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
