import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { MapContainer, TileLayer, Popup, useMap, CircleMarker } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./LeafletMap.css";
import iconRetinaUrl from "leaflet/dist/images/marker-icon-2x.png";
import iconUrl from "leaflet/dist/images/marker-icon.png";
import shadowUrl from "leaflet/dist/images/marker-shadow.png";
import StandardLayer from "./StandardLayer/StandardLayer";
import HeatmapLayer from "./HeatmapLayer/HeatmapLayer";
import DensityLayer from "./DensityLayer/DenistyLayer";
import TimelineLayer from "./TimelineLayer/TimelineLayer";

const jawgToken = import.meta.env.VITE_JAWG_API_KEY;

// ---- Dinamik Tile URL ----
const getTileUrl = (style) =>
  `https://tile.jawg.io/${style}/{z}/{x}/{y}{r}.png?access-token=${jawgToken}`;

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
});

// ---- Harita Focus Controller ----
function MapFocusController({ mapFocus }) {
  const map = useMap();

  useEffect(() => {
    if (!mapFocus) return;
    const { center, zoom } = mapFocus;
    map.flyTo(center, zoom, { duration: 1.2 });
  }, [mapFocus, map]);

  return null;
}

// ---- Marker Select Controller ----
function MapController({ selected }) {
  const map = useMap();
  useEffect(() => {
    if (selected?.coordinates?.lat != null && selected?.coordinates?.long != null) {
      map.setView(
        [selected.coordinates.lat, selected.coordinates.long],
        10,
        { animate: true }
      );
    }
  }, [selected, map]);
  return null;
}

export default function LeafletMap({ sites = [], selected, setSelected, mapFocus, mapStyle,
  visualisationMode, selectedYear
}) {

  const valid = useMemo(() => {

    return sites.filter(
        (s) =>
          s.coordinates &&
          s.coordinates.lat != null &&
          s.coordinates.long != null
      )

  }, [sites])

  // --- Harita Modu Controller ---

  const [renderMode, setRenderMode] = useState("standard");

  useEffect(() => {
    switch(visualisationMode) {

      case "standard":
        setRenderMode("standard");
        break;

      case "heatmap":
        setRenderMode("heatmap");
        break;

      case "density":
        setRenderMode("density");
        break;

      case "timeline":
        setRenderMode("timeline");
        break;

    }
  } , [visualisationMode]);

  const createClusterIcon = useCallback((cluster)=>
    L.divIcon({
      html: `
        <div class="cluster-wrapper">
          <span class="cluster-count">${cluster.getChildCount()}</span>
        </div>
      `,
      className: "",
      iconSize: L.point(40, 40, true),
    }), []
  )


  const createTooltipHTML = useCallback((name, thumbnail) =>   
    `
    <div style="
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
    ">
      <img
        src="${thumbnail}"
        alt="${name}"
        style="width: 150px; height: 150px; object-fit: cover; border-radius: 4px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);"
      />
      <span style="font-size: 14px; font-weight: 600; display: block; max-width: 150px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
        ${name}
      </span>
    </div>
  `, []
  )


  return (
    <div className="leaflet-map-wrapper">

      <MapContainer
        center={[39.9, 32.8]}
        zoom={4}
        minZoom={3}
        maxZoom={18}
        zoomControl={false}
        worldCopyJump={false}
        noWrap={true}
        maxBounds={[
          [-85, -180],
          [85, 180],
        ]}
        maxBoundsViscosity={1.0}
        preferCanvas={true}
        className="leaflet-map-component"
      >
        <TileLayer
          key={mapStyle}
          url={getTileUrl(mapStyle)}
          attribution='&copy; <a href="https://jawg.io">Jawg</a> | &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          maxZoom={18}
          tileSize={512}
          zoomOffset={-1}
          noWrap={true}
          errorTileUrl="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapController selected={selected} />
        <MapFocusController mapFocus={mapFocus} />

        {renderMode === "standard" && (
          <StandardLayer
          valid = {valid}
          selected = {selected}
          setSelected = {setSelected}
          createClusterIcon = {createClusterIcon}
          createTooltipHTML = {createTooltipHTML}
          />
        )}
        {renderMode === "heatmap" && (
          <>
            <HeatmapLayer
            valid = {valid}
            />
          </>
        )}
        {renderMode === "density" &&
          <DensityLayer
          valid = {valid}
          />
        }
          {renderMode === "timeline" &&(
            <TimelineLayer
            valid = {valid}
            selectedYear = {selectedYear}
            createClusterIcon = {createClusterIcon}
            createTooltipHTML = {createTooltipHTML}
            selected = {selected}
            setSelected = {setSelected}
            />
          )}
      </MapContainer>
    </div>
  );
}
