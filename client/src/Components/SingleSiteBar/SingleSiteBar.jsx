import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './SingleSiteBar.css'
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import SingleSiteSkeleton from '../Skeletons/SingleSiteSkeleton';

function SingleSiteBar({ selectedData, onClose, loading }) {

    const API_BASE = import.meta.env.VITE_API_BASE;

    return (
        <div className="single-site-container">
            {loading ?(
                <SingleSiteSkeleton />
            ):(
                <>
                <div 
                key={selectedData?._id ?? selectedData?.id_no}
                className="single-site-background"
                style={{ backgroundImage: `url(${API_BASE}${selectedData?.image})` }}
                />
                    <div className="single-site">
                        <div className="site-image-container">
                            <img src={`${API_BASE}${selectedData?.image}`} alt="" className="image-site" />
                        </div>
                        <h1 className="heading-site">{selectedData?.name}</h1>
                        <div className="site-details">
                            <p className="site-info">{selectedData?.longDescription ?? selectedData?.shortDescription ?? "No summary available."}</p>
                            <ul className="site-stats">
                                <li className="site-stat">
                                    <strong>Category:</strong> {selectedData?.category}
                                </li>
                                <li className="site-stat">
                                    <strong>Region:</strong> {selectedData?.region}
                                </li>
                                <li className="site-stat">
                                    <strong>Country:</strong> {selectedData?.country}
                                </li>
                                <li className="site-stat">
                                    <strong>Inscription Date:</strong> {selectedData?.dateInscribed}
                                </li>
                            </ul>
                        </div>
                    </div>
                <div className="single-site-utils-container">
                    <div className="close" onClick={onClose}>
                        <FontAwesomeIcon className='single-site-utils-icon' icon={faXmark} />
                    </div>
                </div>
                </>
            )}
        </div>
        

    )

}

export default SingleSiteBar;