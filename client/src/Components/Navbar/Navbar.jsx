import { useState, useEffect } from 'react'
import './Navbar.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import logoMonogram from '../../assets/logo-nomia-monogram.png'
import logoMonogramWhite from '../../assets/logo-nomia-monogram-white.png'
import { Link } from 'react-router-dom'

function Navbar(){

    const [header, setHeader] = useState(false);

    useEffect(() => {
        const updateHeader = () => {
            setHeader(window.scrollY >= 100)
        }

        updateHeader()
        window.addEventListener('scroll', updateHeader)
        return () => window.removeEventListener('scroll', updateHeader)
    }, [])

    return(
        <div className={header ? 'navbar-container navbar-solid' : 'navbar-container' }>
            <div className="navbar">
                <div className="logo-container">
                    <img src={ header ? logoMonogram: logoMonogramWhite } className='logo' alt="logo" />
                </div>
                <div className="header-buttons-container">
                    <Link to={'/explore'}>
                        <button className={header ? 'button-explore button-explore-alternate' : 'button-explore' }>
                         Explore
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default Navbar
