import "./MapPeek.css";
import PeekMap from "./PeekMap/PeekMap";

function MapPeek({sites = []}) {
  return (
    <section className="section-map-peek">

      <h1 className="heading-map-peek">
        explore the heritage with <strong>interactive unesco sites map</strong>
      </h1>
      <p className="text-map-peek">
        Discover the rich cultural heritage of humanity through our interactive
        map showcasing UNESCO World Heritage Sites. Interactive map offers you
        to navigate through the cumulative riches of our world with details for
        each site. You can navigate, gain insights and explore the heritage
        sites with an easy to use interface. Have a quick peek from the
        prototype map below!
      </p>
      <div className="map-peek-container">
        <PeekMap sites = {sites} />
      </div>

    </section>
  );
}

export default MapPeek;