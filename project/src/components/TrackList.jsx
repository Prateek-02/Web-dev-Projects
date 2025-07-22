import PropTypes from 'prop-types';

const TrackList = ({ tracks, onTrackSelect }) => {
  return (
    <div className="flex flex-col space-y-4">
      {tracks.map((track) => (
        <div 
          key={track.id} 
          className="flex items-center cursor-pointer hover:bg-spotify-dark-gray p-4 rounded"
          onClick={() => onTrackSelect(track)} // Trigger track selection
        >
          <img 
            src={track.albumArt} 
            alt={track.name} 
            className="w-16 h-16 rounded"
          />
          <div className="ml-4">
            <h3 className="text-white font-medium">{track.name}</h3>
            <p className="text-gray-400">{track.artist}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

TrackList.propTypes = {
  tracks: PropTypes.arrayOf(PropTypes.object).isRequired,
  onTrackSelect: PropTypes.func.isRequired
};

export default TrackList;
