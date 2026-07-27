import { useEffect, useState } from "react";
import { fetchCountries } from "../services/siteService";

export default function useCountries(){
    const [countries, setCountries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {

        let mounted = true;
        setLoading(true);

        fetchCountries()
            .then((data) => {
                if (mounted) setCountries(data);
            })
            .catch((e) => mounted && setError(e))
            .finally(() => mounted && setLoading(false));

        return () => {
            mounted = false;
        }

    }, [])

    return { countries, loading, error }

}