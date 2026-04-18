const TRACK_URL = 'https://data-entry-beta.netlify.app/api/website-track';

export function track(action: string): void {
  fetch(TRACK_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action }),
    keepalive: true,
  }).catch(() => {});
}
