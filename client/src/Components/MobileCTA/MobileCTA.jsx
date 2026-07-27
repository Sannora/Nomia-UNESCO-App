import './MobileCTA.css'
import ctaImage from '../../assets/mobile-cta.png'

function MobileCTA() {

    return (

        <>  
        <section className="section-mobile-cta">
            <div className="mobile-cta-container">
                <div className="cta-left">
                    <h1 className="heading-cta">fully <strong>mobile compatible</strong></h1>
                    <p className="text-cta">The app is also fully mobile compatible.
                        You can now browse the world heritage on the comfort of your mobile screen.
                    </p>
                </div>
                <div className="cta-right">
                    <div className="cta-image-bg">
                        <img src={ctaImage} alt="Mobile CTA Image" className="cta-image" />
                    </div>
                </div>
            </div>
        </section>
        </>

    )

}

export default MobileCTA