import './FeaturingCards.css'

function FeaturingCards() {

    return (

        <>
        
        <section className="section-featuring-cards">
            <h1 className="heading-featuring-cards">observe the world <strong>in a different perspective</strong></h1>
            <p className="text-featuring-cards">
                Nomia offers you different and accurate visualisation modes which you can display the interactive map.
            </p>
            <div className="featuring-cards-container">
                <div className="featuring-card featuring-card-heatmap">
                    <h2 className="featuring-card-output">Endangered Sites Heatmap</h2>
                </div>
                <div className="featuring-card featuring-card-dotmap">
                    <h2 className="featuring-card-output">Dot Site Density</h2>
                </div>
                <div className="featuring-card featuring-card-timeline">
                    <h2 className="featuring-card-output">Sites Timeline</h2>
                </div>
            </div>
        </section>

        </>

    )

}

export default FeaturingCards;