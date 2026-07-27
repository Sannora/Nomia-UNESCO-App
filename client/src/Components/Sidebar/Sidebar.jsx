import { useState, useEffect } from 'react';
import './Sidebar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp , faLeaf, faSliders,
  faGears,
  faMagnifyingGlass, faEarthAfrica,
  faFlag, faLayerGroup, faLandmark,
  faFireFlameSimple, faCircleDot, faTimeline,
  faTrash, faHouseChimney
} from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom'

/* silhouette Images */
import parthenon from "../../assets/silhouette-parthenon.png"
import kinkakuJi from "../../assets/silhouette-kinkaku-ji.png"
import saintMichel from "../../assets/silhouette-mont-saint-michel.png"
import angkorWat from "../../assets/silhouette-angkor-wat.png"
import nemrut from "../../assets/silhouette-nemrut.png"
import neuwschwanstein from "../../assets/silhouette-neuschwanstein.png"
import stBasil from "../../assets/silhouette-st-basil.png"
import sydneyOpera from "../../assets/silhouette-sydney-opera.png"
import tajMahal from "../../assets/silhouette-taj-mahal.png"
import SidebarSkeleton from '../Skeletons/SidebarSkeleton';

const silhouettes = [
  parthenon, kinkakuJi, saintMichel, angkorWat, nemrut, neuwschwanstein, stBasil, sydneyOpera, tajMahal
];

const optionsRegion = ["Worldwide", "Africa", "Americas", "Asia", "Europe", "Oceania"];
const quickOptions = ["Cultural", "Natural", "Mixed"];

const themeOptions = {Default: "jawg-lagoon", Light: "jawg-sunny", Dark:"jawg-dark"};

