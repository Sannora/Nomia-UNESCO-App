import './LandingPage.css'
import Hero from '../Hero/Hero'
import GetToKnow from '../GetToKnow/GetToKnow'
import MapPeek from '../MapPeek/MapPeek'
import FeaturingCards from '../FeaturingCards/FeaturingCards'
import MobileCTA from '../MobileCTA/MobileCTA'
import Footer from '../Footer/Footer'
import useSites from '../../hooks/useSites'
import Navbar from '../Navbar/Navbar'

function LandingPage(){
    
 const { sites } = useSites({ limit: 1000 });

    return(

        <>
        <Navbar />
        <Hero />
        <GetToKnow />
        <MapPeek
        sites = {sites}
        />
        <FeaturingCards />
        <MobileCTA />
        <Footer />

        </>

    )

}

export default LandingPage