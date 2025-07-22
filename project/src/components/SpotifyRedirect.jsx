import  { useEffect } from 'react';

const SpotifyRedirect = () => {
  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const code = queryParams.get('code');
    
    if (code) {
      // Step 2: Exchange code for access token
      fetchAccessToken(code);
    }
  }, []);

  const fetchAccessToken = async (code) => {
    const client_id = '6b9401d497924f6593b7dfd656f986a0';
    const client_secret = import.meta.env.VITE_CLIENT_SECRET  // Keep this private on the backend
    const redirect_uri = 'http://localhost:3000/spotify-redirect';

    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        code,
        redirect_uri,
        grant_type: 'authorization_code',
        client_id,
        client_secret,
      }),
    });

    const data = await response.json();
    
    if (data.access_token) {
      // Store the access token in localStorage and redirect to home page
      localStorage.setItem('spotify_access_token', data.access_token);
      window.location.href = '/';  // Redirect to your app's main page
    } else {
      console.error('Error fetching access token:', data);
    }
  };

  return <div>Redirecting...</div>;
};

export default SpotifyRedirect;
