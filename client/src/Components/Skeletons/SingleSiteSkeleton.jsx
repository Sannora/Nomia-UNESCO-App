import './Skeleton.css'

function SingleSiteSkeleton() {

    return(

        <div className="loading-skeleton">
            <div className="skeleton-image"></div>
            <div className="skeleton-bar"></div>
            <div className="skeleton-bar"></div>
            <div className="skeleton-bar"></div>
            <div className="skeleton-bar"></div>
            <div className="skeleton-bar"></div>
            <div className="skeleton-bottom">
            <div className="skeleton-bar">
              <div className="skeleton-icon"></div>
              <div className="skeleton-icon"></div>
            </div>
          </div>
        </div>

    )

}

export default SingleSiteSkeleton;