import './Explore.css';
import LeafletMap from '../LeafletMap/LeafletMap';
import Sidebar from '../Sidebar/Sidebar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRightFromBracket, faXmark } from '@fortawesome/free-solid-svg-icons';
import { useState, useEffect } from 'react';
import useSites from '../../hooks/useSites';
import useCountries from '../../hooks/useCountries';
import SingleSiteBar from '../SingleSiteBar/SingleSiteBar';
import ExploreSkeleton from '../Skeletons/ExploreSkeleton';

const REGION_CENTERS = {
    Worldwide:     { center: [20, 0], zoom: 2 },
    Africa:        { center: [7.1881, 21.0936], zoom: 4 },
    Americas:      { center: [15.0, -75.0], zoom: 3.5 },
    Asia:          { center: [34.0479, 100.6197], zoom: 4 },
    Europe:        { center: [54.5260, 15.2551], zoom: 4.5 },
    Oceania:       { center: [-22.7359, 140.0188], zoom: 4 },
};

function Explore() {

    const { sites, loading, error, params, setParams } = useSites({ limit: 1000 });
    const { countries, loading: countriesLoading } = useCountries();

    const [initialLoading, setInitialLoading] = useState(true);
    const [hasLoadedOnce, setHasLoadedOnce] = useState(false);

    const [selected, setSelected] = useState(null);

    const onClose = ()  => setSelected(null);

    const [selectedData, setSelectedData] = useState(null);

    useEffect(() => {
        if (!selected) {
            setSelectedData(null);
            return;
        }
    
        const found = sites.find(site => site._id === selected);
        setSelectedData(found || null);
    }, [selected, sites]);

    const [visualisationMode, setVisualisationMode] = useState("standard");

    const [filters, setFilters] = useState({
        search: "",
        category: "",
        region: "",
        country: "",
    });

    // Timeline logic
    const currentYear = new Date().getFullYear()
    const [selectedYear, setSelectedYear] = useState(currentYear);

    // Harita teması state'i
    const [mapStyle, setMapStyle] = useState("jawg-lagoon");

    const [mapFocus, setMapFocus] = useState(null);

    // filtre değişince mapFocus'u güncelle
    useEffect(() => {
      if (filters.region && REGION_CENTERS[filters.region]) {
        setMapFocus({
          type: "region",
          center: REGION_CENTERS[filters.region].center,
          zoom: REGION_CENTERS[filters.region].zoom
        });
      } else {
        setMapFocus(null);
      }
    }, [filters]);

    // Sidebar aç/kapat
    const [isSidebarActive, setIsSidebarActive] = useState(true);
    const toggleSidebar = () => setIsSidebarActive(!isSidebarActive);
    
    // Filtre verisini setParams ile güncelle (loop önleme dahil)
        useEffect(() => {
        const cleaned = {};
        
        Object.entries(filters).forEach(([key, value]) => {
            if (value !== "") {
                cleaned[key] = value;
            }
        });
    
        // Eğer filtreler tamamen boşsa → params'ı sıfırla
        if (Object.keys(cleaned).length === 0) {
            if (Object.keys(params).length !== 0) {
                setParams({});
            }
            return;
        }
    
        // Gerçekten değişiklik var mı kontrolü
        let hasChange = false;
        Object.keys(cleaned).forEach(key => {
            if (params[key] !== cleaned[key]) {
                hasChange = true;
            }
        });
    
        if (hasChange) {
            setParams(cleaned);
        }
    }, [filters, params, setParams]);

    // mapStyle'ı localStorage'dan oku
    useEffect(() =>{
        const savedTheme = localStorage.getItem('map_theme');
        if(savedTheme){
            setMapStyle(savedTheme);
        }
    }, []);

    useEffect(() => {
        if (!loading) {
            setInitialLoading(false);
        }
    }, [loading]);

    useEffect(() => {
        if (!loading && !hasLoadedOnce) {
            setHasLoadedOnce(true);
        }
    }, [loading, hasLoadedOnce]);

    if (error) return <div>Hata: {error.message}</div>;

    return (
        <>
            {!hasLoadedOnce &&(
                <ExploreSkeleton />
            )}
            <div className="explore-container">
        
                    <div className={isSidebarActive ? "explore-left" : "explore-left-closed"}>
                        {isSidebarActive && (
                        <Sidebar
                            filters={filters}
                            setFilters={setFilters}
                            countries={countries}
                            countriesLoading={countriesLoading}
                            setMapStyle={setMapStyle}
                            visualisationMode={visualisationMode}
                            setVisualisationMode={setVisualisationMode}
                            selectedYear={selectedYear}
                            setSelectedYear={setSelectedYear}
                            currentYear={currentYear}
                            loading = {loading}
                        />
                        )}
                    </div>
                    
                    
                <div className={isSidebarActive || selected ? "explore-map" : "explore-map-full-width"}>
                    <button 
                        className={`button-toggle-sidebar ${isSidebarActive ? 'button-toggle-sidebar-active' : 'button-toggle-sidebar-inactive'}`} 
                        onClick={toggleSidebar}
                    >
                        <FontAwesomeIcon icon={isSidebarActive ? faXmark : faRightFromBracket} />
                    </button>
                    <LeafletMap
                        sites={sites}
                        selected={selected}
                        setSelected={setSelected}
                        mapFocus={mapFocus}
                        mapStyle={mapStyle}
                        setMapStyle={setMapStyle}
                        visualisationMode={visualisationMode}
                        selectedYear={selectedYear}
                    />
                </div>
                <div className={selected ? "explore-right" : "explore-right-hidden"}>
                    <SingleSiteBar
                        selectedData={selectedData}
                        onClose={onClose}
                        loading={loading}
                    />
                </div>
            </div>
        </>
    );
}

export default Explore;
