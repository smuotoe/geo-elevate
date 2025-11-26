export interface Country {
    name: string;
    capital: string;
    region: string;
    code: string; // ISO 2-letter code for flag URL
}

export const countries: Country[] = [
    { name: "France", capital: "Paris", region: "Europe", code: "FR" },
    { name: "Germany", capital: "Berlin", region: "Europe", code: "DE" },
    { name: "Japan", capital: "Tokyo", region: "Asia", code: "JP" },
    { name: "Brazil", capital: "Brasília", region: "Americas", code: "BR" },
    { name: "Canada", capital: "Ottawa", region: "Americas", code: "CA" },
    { name: "Australia", capital: "Canberra", region: "Oceania", code: "AU" },
    { name: "Egypt", capital: "Cairo", region: "Africa", code: "EG" },
    { name: "India", capital: "New Delhi", region: "Asia", code: "IN" },
    { name: "Italy", capital: "Rome", region: "Europe", code: "IT" },
    { name: "Spain", capital: "Madrid", region: "Europe", code: "ES" },
    { name: "United States", capital: "Washington, D.C.", region: "Americas", code: "US" },
    { name: "United Kingdom", capital: "London", region: "Europe", code: "GB" },
    { name: "China", capital: "Beijing", region: "Asia", code: "CN" },
    { name: "Russia", capital: "Moscow", region: "Europe", code: "RU" },
    { name: "South Africa", capital: "Pretoria", region: "Africa", code: "ZA" },
    { name: "Argentina", capital: "Buenos Aires", region: "Americas", code: "AR" },
    { name: "Mexico", capital: "Mexico City", region: "Americas", code: "MX" },
    { name: "Nigeria", capital: "Abuja", region: "Africa", code: "NG" },
    { name: "South Korea", capital: "Seoul", region: "Asia", code: "KR" },
    { name: "Turkey", capital: "Ankara", region: "Asia", code: "TR" },
];
