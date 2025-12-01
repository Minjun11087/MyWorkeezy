import "./SearchCard.css";

export default function SearchCard({ title, desc, image }) {
    return (
        <div className="search-card">
            <img src={image} alt={title} />
            <div className="search-card-content">
                <div className="search-title">{title}</div>
                <div className="search-desc">{desc}</div>
            </div>
        </div>
    );
}
