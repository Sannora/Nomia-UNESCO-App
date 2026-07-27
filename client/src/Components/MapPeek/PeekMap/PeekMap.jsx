import './PeekMap.css'
import {
  MapContainer,
  TileLayer,
  Marker,
} from "react-leaflet";

import MarkerClusterGroup from "react-leaflet-cluster";
import L from "leaflet";

import "leaflet/dist/leaflet.css";

import iconRetinaUrl from "leaflet/dist/images/marker-icon-2x.png";
import iconUrl from "leaflet/dist/images/marker-icon.png";
import shadowUrl from "leaflet/dist/images/marker-shadow.png";

import { markerIcons } from "../../../utlis/markerIcons";

const jawgToken = import.meta.env.VITE_JAWG_API_KEY;

const getTileUrl = (style) =>
  `https://tile.jawg.io/${style}/{z}/{x}/{y}{r}.png?access-token=${jawgToken}`;

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
});

const createClusterIcon = (cluster) =>
  L.divIcon({
    html: `
      <div class="cluster-wrapper">
        <span class="cluster-count">
          ${cluster.getChildCount()}
        </span>
      </div>
    `,
    className: "",
    iconSize: L.point(40, 40, true),
  });

function PeekMap({ sites = [] }) {

  const valid = sites.filter(
    (site) =>
      site.coordinates &&
      site.coordinates.lat != null &&
      site.coordinates.long != null
  );

  return (
    <MapContainer
      center={[25, 15]}
      zoom={2}

      zoomControl={false}

      dragging={false}
      scrollWheelZoom={false}
      doubleClickZoom={false}
      touchZoom={false}
      keyboard={false}
      boxZoom={false}

      attributionControl={false}

      className="peek-map"
    >

      <TileLayer
        url={getTileUrl("jawg-lagoon")}
        tileSize={512}
        zoomOffset={-1}
      />

      <MarkerClusterGroup
        chunkedLoading
        iconCreateFunction={createClusterIcon}
      >

        {valid.map((site) => (
          <Marker
            key={site._id ?? site.id_no}
            position={[
              site.coordinates.lat,
              site.coordinates.long,
            ]}
            icon={
              markerIcons[site.category] ??
              markerIcons.Cultural
            }
          />
        ))}

      </MarkerClusterGroup>

    </MapContainer>
  );
}

export default PeekMap;