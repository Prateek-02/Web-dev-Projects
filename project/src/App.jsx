import  { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // Use Routes instead of Switch
import { searchTracks } from './lib/spotify';
import Sidebar from './components/Sidebar';
import Player from './components/Player';
import TrackList from './components/TrackList';
import SearchBar from './components/SearchBar';
import Login from './components/Login';
import SpotifyRedirect from './components/SpotifyRedirect'; // Import the new component
import './App.css';

function App() {
  const [currentTrack, setCurrentTrack] = useState(null);
  const [tracks, setTracks] = useState([]);

  const handleSearch = async (query) => {
    try {
      const trackData = await searchTracks(query);
      setTracks(trackData);
    } catch (error) {
      console.error('Error fetching tracks from Spotify:', error);
    }
  };

  useEffect(() => {
    handleSearch('your default search query');
  }, []); // Empty array ensures the default search query is used only once after initial render

  const handleTrackSelect = (track) => {
    setCurrentTrack(track);
  };

  return (
    <Router>
      <div className="bg-spotify-black min-h-screen text-white">
        <Sidebar />
        <main className="ml-64 pb-24">
          <Routes>
            {/* Login route */}
            <Route path="/login" element={<Login />} />
            {/* Spotify redirect route */}
            <Route path="/spotify-redirect" element={<SpotifyRedirect />} /> {/* Add this route */}
            {/* Default route */}
            <Route 
              path="/" 
              element={<TrackList tracks={tracks} onTrackSelect={handleTrackSelect} />} 
            />
            {/* Search route */}
            <Route 
              path="/search" 
              element={
                <>
                  <SearchBar onSearch={handleSearch} />
                  <TrackList tracks={tracks} onTrackSelect={handleTrackSelect} />
                </>
              } 
            />
            {/* Add other routes as necessary */}
          </Routes>
        </main>
        <Player currentTrack={currentTrack} />
      </div>
    </Router>
  );
}

export default App;
