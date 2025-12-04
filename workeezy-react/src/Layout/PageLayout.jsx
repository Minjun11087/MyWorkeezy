import "./PageLayout.css";
import Header from "../components/Common/Header";
import Footer from "../components/Common/Footer";
import { useState } from "react";
import MenuBar from "../components/Common/Menubar";
import FloatingButtons from "../components/Common/FloatingButtons";

export default function PageLayout({ children, wide = false }) {
    const [open, setOpen] = useState(false);

    return (
        <div className="layout">

            {/* Header */}
            <Header onOpenMenu={() => setOpen(true)} />

            {/* 메뉴 오픈 */}
            {open && (
                <>
                    <div className="menu-overlay" onClick={() => setOpen(false)} />
                    <MenuBar
                        onClose={() => setOpen(false)}
                        isAdmin={localStorage.getItem("role") === "ADMIN"}
                    />
                </>
            )}

            {/* ★ 폭을 통제하는 핵심 래퍼 */}
            <main className="content-wrapper">
                <div className={wide ? "content-wide" : "content-normal"}>
                    {children}
                </div>
            </main>

            {/* Floating & Footer */}
            <FloatingButtons />
            <Footer />
        </div>
    );
}
