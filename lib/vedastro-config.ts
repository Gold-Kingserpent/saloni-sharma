// lib/vedastro-config.ts

// Base API host for VedAstro
export const VEDASTRO_API = "https://api.vedastro.org";

// All endpoints we use, already expanded to absolute URLs
export const API_ENDPOINTS = {
  // JSON planet data including ecliptic longitude
  allPlanetDataJson:
    `${VEDASTRO_API}/api/AllPlanetData?year=YEAR&month=MONTH&day=DAY&hour=HOUR&minute=MINUTE&lat=LAT&lon=LON&timezone=TZ_MINUTES&planet=PLANET&format=json`,

  // Optional direct sign endpoints if you still want to experiment
  sunSign:
    `${VEDASTRO_API}/Person/SunSign?location=LAT,LON&time=YEAR-MONTH-DAYTHOUR:MINUTE:00+TZ_MINUTES`,
  moonSign:
    `${VEDASTRO_API}/Person/MoonSign?location=LAT,LON&time=YEAR-MONTH-DAYTHOUR:MINUTE:00+TZ_MINUTES`,
};
