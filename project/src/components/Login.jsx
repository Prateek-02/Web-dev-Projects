import  { useState, useEffect } from 'react';
import supabase from '../lib/supabase';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);  // Loading state
  const navigate = useNavigate();

  // Add this useEffect to handle the callback when component mounts
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('code')) {
      handleSpotifyCallback();
    }
  }, []);

  // Function to handle Spotify login
  const handleSpotifyLogin = () => {
    window.location.href = 'https://accounts.spotify.com/authorize?response_type=code&client_id=6b9401d497924f6593b7dfd656f986a0&scope=user-read-playback-state user-modify-playback-state streaming app-remote-control&redirect_uri=http://localhost:3000/spotify-callback';
  };

  // Handle the OAuth callback
  const handleSpotifyCallback = async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');

    if (code) {
      try {
        // Exchange the authorization code for an access token
        const response = await fetch('/api/spotify-auth', { // Backend API to exchange the code
          method: 'POST',
          body: JSON.stringify({ code }),
          headers: { 'Content-Type': 'application/json' },
        });

        const data = await response.json();
        if (data.access_token) {
          localStorage.setItem('spotifyAccessToken', data.access_token);
          navigate('/player');  // Redirect to your player page
        } else {
          setError('Failed to get access token from Spotify');
        }
      } catch (error) {
        setError('Error exchanging Spotify authorization code');
        console.error(error);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const { user, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setIsLoading(false);
    if (error) {
      setError(error.message);
    } else {
      console.log('User signed in:', user);
      navigate('/home');  // Redirect after successful login
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-spotify-black text-white">
      <div className="w-full max-w-sm">
        <h2 className="text-2xl font-bold text-center mb-6">Login</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full p-3 rounded bg-gray-800 text-white placeholder-gray-400"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full p-3 rounded bg-gray-800 text-white placeholder-gray-400"
          />
          {error && <p className="text-red-500 text-center">{error}</p>}
          <button 
            type="submit" 
            className="w-full p-3 bg-spotify-green text-black rounded-full hover:scale-105 transition"
            disabled={isLoading}  // Disable the button when loading
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="text-center mt-6">
          <p className="text-sm text-gray-400">Or</p>
          <button 
            onClick={handleSpotifyLogin} 
            className="w-full p-3 bg-spotify-green text-black rounded-full hover:scale-105 transition mt-4"
          >
            Connect to Spotify
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
