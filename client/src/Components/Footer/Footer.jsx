import './Footer.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faGithub, faLinkedin} from '@fortawesome/free-brands-svg-icons';

function Footer() {

    return(

        <>
        
            <section className="section-footer">
                <div className="footer-container">
                    <div className="footer-column">
                        <h1 className="heading-footer"><strong>nomia: </strong> <br/> where simplicity meets legacy</h1>
                    </div>
                    <div   div className="footer-column">
                        <h2 className="heading-contact">Contact Me</h2>
                        <ul className="contact-list">
                            <li className="contact-item"><a href="mailto:mmh.melih@gmail.com">mmh.melih@gmail.com</a></li>
                        </ul>
                    </div>
                    <div className="footer-column">
                        <h2 className="heading-links">Links</h2>
                        <ul className="links-list">
                            <li className="links-item"><a href='https://github.com/Sannora' target="_blank"><FontAwesomeIcon className='icon-links' icon={faGithub} /></a></li>
                            <li className="links-item"><a href='https://www.linkedin.com/in/melih-mecit-hocao%C4%9Flu/' target="_blank"><FontAwesomeIcon className='icon-links' icon={faLinkedin} /></a></li>
                        </ul>
                    </div>
                </div>
            </section>

        </>

    )

}

export default Footer;