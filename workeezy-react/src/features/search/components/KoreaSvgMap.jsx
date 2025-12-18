import "./KoreaSvgMap.css";

const REGIONS = [
    // 수도권
    { key: "인천", label: { x: 155, y: 110 }, d: "M120 95 L165 80 L190 105 L160 135 L125 125 Z" },
    { key: "서울", label: { x: 205, y: 125 }, d: "M185 110 L225 95 L250 120 L230 150 L190 145 Z" },
    { key: "경기", label: { x: 220, y: 185 }, d: "M170 155 L260 140 L310 185 L290 250 L195 255 L150 205 Z" },

    // 강원
    { key: "강원", label: { x: 360, y: 180 }, d: "M300 120 L460 110 L510 175 L485 280 L365 285 L310 220 Z" },

    // 충청
    { key: "충남", label: { x: 190, y: 315 }, d: "M130 275 L250 270 L285 320 L250 385 L145 390 L115 330 Z" },
    { key: "대전", label: { x: 255, y: 340 }, d: "M235 325 L270 320 L285 345 L260 370 L235 360 Z" },
    { key: "충북", label: { x: 310, y: 330 }, d: "M270 265 L365 270 L405 330 L380 410 L290 405 L265 335 Z" },

    // 전라
    { key: "전북", label: { x: 220, y: 445 }, d: "M170 400 L280 400 L305 455 L265 520 L175 515 L145 455 Z" },
    { key: "광주", label: { x: 200, y: 575 }, d: "M175 555 L220 545 L240 575 L215 605 L175 595 Z" },
    { key: "전남", label: { x: 175, y: 590 }, d: "M95 520 L260 520 L295 610 L235 700 L90 690 L60 595 Z" },

    // 경상
    { key: "경북", label: { x: 395, y: 420 }, d: "M360 305 L500 310 L540 420 L495 520 L380 515 L345 420 Z" },
    { key: "대구", label: { x: 445, y: 470 }, d: "M425 455 L470 445 L490 475 L465 505 L425 495 Z" },
    { key: "경남", label: { x: 380, y: 610 }, d: "M305 520 L435 520 L505 595 L470 700 L325 695 L285 610 Z" },
    { key: "울산", label: { x: 520, y: 590 }, d: "M505 560 L545 555 L560 585 L540 615 L505 605 Z" },
    { key: "부산", label: { x: 500, y: 645 }, d: "M470 625 L525 620 L545 650 L520 680 L475 670 Z" },

    // 제주 / 해외
    { key: "제주", label: { x: 250, y: 790 }, d: "M195 765 C220 740, 280 740, 305 765 C330 790, 290 820, 250 820 C210 820, 170 790, 195 765 Z" },
    { key: "해외", label: { x: 640, y: 650 }, d: "M580 585 L710 585 L730 650 L700 720 L585 720 L560 650 Z" },
];

export default function KoreaSvgMap({ counts = {}, onPick, selectedRegion }) {
    return (
        <svg className="korea-map" viewBox="0 0 820 860" role="img" aria-label="Korea region map">
            {/* 배경 카드 */}
            <rect x="20" y="20" width="780" height="820" rx="22" className="map-bg" />

            {/* 지도 외곽 윤곽(느낌만) */}
            <path
                className="map-outline"
                d="M120 95 L460 110 L540 420 L505 595 L470 700 L235 700 L90 690 L60 595 L115 330 L150 205 Z"
            />

            {/* 각 지역 */}
            {REGIONS.map((r) => {
                const c = counts?.[r.key] ?? 0;
                const active = selectedRegion === r.key;

                return (
                    <g
                        key={r.key}
                        className={`region ${active ? "active" : ""}`}
                        onClick={() => onPick?.(r.key)}
                    >
                        <path d={r.d} className="region-shape" />
                        <text x={r.label.x} y={r.label.y} textAnchor="middle" className="region-name">
                            {r.key}
                        </text>
                        <text x={r.label.x} y={r.label.y + 20} textAnchor="middle" className="region-count">
                            ({c})
                        </text>
                    </g>
                );
            })}
        </svg>
    );
}