function Sidebar({ filters, setFilters, countries = [], countriesLoading = false,
 setMapStyle, visualisationMode, setVisualisationMode,
  selectedYear, setSelectedYear ,currentYear,
  loading,
}) {
  // dropdown toggle kontrol state'leri
  const [isQucikOpen, setIsQuickOpen] = useState(false);
  const [isDynamicOpen, setIsDynamicOpen] = useState(false);
  const [isRegionOpen, setIsRegionOpen] = useState(false);
  const [isCountryOpen, setIsCountryOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isVisualisationOpen, setIsVisualisationOpen] = useState(false);
  const [isTimelineActive, setIsTimelineActive] = useState(false);

  const [searchInput, setSearchInput] = useState(filters.search || "");

  // debounce timer
  useEffect(() => {
    const t = setTimeout(() => {
      setFilters(prev => ({ ...prev, search: searchInput }));
    }, 400);
    return () => clearTimeout(t);
  }, [searchInput, setFilters]);

  // Handler'lar
  const handleQuickSelect = (category) => {
    setFilters(prev => ({ ...prev, category: prev.category === category ? "" : category }));
  };

  const handleSelectRegion = (region) => {
    setFilters(prev => ({ ...prev, region }));
    setIsRegionOpen(false);
  };

  const handleSelectCountry = (country) => {
    setFilters(prev => ({ ...prev, country }));
    setIsCountryOpen(false);
  };

  const clearAll = () => {
    setSearchInput("");
    setFilters({ search: "", category: "", region: "", country: ""});
    setVisualisationMode("standard");
    setIsTimelineActive(false);
    setSelectedYear(currentYear);
  };

  const handleThemeSelect = (theme) => {
    localStorage.setItem('map_theme', theme);
    setMapStyle(theme);
    setIsSettingsOpen(false);
  };

  const handlevisualisationModeSelect = (mode) => {
    setVisualisationMode(mode);
    console.log("visualisation mode changed to:", mode);
    if(mode === "timeline"){
      setIsTimelineActive(true);
    }else{
      setIsTimelineActive(false);
    }
  };

  const progress = ((selectedYear - 1978) / (currentYear - 1978)) * 100;
  const handleTimelineYearChange = (e) => {
      setSelectedYear(Number(e.target.value));
  };

  const getTimelineColor = (progress) => {
    if (progress < 20) return "#2563EB";   // mavi
    if (progress < 40) return "#10B981";   // yeşil
    if (progress < 60) return "#FACC15";   // sarı
    if (progress < 80) return "#F97316";   // turuncu
    return "#DC2626";                      // kırmızı
  };
  
  const timelineColor = getTimelineColor(progress);

  // Silüet logic
  const [currentSilhouette] = useState(() => {
  const randomIndex = Math.floor(Math.random() * silhouettes.length);
  return silhouettes[randomIndex];
 });

  return (
    <div className="sidebar-container">
      {loading ?(
        <SidebarSkeleton />
      ) : (
        <>
          <div className="sidebar-top">
            <div className="search-container">
              <FontAwesomeIcon icon={faMagnifyingGlass} className="icon-search-input" />
              <input
                type="text"
                placeholder='Search a site...'
                className="input-site-search"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
            </div>

            <div className="quick-filter">
              <div className="heading-container heading-quick-filter-container" onClick={() => setIsQuickOpen(v => !v)}>
                <FontAwesomeIcon icon={faLeaf} className='icon-sidebar icon-quick-filter' />
                <h2 className="heading-quick-filter">Quick Filter</h2>
                <FontAwesomeIcon icon={isQucikOpen ? faChevronUp : faChevronDown} className='icon-dropdown-heading'/>
              </div>
              {isQucikOpen && (
                <div className="quick-filter-chips">
                  {quickOptions.map(opt => (
                    <button
                      key={opt}
                      className={`quick-filter-option ${filters.category === opt ? 'quick-filter-active' : ''}`}
                      onClick={() => handleQuickSelect(opt)}
                    >
                      {opt}
                    </button>
                  ))}
                  <button className="quick-filter-option" onClick={() => setFilters(prev => ({ ...prev, category: "" }))}>All</button>
                </div>
              )}
            </div>

            <div className="dynamic-filters">
              <div className="heading-container heading-dynamic-filters-container" onClick={() => setIsDynamicOpen(v => !v)}>
                <FontAwesomeIcon icon={faSliders} className='icon-sidebar icon-dynamic-filters' />
                <h2 className="heading-dynamic-filters">Dynamic Filters</ h2>
                <FontAwesomeIcon icon={isDynamicOpen ? faChevronUp : faChevronDown} className='icon-dropdown-heading'/>
              </div>

              {isDynamicOpen && (
                <div className="dynamic-filters-container">
                  <div className="dynamic-filter filter-region">
                    <h3 className="heading-region">
                      <FontAwesomeIcon icon={faEarthAfrica} className='icon-filter'></FontAwesomeIcon>
                      <p>Region</p>
                      </h3>
                    <button className="button-dropdown-toggle" onClick={() => setIsRegionOpen(v => !v)}>
                      {filters.region || "Select a region"}
                      <FontAwesomeIcon className="icon-dropdown" icon={isRegionOpen ? faChevronUp : faChevronDown} />
                    </button>
                    {isRegionOpen && (
                      <ul className="dropdown-list dropdown-region">
                        {optionsRegion.map((optionRegion, idx) => (
                          <li key={idx} className={`dropdown-item option-region ${filters.region === optionRegion ? 'option-region-active' : ''}`} onClick={() => handleSelectRegion(optionRegion)}>
                            {optionRegion}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  <div className="dynamic-filter filter-country">
                    <h3 className="heading-country">
                      <FontAwesomeIcon icon={faFlag} className='icon-filter'></FontAwesomeIcon>
                      <p>Country</p>
                    </h3>
                    <button className="button-dropdown-toggle" onClick={() => setIsCountryOpen(v => !v)}>
                      {filters.country || (countriesLoading ? "Loading..." : "Select a country")}
                      <FontAwesomeIcon className="icon-dropdown" icon={isCountryOpen ? faChevronUp : faChevronDown} />
                    </button>
                    {isCountryOpen && (
                      <ul className="dropdown-list dropdown-country">
                        {countries && countries.length > 0 ? (
                          countries.map((c, i) => (
                            <li key={i} className={`dropdown-item option-country ${filters.country === c ? 'option-country-active' : ''}`} onClick={() => handleSelectCountry(c)}>
                              {c}
                            </li>
                          ))
                        ) : (
                          <li className="dropdown-item">No countries</li>
                        )}
                      </ul>
                    )}
                  </div>
                </div>
              )}
            </div>
            <div className="visualisation-modes">
              <h3 className="heading-container heading-visualisation" onClick={() => setIsVisualisationOpen(v => !v)}>
                <FontAwesomeIcon icon={faLayerGroup} className='icon-sidebar'></FontAwesomeIcon>
                <p>Visualisation Modes</p>
                <FontAwesomeIcon icon={isVisualisationOpen ? faChevronUp : faChevronDown} className='icon-dropdown-heading'/>
              </h3>
              {isVisualisationOpen &&
                <ul className="list-visualisations">
                  <li className={`visualisation-item ${visualisationMode === "standard" ? 'visualisation-item-active' : ''}`} onClick={() => handlevisualisationModeSelect("standard")}>
                    <FontAwesomeIcon icon={faLandmark} className='icon-visualisation'></FontAwesomeIcon>
                    <p>Standard</p>
                  </li>
                  <li className={`visualisation-item ${visualisationMode === "heatmap" ? 'visualisation-item-active' : ''}`} onClick={() => handlevisualisationModeSelect("heatmap")}>
                    <FontAwesomeIcon icon={faFireFlameSimple} className='icon-visualisation'></FontAwesomeIcon>
                    <p>Endangered Sites Heatmap</p>
                  </li>
                  <li className={`visualisation-item ${visualisationMode === "density" ? 'visualisation-item-active' : ''}`} onClick={() => handlevisualisationModeSelect("density")}>
                    <FontAwesomeIcon icon={faCircleDot} className='icon-visualisation'></FontAwesomeIcon>
                    <p>Dot Site Density</p>
                  </li>
                  <li className={`visualisation-item ${visualisationMode === "timeline" ? 'visualisation-item-active' : ''}`} onClick={() => handlevisualisationModeSelect("timeline")}>
                    <FontAwesomeIcon icon={faTimeline} className='icon-visualisation'></FontAwesomeIcon>
                    <p>Sites Timeline</p>
                  </li>
                  {isTimelineActive && (
                    <div className='timeline-input'>
                      <p className="text-timeline">Select a timeline below</p>
                      <input
                      type="range"
                      className="slider-timeline"
                      min={1978}
                      max={currentYear}
                      value={selectedYear}
                      onChange={handleTimelineYearChange}
                      style={{
                          background: `linear-gradient(
                              90deg,
                              ${timelineColor} 0%,
                              #60A5FA ${progress}%,
                              rgba(255,255,255,.12) ${progress}%,
                              rgba(255,255,255,.12) 100%
                          )`,
                          "--thumb-color": timelineColor,
                      }}
                      />
                      <div className="timeline-years">

                          <span>1978</span>

                          <span>{selectedYear}</span>

                          <span>{currentYear}</span>

                      </div>
                      <p className="text-timeline">Showing sites up to: <strong>{selectedYear}</strong></p>
                    </div>
                  )}
                </ul>
              }
            </div>
              <button className="button-clear-all" onClick={clearAll}>
                <FontAwesomeIcon icon={faTrash}></FontAwesomeIcon>
                Clear all filters
              </button>
          </div>
          <div
            className="sidebar-bottom"
            style={{
              backgroundImage: `url(${currentSilhouette})`,
            }}
          >
            {isSettingsOpen && (
              <div className="theme-container">
                  <h3 className="heading-theme">Map Themes</h3>
                  <ul className="dropdown-list dropdown-theme">
                    {Object.keys(themeOptions).map((themeKey, idx) => (
                      <li key={idx} className="dropdown-item option-theme" onClick={() => handleThemeSelect(themeOptions[themeKey])}>
                        {themeKey}
                      </li>
                    ))}
                  </ul>
              </div>
            )}
            <div className="user-card-container">
                <div className="user-actions">
                  <Link to={'/'}><FontAwesomeIcon icon={faHouseChimney} className='action-button icon-home' /></Link>
                  <FontAwesomeIcon icon={faGears} className='action-button icon-settings' onClick={() => setIsSettingsOpen(v=>!v)} />
                </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Sidebar;
