import type { Country } from '../data/countries';

const API_URL = 'https://restcountries.com/v3.1/all?fields=name,capital,cca2,region,flags';

interface RestCountry {
    name: {
        common: string;
    };
    capital: string[];
    cca2: string;
    region: string;
    flags: {
        png: string;
        svg: string;
    };
}

export async function fetchCountries(): Promise<Country[]> {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error('Failed to fetch countries');
        }
        const data: RestCountry[] = await response.json();

        return data
            .filter((c) => c.capital && c.capital.length > 0) // Ensure capital exists
            .map((c) => ({
                name: c.name.common,
                capital: c.capital[0],
                region: c.region,
                code: c.cca2,
            }));
    } catch (error) {
        console.error('Error fetching countries:', error);
        throw error;
    }
}
