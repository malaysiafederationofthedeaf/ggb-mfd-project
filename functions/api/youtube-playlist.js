/**
 * Cloudflare Pages Function: /api/youtube-playlist
 *
 * Proxies YouTube Data API v3 playlistItems requests server-side so that:
 *   1. The YouTube API key is never exposed in the browser bundle.
 *   2. CORS is not an issue (server-to-server request).
 *
 * Required Cloudflare Pages environment variable (set in dashboard, NOT prefixed with REACT_APP_):
 *   YOUTUBE_API_KEY          — your YouTube Data API v3 key
 *   YOUTUBE_PLAYLIST_ID      — the featured videos playlist ID
 *
 * Usage from the browser:
 *   GET /api/youtube-playlist
 */
export async function onRequestGet(context) {
  const { env } = context;

  const apiKey = env.YOUTUBE_API_KEY;
  const playlistId = env.YOUTUBE_PLAYLIST_ID;

  if (!apiKey || !playlistId) {
    return new Response(
      JSON.stringify({ error: "Server configuration error: missing YouTube credentials." }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  }

  const youtubeUrl = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=${encodeURIComponent(playlistId)}&key=${apiKey}`;

  try {
    const response = await fetch(youtubeUrl);
    const data = await response.json();

    return new Response(JSON.stringify(data), {
      status: response.status,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        // Cache the response at the edge for 10 minutes to reduce API quota usage
        "Cache-Control": "public, max-age=600",
      },
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ error: "Failed to fetch from YouTube API.", details: err.message }),
      {
        status: 502,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  }
}

/**
 * Handle CORS preflight requests
 */
export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
