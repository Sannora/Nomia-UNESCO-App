import { useEffect, useState } from 'react';
import { fetchSites, uploadSiteImage } from '../../services/siteService';
import './AdminPanel.css';

function AdminPanel() {

    const [sites, setSites] = useState([]);
    const [selectedSiteId, setSelectedSiteId] = useState("");
    const [imageFile, setImageFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    useEffect(() => {
        fetchSites()
        .then((data) => {
            setSites(data);
        })
    }, [])

    const handleUpload = async () => {
      if (!selectedSiteId || !imageFile) {
        setMessage("Site ve görsel seç.");
        return;
      }
  
      try {
        setLoading(true);
        setMessage("");
    
        await uploadSiteImage(selectedSiteId, imageFile);
    
        setMessage("Görsel başarıyla yüklendi.");
        setImageFile(null);
        setSelectedSiteId("");
    
      } catch (error) {
        setMessage(error.response?.data?.message || error.message);
      } finally {
        setLoading(false);
      }
    };


    return (

        <>
        <div className="admin-container">
            <h1 className='header-admin'>Admin Panel</h1>
            <select
              value={selectedSiteId}
              onChange={(e) => setSelectedSiteId(e.target.value)}
            >
              <option value="">Site seç</option>
                
              {sites.map(site => (
                <option key={site._id} value={site._id}>
                  {site.name}
                </option>
              ))}
            </select>
            <input 
            type="file"
            accept='image/*'
            onChange={(e) => setImageFile(e.target.files[0])}
            />
            <button onClick={handleUpload} disabled={loading}>
              {loading ? "Yükleniyor..." : "Görsel Yükle"}
            </button>
        </div>
        </>

    )

}

export default AdminPanel;