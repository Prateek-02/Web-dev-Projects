import { Link } from "react-router-dom";

const Welcome = () => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-blue-500 to-indigo-700 text-white px-4">
      <div className="text-center">
        <h1 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight">
          Welcome to <span className="text-yellow-300">ChatterHub</span>
        </h1>
        <p className="text-lg md:text-xl mb-10 max-w-xl mx-auto">
          Connect, chat, and collaborate in real-time with people around the world.
          Fast. Secure. Simple.
        </p>
        <div className="flex justify-center gap-6">
          <Link
            to="/login"
            className="bg-white text-blue-600 font-semibold px-6 py-3 rounded-lg hover:bg-gray-100 transition"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="bg-yellow-300 text-black font-semibold px-6 py-3 rounded-lg hover:bg-yellow-400 transition"
          >
            Get Started
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
