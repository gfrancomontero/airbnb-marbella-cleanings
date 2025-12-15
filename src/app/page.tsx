'use client';

import { useCalendar } from '@/hooks/useCalendar';
import { getGapAlerts } from '@/lib/utils';
import {
  LoadingSpinner,
  ErrorAlert,
  Header,
  HeroCard,
  GapAlerts,
  CleaningsList,
  RefreshButton,
} from '@/components';

export default function Home() {
  const { cleanings, loading, error, lastUpdated, refresh } = useCalendar();

  // Derive data from cleanings
  const nextCleaning = cleanings[0] ?? null;
  const upcomingCleanings = cleanings.slice(1, 11); // Skip first (shown in hero)
  const gapAlerts = getGapAlerts(cleanings);

  // Show loading spinner on initial load
  if (loading && cleanings.length === 0) {
    return <LoadingSpinner />;
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-cyan-50 to-teal-50">
      <Header lastUpdated={lastUpdated} />

      <div className="max-w-md mx-auto px-4 pb-8 space-y-4">
        {/* Error state */}
        {error && <ErrorAlert message={error} onRetry={refresh} />}

        {/* Hero card with next cleaning */}
        {nextCleaning && <HeroCard cleaning={nextCleaning} />}

        {/* Gap alerts section */}
        <GapAlerts alerts={gapAlerts} />

        {/* Upcoming cleanings list */}
        <CleaningsList cleanings={upcomingCleanings} />

        {/* Refresh button */}
        <RefreshButton loading={loading} onRefresh={refresh} />

        {/* Link to past cleanings */}
        {/* <HistoryLink /> */}
      </div>
    </main>
  );
}
