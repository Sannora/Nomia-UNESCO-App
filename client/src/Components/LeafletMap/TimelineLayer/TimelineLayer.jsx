import '../LayerStyles.css'
import { markerIcons } from "../../../utlis/markerIcons";
import { Marker } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import { useMemo } from 'react';

const API_BASE = import.meta.env.VITE_API_BASE;

function TimelineLayer({valid, selectedYear, createClusterIcon, createTooltipHTML, selected, setSelected}){
    
    const timelineSites = useMemo(() => {
      return valid.filter(site =>
        site.dateInscribed <= selectedYear
      );
    }, [valid, selectedYear]);

    return(
        <MarkerClusterGroup Group chunkedLoading iconCreateFunction={createClusterIcon}>
            {timelineSites.map((timelineSite) => (
              <Marker
                key={timelineSite._id ?? timelineSite.id_no}
                position={[timelineSite.coordinates.lat, timelineSite.coordinates.long]}
                icon={markerIcons[timelineSite.category] || markerIcons.Cultural}
                className={selected?._id === timelineSite._id ? "marker-selected" : ""}
                eventHandlers={{
                  add: (e) => {
                    const marker = e.target;
                    const thumbnailUrl = timelineSite.image;
                    marker.bindTooltip(createTooltipHTML(timelineSite.name, thumbnailUrl), {
                      permanent: false,
                      direction: "top",
                      offset: [0, -10],
                      className: "custom-tooltip",
                    });
                    marker.on("click", () => {setSelected(timelineSite._id);});
                  },
                }}
              >
              </Marker>
            ))}
        </MarkerClusterGroup>
    )
}

export default TimelineLayer