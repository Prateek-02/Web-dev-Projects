import { Heart, Calendar, MapPin, Phone } from 'lucide-react';
import { useState } from 'react';
import '@fontsource/dancing-script';


function App() {
  const [isAccepted, setIsAccepted] = useState(false);

  const handleAccept = () => {
    setIsAccepted(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-yellow-100 flex items-center justify-center p-4 font-['Dancing_Script'] italic relative overflow-hidden">
      <div className="max-w-2xl w-full bg-black rounded-2xl shadow-2xl overflow-hidden transform hover:scale-[1.02] transition-all duration-300 animate-fade-slide-down">
        {/* Top Decorative Border */}
        <div className="h-4 bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-400 animate-sparkle"></div>
        
        {/* Main Content */}
        <div className="p-8 md:p-12 text-center relative">
          {/* Shadow Glitter Overlay */}
          <div className="absolute inset-0 bg-gradient-radial from-amber-400/20 via-transparent to-transparent pointer-events-none animate-pulse-slow"></div>
          
          {/* Header Section */}
          <div className="mb-12 space-y-4">
            <div className="flex justify-center">
              <Heart className="w-14 h-14 text-amber-500 animate-float" />
            </div>
            <h1 className="text-5xl md:text-6xl text-amber-100 font-bold tracking-wide animate-fade-slide-down">
              You are Invited
            </h1>
            <p className="text-2xl text-amber-200 animate-fade-slide-down delay-100">to the</p>
            <h2 className="text-4xl md:text-5xl text-amber-400 font-semibold animate-fade-slide-down delay-200">
              Engagement Ceremony of
            </h2>
          </div>

          {/* Couple Names */}
          <div className="my-12 space-y-4 animate-fade-slide-down delay-300">
            <p className="text-3xl md:text-4xl text-amber-100">
              <span className="font-bold hover:text-amber-400 transition-colors duration-300">Prashu</span>
              <span className="mx-4 animate-pulse">&</span>
              <span className="font-bold hover:text-amber-400 transition-colors duration-300">Swati</span>
            </p>
          </div>

          {/* Details Section */}
          <div className="space-y-6 mb-12">
            <div className="flex items-center justify-center space-x-3 animate-fade-slide-down delay-400 hover:transform hover:scale-105 transition-transform duration-300">
              <Calendar className="w-7 h-7 text-amber-500" />
              <p className="text-2xl text-amber-100">January 27<sup> th</sup>, 2025 | 12:00 PM onwards</p>
            </div>
            
            <div className="flex items-center justify-center space-x-3 animate-fade-slide-down delay-500 hover:transform hover:scale-105 transition-transform duration-300">
              <MapPin className="w-7 h-7 text-amber-500" />
              <p className="text-2xl text-amber-100">Hotel Meer</p>
            </div>
          </div>

          {/* Message & RSVP Section */}
          <div className="space-y-6 mb-12 animate-fade-slide-down delay-500">
            <p className="text-2xl text-amber-200 hover:text-amber-400 transition-colors duration-300">
              &ldquo;We look forward to your gracious presence on this joyous occasion.&rdquo;
            </p>
            <h3 className="text-5xl text-amber-100 font-semibold">&ldquo;We hope to have your blessings and presence&rdquo;</h3>
            <div className="flex items-center justify-center space-x-3 hover:transform hover:scale-105 transition-transform duration-300">
              <Phone className="w-6 h-6 text-amber-500" />
              <p className="text-2xl text-amber-100">+91 9304522319 / 6200153756</p>
            </div>
          </div>

          {/* Accept Button with Thank You Animation */}
          {isAccepted ? (
            <div className="text-amber-400 text-3xl font-semibold animate-bounce">
              Thank You for Accepting! 🎉
            </div>
          ) : (
            <button
              onClick={handleAccept}
              className="bg-amber-500 text-black px-8 py-3 rounded-full flex items-center justify-center mx-auto space-x-2 hover:bg-amber-600 hover:scale-105 transform transition-all duration-300 animate-fade-slide-down delay-500 text-xl"
            >
              <Heart className="w-6 h-6" />
              <span>Accept Invite</span>
            </button>
          )}
        </div>

        {/* Bottom Decorative Border */}
        <div className="h-4 bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-400 animate-sparkle"></div>
      </div>
    </div>
  );
}

export default App;