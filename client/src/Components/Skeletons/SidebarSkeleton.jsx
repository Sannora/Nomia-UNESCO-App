import './Skeleton.css'

function SidebarSkeleton() {


    return(
        <div className="loading-skeleton">
          <div className="skeleton-top">
            <div className="skeleton-bar"></div>
            <div className="skeleton-bar"></div>
            <div className="skeleton-bar"></div>
          </div>
          <div className="skeleton-bottom">
            <div className="skeleton-bar">
              <div className="skeleton-icon"></div>
              <div className="skeleton-icon"></div>
            </div>
          </div>
        </div>
    )

}

export default SidebarSkeleton;