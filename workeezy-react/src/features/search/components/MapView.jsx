import KoreaSvgMap from "./KoreaSvgMap.jsx";
import "./MapView.css";

export default function MapView({ programs = [], setBigRegion, setSmallRegions, smallRegions = [] }) {
    const safePrograms = Array.isArray(programs) ? programs : [];
    const counts = safePrograms.reduce((acc, p) => {
        const r = p?.region;
        if (!r) return acc;
        acc[r] = (acc[r] || 0) + 1;
        return acc;
    }, {});

    const selectedRegion = smallRegions?.[0] || null;

    const handlePick = (regionName) => {
        setSmallRegions([regionName]);
    };

    const handleAll = () => {
        setBigRegion("전체");
        setSmallRegions([]);
    };

    return (
        <div className="map-wrap">
            <div className="map-top-chips">
                <button className="chip" onClick={handleAll}>전체</button>
                <button className="chip" onClick={() => setBigRegion("수도권")}>국내</button>
                <button className="chip" onClick={() => setBigRegion("해외")}>해외</button>
            </div>

            <div className="map-stage">
                <KoreaSvgMap
                    counts={counts}
                    onPick={handlePick}
                    selectedRegion={selectedRegion}
                />
            </div>

            <div className="map-hint">지역을 클릭하면 필터가 적용돼.</div>
        </div>
    );
}
