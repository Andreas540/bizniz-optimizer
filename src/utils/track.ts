const TRACK_URL = 'https://data-entry-beta.netlify.app/api/website-track';

export function track(action: string): void {
  const body = JSON.stringify({ action });
  if (navigator.sendBeacon) {
    navigator.sendBeacon(TRACK_URL, new Blob([body], { type: 'application/json' }));
  } else {
    fetch(TRACK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
    }).catch(() => {});
  }
}
