import PageLayout from "../layout/PageLayout";
import SearchBar from "../components/SearchBar/SearchBar";
import CategoryFilter from "../components/CategoryFilter/CategoryFilter";
import Pagination from "../components/Pagination/Pagination";
import {useEffect, useState} from "react";
import FloatingButtons from "../components/FloatingButtons/FloatingButtons";
import ReviewCard from "../components/ReviewCard/ReviewCard.jsx";
import SearchCard from "../components/SearchCard/SearchCard.jsx";
import axios from "axios";

export default function SearchPage() {
    const [search, setSearch] = useState("");
    const [region, setRegion] = useState("");
    const [programs, setPrograms] = useState([]);

    useEffect(() => {
        axios.get("http://localhost:8080/api/programs/cards")
            .then(res => {
                setPrograms(res.data);
            })
            .catch(err => console.log(err));
    }, []);


    return (
        <PageLayout>
            <h2>Search</h2>
            <SearchBar value={search} onChange={setSearch}/>
            <CategoryFilter active={region} onSelect={setRegion}/>

            <div className="search-grid">
                {programs.map(p => (
                <SearchCard
                    key={p.id}
                    title={p.title}
                    image={p.photo}
                    desc={ p.desc}
                    />
                ))}
            </div>

            <Pagination/>
            <FloatingButtons/>
        </PageLayout>
    )
}

