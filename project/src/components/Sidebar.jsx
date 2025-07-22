import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import { FaHome, FaSearch, FaHeart } from 'react-icons/fa';

const Sidebar = () => {
  return (
    <div className="bg-black w-64 h-screen fixed left-0 top-0 p-6">
      <div className="text-2xl font-bold text-white mb-8">Spotify Player</div>
      
      <nav className="space-y-4">
        <Link to="/" className="flex items-center space-x-3 text-gray-400 hover:text-white">
          <FaHome />
          <span>Home</span>
        </Link>
        <Link to="/search" className="flex items-center space-x-3 text-gray-400 hover:text-white">
          <FaSearch />
          <span>Search</span>
        </Link>
        <a href="#" className="flex items-center space-x-3 text-gray-400 hover:text-white">
          <FaHeart />
          <span>Liked Songs</span>
        </a>
      </nav>
      
      <div className="mt-8 pt-8 border-t border-gray-800">
        <h3 className="text-gray-400 uppercase text-sm font-bold mb-4">Playlists</h3>
        <ul className="space-y-2">
          <li className="text-gray-400 hover:text-white cursor-pointer">My Playlist #1</li>
          <li className="text-gray-400 hover:text-white cursor-pointer">Favorites</li>
          <li className="text-gray-400 hover:text-white cursor-pointer">Discover Weekly</li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
