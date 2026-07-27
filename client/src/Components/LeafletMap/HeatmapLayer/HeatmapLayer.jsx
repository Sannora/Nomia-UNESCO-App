import { useMemo } from 'react';
import Heatlayer from '../Heatlayer/Heatlayer'

function HeatmapLayer({valid}){

  const hotspotArray = useMemo(() => {

    const GRID_SIZE = 4;
    const MID_OFFSET = GRID_SIZE / 2;
    
    const hotspots = {};
    
    // Danger durumundaki bütün site'ları gezip ısı kümeleri oluştur.
    valid.forEach((site) => {
      if (site.danger) {
        const hotLat =
          Math.floor(site.coordinates.lat / GRID_SIZE) * GRID_SIZE + MID_OFFSET;
    
        const hotLong =
          Math.floor(site.coordinates.long / GRID_SIZE) * GRID_SIZE + MID_OFFSET;
    
        const hotspotId = `${hotLat}_${hotLong}`;
    
        if (hotspots[hotspotId]) {
          hotspots[hotspotId].count++;
        } else {
          hotspots[hotspotId] = {
            hotspotId,
            lat: hotLat,
            long: hotLong,
            count: 1,
          };
        }
      }
    });
    
      // Nesneyi Array'e çevirip forEach ile gez, maxCount'u referans değer olarark tutup intensity hesapla.
      return Object.values(hotspots);
    
  }, [valid])
    
  const heatPoints = useMemo(() => {

          let maxCount = 1;
    
          hotspotArray.forEach((hotspot) => {
            if (hotspot.count > maxCount) {
              maxCount = hotspot.count/1000;
            }
          });
      
      // Array'i heatmap'i besleyebilecek şekilde (lat,long,intensity) formatına çevir.
      return hotspotArray.map((hotspot) => [
        hotspot.lat,
        hotspot.long,
        hotspot.count / maxCount, // Intensity
      ]);

  }, [hotspotArray])

    return(
        <Heatlayer points={heatPoints} options={{
          radius: 30,
          blur: 20,
          gradient: {0.4: 'blue', 0.6: 'lime', 0.8: 'orange', 1.0: 'red'}
        }} />
    )
}

export default HeatmapLayer;