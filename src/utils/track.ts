const TRACK_URL = 'https://data-entry-beta.netlify.app/api/website-track';
const TRACK_KEY = import.meta.env.VITE_TRACK_KEY as string;

export function track(action: string): void {
  fetch(TRACK_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Track-Key': TRACK_KEY },
    body: JSON.stringify({ action }),
  }).catch(() => {});
}
