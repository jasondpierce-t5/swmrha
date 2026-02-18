import { getShows } from '@/lib/actions/shows';
import type { ShowRow } from '@/types/database';
import ShowEntryForm from './ShowEntryForm';

export default async function EnterShowPage() {
  const result = await getShows();

  if ('error' in result) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="font-heading text-2xl font-bold text-white">
            Enter a Show
          </h1>
          <p className="mt-1 text-sm text-gray-400">
            Register for SWMRHA shows and enter your classes online.
          </p>
        </div>
        <div className="rounded-lg border border-red-700 bg-red-900/30 p-6">
          <p className="text-sm text-red-200">{result.error}</p>
        </div>
      </div>
    );
  }

  const shows: ShowRow[] = result;

  if (shows.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="font-heading text-2xl font-bold text-white">
            Enter a Show
          </h1>
          <p className="mt-1 text-sm text-gray-400">
            Register for SWMRHA shows and enter your classes online.
          </p>
        </div>
        <div className="rounded-lg border border-navy-700 bg-navy-800 p-12 text-center">
          <p className="text-slate-300">
            No shows are currently available. Please check back later.
          </p>
        </div>
      </div>
    );
  }

  return <ShowEntryForm shows={shows} />;
}
