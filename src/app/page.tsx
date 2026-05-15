'use client';

import { useMemo } from 'react';
import { useCalendar } from '@/hooks/useCalendar';
import { getGapAlerts } from '@/lib/utils';
import {
  LoadingSpinner,
  ErrorAlert,
  WarningBanner,
  Header,
  HeroCard,
  GapAlerts,
  CleaningsList,
  RefreshButton,
  HistoryLink,
} from '@/components';

export default function Home() {
  const { cleanings, loading, error, warnings, lastUpdated, refresh } =
    useCalendar();

  const listingLabels = useMemo(() => {
    const labels = new Set<string>();
    cleanings.forEach((c) => labels.add(c.listingLabel));
    return [...labels];
  }, [cleanings]);

  const nextCleaning = cleanings[0] ?? null;
  const upcomingCleanings = cleanings.slice(1, 11);
  const gapAlerts = getGapAlerts(cleanings);

  if (loading && cleanings.length === 0) {
    return <LoadingSpinner />;
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-cyan-50 to-teal-50">
      <Header lastUpdated={lastUpdated} listingLabels={listingLabels} />

      <div className="mx-auto max-w-md space-y-4 px-4 pb-8">
        {error && <ErrorAlert message={error} onRetry={refresh} />}

        {!error && warnings.length > 0 && (
          <WarningBanner messages={warnings} />
        )}

        {nextCleaning && <HeroCard cleaning={nextCleaning} />}

        <GapAlerts alerts={gapAlerts} />

        <CleaningsList cleanings={upcomingCleanings} />

        <RefreshButton loading={loading} onRefresh={refresh} />

        <HistoryLink />
      </div>
    </main>
  );
}
