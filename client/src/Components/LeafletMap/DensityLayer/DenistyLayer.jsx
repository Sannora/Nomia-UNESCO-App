import { useMemo, useState } from "react";
import { CircleMarker, useMapEvents } from "react-leaflet";
import "../LayerStyles.css";

function DensityLayer({ valid }) {
  const [gridSize, setGridSize] = useState(4);

  // Zoom değişince grid boyutunu güncelle
  useMapEvents({
    zoomend(e) {
      const zoom = e.target.getZoom();

      if (zoom <= 2) setGridSize(12);
      else if (zoom <= 4) setGridSize(6);
      else if (zoom <= 6) setGridSize(3);
      else if (zoom <= 8) setGridSize(1.5);
      else if (zoom <= 10) setGridSize(0.75);
      else setGridSize(0.35);
    },
  });

  // Gridleri sadece valid veya gridSize değişince yeniden hesapla
  const grids = useMemo(() => {
    const MID_OFFSET = gridSize / 2;
    const temp = {};

    valid.forEach((site) => {
      const gridLat =
        Math.floor(site.coordinates.lat / gridSize) * gridSize + MID_OFFSET;

      const gridLong =
        Math.floor(site.coordinates.long / gridSize) * gridSize + MID_OFFSET;

      const id = `${gridLat}_${gridLong}`;

      if (temp[id]) {
        temp[id].count++;
      } else {
        temp[id] = {
          id,
          lat: gridLat,
          long: gridLong,
          count: 1,
        };
      }
    });

    return Object.values(temp);
  }, [valid, gridSize]);

  const getDensityColor = (count) => {
    if (count >= 20) return "#DC2626";
    if (count >= 10) return "#F97316";
    if (count >= 5) return "#FACC15";
    return "#3B82F6";
  };

  return (
    <>
      {grids.map((grid) => (
        <CircleMarker
          key={grid.id}
          center={[grid.lat, grid.long]}
          radius={Math.sqrt(grid.count) * 3 + 3}
          pathOptions={{
            fillColor: getDensityColor(grid.count),
            fillOpacity: 0.45,
            color: "#ffffff",
            opacity: 0.4,
            weight: 1.5,
          }}
          eventHandlers={{
            add: (e) => {
              e.target.bindTooltip(
                `
                  <div style="
                    text-align:center;
                    font-family:sans-serif;
                    padding:2px 4px;
                  ">
                    <strong>${grid.count}</strong><br/>
                    UNESCO Site${grid.count > 1 ? "s" : ""}
                  </div>
                `,
                {
                  direction: "top",
                  offset: [0, -4],
                  className: "custom-tooltip",
                }
              );
            },
          }}
        />
      ))}
    </>
  );
}

export default DensityLayer;