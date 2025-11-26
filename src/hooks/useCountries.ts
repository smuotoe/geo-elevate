import { useState, useEffect } from 'react';
import { type Country, countries as staticCountries } from '../data/countries';
import { fetchCountries } from '../services/api';

const CACHE_KEY = 'geo-elevate-countries-data';
const CACHE_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days

interface CacheData {
    timestamp: number;
    data: Country[];
}

export function useCountries() {
    const [countries, setCountries] = useState<Country[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadCountries = async () => {
            try {
                // Check cache first
                const cached = localStorage.getItem(CACHE_KEY);
                if (cached) {
                    const { timestamp, data }: CacheData = JSON.parse(cached);
                    const now = Date.now();
                    if (now - timestamp < CACHE_DURATION) {
                        setCountries(data);
                        setLoading(false);
                        return;
                    }
                }

                // Fetch from API
                const apiData = await fetchCountries();
                setCountries(apiData);

                // Update cache
                localStorage.setItem(CACHE_KEY, JSON.stringify({
                    timestamp: Date.now(),
                    data: apiData
                }));
            } catch (err) {
                console.warn('Falling back to static data due to API error:', err);
                setCountries(staticCountries);
                setError('Failed to load latest data. Using offline mode.');
            } finally {
                setLoading(false);
            }
        };

        loadCountries();
    }, []);

    return { countries, loading, error };
}
