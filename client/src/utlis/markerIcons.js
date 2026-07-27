import L from 'leaflet';

function svgMarker(color){
  return `
  <svg width="32" height="32" viewBox="0 0 24 24" fill="${color}" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="10" stroke="white" stroke-width="2"/>
  </svg>
  `;
}

export const markerIcons ={
    Cultural: L.divIcon({
        html: svgMarker('#E4A11B'),
        className: 'marker-icon',
        iconSize: [24, 24],
        iconAnchor: [16, 32],
    }),
    Natural: L.divIcon({
        html: svgMarker('#48AD65'),
        className: 'marker-icon',
        iconSize: [24, 24],
        iconAnchor: [16, 32],
    }),
    Mixed: L.divIcon({
        html: svgMarker('#3498DB'),
        className: 'marker-icon',
        iconSize: [24, 24],
        iconAnchor: [16, 32],
    })
};
