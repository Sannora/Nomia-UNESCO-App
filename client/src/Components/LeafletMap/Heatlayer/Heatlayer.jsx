import { useMap } from "react-leaflet";
import { useEffect } from "react";
import L from "leaflet";
import "leaflet.heat";

const Heatlayer = ({points, options}) => {

    const map = useMap();

    useEffect(() => {

        if (!map || !points) return;

        const heatLayer = L.heatLayer(points, {
            radius: 25,
            blur: 15,
            maxZoom: 17,
            ...options,
        });

        heatLayer.addTo(map);

        return () => {
            map.removeLayer(heatLayer)
        };
    }, [map, points, options]);

    return null;

}

export default Heatlayer;