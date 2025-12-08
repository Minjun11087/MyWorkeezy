import "./ProgramTabs.css";

export default function ProgramTabs() {

    const scrollToSection = (id) => {
        const section = document.getElementById(id);

        if (section) {
            section.scrollIntoView({
                behavior: "smooth",   // 부드럽게 스크롤
                block: "start"
            });
        }
    };

    return (
        <div className="pd-tabs">
            <button onClick={() => scrollToSection("program-info")}>프로그램 정보</button>
            <button onClick={() => scrollToSection("hotel-info")}>숙소 정보</button>
            <button onClick={() => scrollToSection("office-info")}>오피스</button>
            <button onClick={() => scrollToSection("activity-info")}>액티비티</button>
            <button onClick={() => scrollToSection("review-info")}>참여후기</button>
        </div>
    );
}
