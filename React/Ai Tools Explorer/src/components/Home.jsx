import ToolList from "./ToolList";
import bgImage from "../assets/Bg_img.jpg";


const Home = () => {
  return (
    <div
    className="min-h-screen bg-cover bg-center bg-no-repeat text-white px-6 py-12"
    style={{ backgroundImage: `url(${bgImage})` }}
    >
        
      {/* Hero Section */}
      <div className="text-center max-w-3xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold">Explore the Best AI Tools</h1>
        <p className="mt-4 text-gray-300">Discover AI-powered tools that enhance productivity, creativity, and efficiency.</p>
      </div>

      {/* AI Tools Section */}
      <ToolList />
    </div>
  );
};

export default Home;
