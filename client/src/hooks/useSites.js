import { useEffect } from "react";
import { useState } from "react";
import { fetchSites } from "../services/siteService";

export default function useSites(initialParams = {}) {
    const [sites, setSites] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [params, setParams] = useState(initialParams);

    useEffect(() => {
        let mounted = true;
        setLoading(true);

        fetchSites(params)
          .then((data) => {
            if (mounted) setSites(data);
          })
          .catch((e) => mounted && setError(e))
          .finally(() => mounted && setLoading(false));

        return () => {
          mounted = false;
        };
    }, [params]);


    return { sites, setSites, loading, error, params, setParams };

}