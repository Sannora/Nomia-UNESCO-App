import { Link } from 'react-router-dom';
import './Hero.css';

function Hero() {

    return(

        <>
        
        <section className="section-hero">
            <div className="hero-content">
                <h1
                aria-label='explore the heritage'
                className="heading-hero">
                    explore <br /> the <br /> <strong className='typewriter'></strong>
                </h1>
                <p className="description-hero">View UNESCO World Heritages on an <strong>interactive world map</strong></p>
                <div className="utils-hero">
                    <Link to={'/explore'}>
                        <button className="button-hero button-hero-primary">Get Started</button>
                    </Link>
                </div>
            </div>
            <div className="hero-bottom"></div>
        </section>

        </>

    )

}

export default Hero;