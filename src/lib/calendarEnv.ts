export interface AirbnbCalendarSource {
  url: string;
  label: string;
}

/**
 * Reads Airbnb hosting iCal URLs from the environment.
 * Supports two listings via *_URL_1 / *_URL_2, with legacy AIRBNB_ICAL_URL as listing 1 fallback.
 */
export function getAirbnbCalendarSources(): AirbnbCalendarSource[] {
  const sources: AirbnbCalendarSource[] = [];

  const primary =
    process.env.AIRBNB_ICAL_URL_1?.trim() ||
    process.env.AIRBNB_ICAL_URL?.trim();

  if (primary) {
    sources.push({
      url: primary,
      label:
        process.env.AIRBNB_ICAL_LABEL_1?.trim() ||
        process.env.AIRBNB_ICAL_LABEL?.trim() ||
        'Club Sierra',
    });
  }

  const secondary = process.env.AIRBNB_ICAL_URL_2?.trim();
  if (secondary) {
    sources.push({
      url: secondary,
      label: process.env.AIRBNB_ICAL_LABEL_2?.trim() || 'Aloha Gardens',
    });
  }

  const seen = new Set<string>();
  return sources.filter((s) => {
    if (seen.has(s.url)) return false;
    seen.add(s.url);
    return true;
  });
}
