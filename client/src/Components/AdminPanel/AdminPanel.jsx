import { useEffect, useState } from "react";
import {
  fetchSites,
  uploadSiteImage,
} from "../../services/siteService";
import "./AdminPanel.css";

function AdminPanel() {
  const [sites, setSites] = useState([]);
  const [selectedSiteId, setSelectedSiteId] =
    useState("");

  const [imageFile, setImageFile] =
    useState(null);

  const [adminSecret, setAdminSecret] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [message, setMessage] =
    useState("");

  useEffect(() => {
    fetchSites()
      .then((data) => {
        setSites(data);
      })
      .catch((error) => {
        setMessage(
          error.response?.data?.message ||
            error.message
        );
      });
  }, []);

  const handleUpload = async () => {
    if (
      !selectedSiteId ||
      !imageFile ||
      !adminSecret
    ) {
      setMessage(
        "Site, görsel ve admin şifresi gerekli."
      );

      return;
    }

    try {
      setLoading(true);
      setMessage("");

      await uploadSiteImage(
        selectedSiteId,
        imageFile,
        adminSecret
      );

      setMessage(
        "Görsel başarıyla yüklendi."
      );

      setImageFile(null);
      setSelectedSiteId("");
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          error.message
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-container">
      <h1 className="header-admin">
        Admin Panel
      </h1>

      <input
        type="password"
        placeholder="Admin şifresi"
        value={adminSecret}
        onChange={(e) =>
          setAdminSecret(e.target.value)
        }
      />

      <select
        value={selectedSiteId}
        onChange={(e) =>
          setSelectedSiteId(e.target.value)
        }
      >
        <option value="">
          Site seç
        </option>

        {sites.map((site) => (
          <option
            key={site._id}
            value={site._id}
          >
            {site.name}
          </option>
        ))}
      </select>

      <input
        type="file"
        accept="image/*"
        onChange={(e) =>
          setImageFile(
            e.target.files?.[0] || null
          )
        }
      />

      <button
        onClick={handleUpload}
        disabled={loading}
      >
        {loading
          ? "Yükleniyor..."
          : "Görsel Yükle"}
      </button>

      {message && (
        <p>{message}</p>
      )}
    </div>
  );
}

export default AdminPanel;