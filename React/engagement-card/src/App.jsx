import { Heart, Calendar, MapPin, Share2, Phone, Sparkles } from 'lucide-react';

function App() {
  const handleShare = async () => {
    try {
      await navigator.share({
        title: 'Engagement Ceremony Invitation',
        text: "You're invited to the engagement ceremony of Prashu & Swati!",
        url: window.location.href
      });
    } catch (error) {
      console.log('Error sharing:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-pink-100 flex items-center justify-center p-4 font-serif relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(5)].map((_, i) => (
          <Sparkles
            key={i}
            className={`absolute text-pink-300 opacity-50 animate-float w-8 h-8 
              ${i === 0 ? 'top-1/4 left-1/4' : 
                i === 1 ? 'top-1/3 right-1/4' : 
                i === 2 ? 'bottom-1/4 left-1/3' : 
                i === 3 ? 'top-1/2 right-1/3' : 
                'bottom-1/3 left-1/2'}`}
            style={{ animationDelay: `${i * 0.5}s` }}
          />
        ))}
      </div>

      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-2xl overflow-hidden transform hover:scale-[1.02] transition-all duration-300 animate-fade-slide-down">
        {/* Top Decorative Border */}
        <div className="h-4 bg-gradient-to-r from-pink-400 via-rose-300 to-pink-400 animate-sparkle"></div>
        
        {/* Main Content */}
        <div className="p-8 md:p-12 text-center relative">
          {/* Header Section */}
          <div className="mb-12 space-y-4">
            <div className="flex justify-center">
              <Heart className="w-12 h-12 text-pink-500 animate-float" />
            </div>
            <h1 className="text-4xl md:text-5xl text-gray-800 font-bold tracking-wide animate-fade-slide-down">
              You are Invited
            </h1>
            <p className="text-xl text-gray-600 animate-fade-slide-down delay-100">to the</p>
            <h2 className="text-3xl md:text-4xl text-pink-600 font-semibold animate-fade-slide-down delay-200">
              Engagement Ceremony of
            </h2>
          </div>

          {/* Couple Names */}
          <div className="my-12 space-y-4 animate-fade-slide-down delay-300">
            <p className="text-2xl md:text-3xl text-gray-700">
              <span className="font-semibold hover:text-pink-600 transition-colors duration-300">Prashu</span>
              <span className="mx-4 animate-pulse">&</span>
              <span className="font-semibold hover:text-pink-600 transition-colors duration-300">Swati</span>
            </p>
          </div>

          {/* Details Section */}
          <div className="space-y-6 mb-12">
            <div className="flex items-center justify-center space-x-3 animate-fade-slide-down delay-400 hover:transform hover:scale-105 transition-transform duration-300">
              <Calendar className="w-6 h-6 text-pink-500" />
              <p className="text-xl text-gray-700">January 27th, 2025 | 12:00 PM onwards</p>
            </div>
            
            <div className="flex items-center justify-center space-x-3 animate-fade-slide-down delay-500 hover:transform hover:scale-105 transition-transform duration-300">
              <MapPin className="w-6 h-6 text-pink-500" />
              <p className="text-xl text-gray-700">Hotel Meer</p>
            </div>
          </div>

          {/* Message */}
          <p className="text-gray-600 italic mb-12 animate-fade-slide-down delay-500 hover:text-pink-600 transition-colors duration-300">
            "We look forward to your gracious presence on this joyous occasion."
          </p>

          {/* RSVP Section */}
          <div className="space-y-4 mb-8 animate-fade-slide-down delay-500">
            <h3 className="text-2xl text-gray-800 font-semibold">RSVP</h3>
            <div className="flex items-center justify-center space-x-3 hover:transform hover:scale-105 transition-transform duration-300">
              <Phone className="w-5 h-5 text-pink-500" />
              <p className="text-lg text-gray-700">+91 6200153756</p>
            </div>
          </div>

          {/* Share Button */}
          <button
            onClick={handleShare}
            className="bg-pink-500 text-white px-8 py-3 rounded-full flex items-center justify-center mx-auto space-x-2 hover:bg-pink-600 hover:scale-105 transform transition-all duration-300 animate-fade-slide-down delay-500"
          >
            <Share2 className="w-5 h-5" />
            <span>Share This Invite</span>
          </button>
        </div>

        {/* Bottom Decorative Border */}
        <div className="h-4 bg-gradient-to-r from-pink-400 via-rose-300 to-pink-400 animate-sparkle"></div>
      </div>
    </div>
  );
}

export default App;