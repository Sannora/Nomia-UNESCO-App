import '../LayerStyles.css'
import { Marker } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import { markerIcons } from "../../../utlis/markerIcons";

const API_BASE = import.meta.env.VITE_API_BASE;

function StandardLayer({valid, selected, setSelected, createClusterIcon, createTooltipHTML}){

    return(
        <MarkerClusterGroup Group chunkedLoading iconCreateFunction={createClusterIcon}>
            {valid.map((site) => (
              <Marker
                key={site._id ?? site.id_no}
                position={[site.coordinates.lat, site.coordinates.long]}
                icon={markerIcons[site.category] || markerIcons.Cultural}
                className={selected?._id === site._id ? "marker-selected" : ""}
                eventHandlers={{
                  add: (e) => {
                    const marker = e.target;
                    const thumbnailUrl = API_BASE + site.image;
                    marker.bindTooltip(createTooltipHTML(site.name, thumbnailUrl), {
                      permanent: false,
                      direction: "top",
                      offset: [0, -10],
                      className: "custom-tooltip",
                    });
                    marker.on("click", () => {setSelected(site._id);});
                  },
                }}
              >
              </Marker>
            ))}
        </MarkerClusterGroup>
    )

}

export default StandardLayer;