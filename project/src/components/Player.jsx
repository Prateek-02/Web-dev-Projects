import  { useState, useEffect, useRef } from 'react';
import { FaPlay, FaPause, FaStepForward, FaStepBackward, FaVolumeMute, FaVolumeUp } from 'react-icons/fa';
import PropTypes from 'prop-types';

const Player = ({ currentTrack, accessToken }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [deviceId, setDeviceId] = useState(null);
  const [playerState, setPlayerState] = useState('initializing');
  const player = useRef(null);

  useEffect(() => {
    if (!accessToken) {
      console.log('No access token available');
      return;
    }

    let spotifyPlayer = null;

    const script = document.createElement('script');
    script.src = 'https://sdk.scdn.co/spotify-player.js';
    script.async = true;

    window.onSpotifyWebPlaybackSDKReady = () => {
      console.log('Spotify SDK Ready');
      setPlayerState('sdk_ready');
      
      spotifyPlayer = new window.Spotify.Player({
        name: "Web Playback SDK",
        getOAuthToken: cb => { 
          console.log('Getting OAuth token');
          cb(accessToken);
        },
        volume: 0.5
      });

      spotifyPlayer.addListener('initialization_error', ({ message }) => {
        console.error('Failed to initialize:', message);
        setPlayerState('initialization_error');
      });

      spotifyPlayer.addListener('authentication_error', ({ message }) => {
        console.error('Failed to authenticate:', message);
        setPlayerState('authentication_error');
      });

      spotifyPlayer.addListener('account_error', ({ message }) => {
        console.error('Failed to validate Spotify account:', message);
        setPlayerState('account_error');
      });

      spotifyPlayer.addListener('playback_error', ({ message }) => {
        console.error('Failed to perform playback:', message);
        setPlayerState('playback_error');
      });

      spotifyPlayer.addListener('player_state_changed', state => {
        console.log('Player State Changed:', state);
        if (state) {
          setIsPlaying(!state.paused);
        }
      });

      spotifyPlayer.addListener('ready', ({ device_id }) => {
        console.log('Ready with Device ID', device_id);
        setDeviceId(device_id);
        setPlayerState('ready');
        player.current = spotifyPlayer;
        
        // Transfer playback to this device
        fetch('https://api.spotify.com/v1/me/player', {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            device_ids: [device_id],
            play: false,
          }),
        })
        .then(response => {
          if (!response.ok && response.status !== 204) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          console.log('Transferred playback to current device');
          setPlayerState('transfer_success');
        })
        .catch(error => {
          console.error('Error transferring playback:', error);
          setPlayerState('transfer_error');
        });
      });

      spotifyPlayer.addListener('not_ready', ({ device_id }) => {
        console.log('Device ID has gone offline', device_id);
        setPlayerState('not_ready');
      });

      console.log('Connecting to Spotify...');
      spotifyPlayer.connect().then(success => {
        if (success) {
          console.log('Successfully connected to Spotify!');
          setPlayerState('connected');
        } else {
          console.error('Failed to connect to Spotify');
          setPlayerState('connection_failed');
        }
      });
    };

    document.body.appendChild(script);

    return () => {
      if (spotifyPlayer) {
        console.log('Disconnecting Spotify player');
        spotifyPlayer.disconnect();
      }
      if (script.parentNode) {
        document.body.removeChild(script);
      }
    };
  }, [accessToken]);

  useEffect(() => {
    if (!currentTrack?.uri || !player.current || !deviceId) {
      console.log('Playback prerequisites not met:', {
        hasTrack: !!currentTrack?.uri,
        hasPlayer: !!player.current,
        hasDeviceId: !!deviceId
      });
      return;
    }

    console.log('Attempting to play track:', currentTrack.uri);
    
    // Start playback using the Spotify Web API
    fetch(`https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        uris: [currentTrack.uri],
      }),
    })
    .then(response => {
      if (!response.ok) {
        return response.json().then(err => {
          console.error('Playback API Error:', err);
          throw err;
        });
      }
      setIsPlaying(true);
      console.log('Started playback successfully');
    })
    .catch(error => {
      console.error('Error starting playback:', error);
      setIsPlaying(false);
    });
  }, [currentTrack, deviceId, accessToken]);

  const togglePlay = () => {
    if (!player.current) return;

    player.current.togglePlay().then(() => {
      setIsPlaying(!isPlaying);
    }).catch(error => {
      console.error('Error toggling playback:', error);
    });
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (player.current) {
      player.current.setVolume(newVolume);
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-spotify-gray p-4">
      <div className="max-w-screen-xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {currentTrack && (
            <>
              <img 
                src={currentTrack.album?.images[0]?.url ? currentTrack.album.images[0].url : ''} 
                alt={currentTrack.name} 
                className="w-16 h-16 rounded"
              />
              <div>
                <h3 className="text-white font-medium">{currentTrack.name}</h3>
                <p className="text-gray-400">{currentTrack.artists?.map(artist => artist.name).join(', ')}</p>
                <p className="text-xs text-gray-500">{playerState}</p>
              </div>
            </>
          )}
        </div>
        <div className="flex items-center space-x-6">
          <button 
            className="text-white hover:text-spotify-green"
            onClick={() => player.current.previousTrack()}
          >
            <FaStepBackward size={20} />
          </button>
          <button 
            className="bg-spotify-green text-black rounded-full p-2 hover:scale-105 transition"
            onClick={togglePlay}
            disabled={!currentTrack?.uri}
          >
            {isPlaying ? <FaPause size={24} /> : <FaPlay size={24} />}
          </button>
          <button 
            className="text-white hover:text-spotify-green"
            onClick={() => player.current.nextTrack()}
          >
            <FaStepForward size={20} />
          </button>
        </div>
        <div className="flex items-center space-x-2 w-1/4">
          <button onClick={() => setVolume(volume === 0 ? 1 : 0)}>
            {volume === 0 ? <FaVolumeMute className="text-white" /> : <FaVolumeUp className="text-white" />}
          </button>
          <input 
            type="range" 
            min="0" 
            max="1" 
            step="0.01"
            value={volume}
            onChange={handleVolumeChange}
            className="w-full accent-spotify-green"
          />
        </div>
      </div>
    </div>
  );
};

Player.propTypes = {
  currentTrack: PropTypes.object,
  accessToken: PropTypes.string.isRequired
};

export default Player;