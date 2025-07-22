const CLIENT_ID = '6b9401d497924f6593b7dfd656f986a0';
const CLIENT_SECRET = import.meta.env.VITE_CLIENT_SECRET;

// Get Spotify access token (Client Credentials Flow)
async function getAccessToken() {
  try {
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + btoa(CLIENT_ID + ':' + CLIENT_SECRET),
      },
      body: 'grant_type=client_credentials',
    });

    if (!response.ok) {
      throw new Error(`Failed to get access token: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data.access_token;
  } catch (error) {
    console.error('Error fetching access token:', error);
    return null;
  }
}

// Search tracks (using the access token)
export async function searchTracks(query) {
  try {
    const token = await getAccessToken();
    if (!token) throw new Error('Failed to fetch token');

    const response = await fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=10`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to search tracks: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data.tracks.items.map((track) => ({
      id: track.id,
      name: track.name,
      artist: track.artists[0].name,
      albumArt: track.album.images[0]?.url || 'default_album_art_url_here',
      duration: msToMinutesAndSeconds(track.duration_ms),
      previewUrl: track.preview_url || null,
    }));
  } catch (error) {
    console.error('Error searching tracks:', error);
    return [];
  }
}

// Get featured playlists (using the access token)
export async function getFeaturedPlaylists() {
  try {
    const token = await getAccessToken();
    if (!token) throw new Error('Failed to fetch token');

    const response = await fetch('https://api.spotify.com/v1/browse/featured-playlists?limit=5', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to get featured playlists: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data.playlists.items;
  } catch (error) {
    console.error('Error fetching featured playlists:', error);
    return [];
  }
}

// Helper function to convert milliseconds to minutes:seconds format
function msToMinutesAndSeconds(ms) {
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000).toString().padStart(2, '0');
  return `${minutes}:${seconds}`;
}
