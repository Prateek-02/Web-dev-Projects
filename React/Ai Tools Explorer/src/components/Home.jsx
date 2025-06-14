import ToolList from "./ToolList";
import Bg_img from "../assets/Bg_img.jpg";
import Footer from "./Footer";

const Home = () => {
  return (
    <div
      style={{
        backgroundImage: `url(${Bg_img})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        height: "70vh",
      }}
    >
      {/* Hero Section */}
      <div className="text-center max-w-3xl mx-auto pt-16">
        <h1 className="text-4xl md:text-5xl font-bold text-white">
          Explore the Best AI Tools
        </h1>
        <p className="mt-4 text-amber-100">
          Discover AI-powered tools that enhance productivity, creativity, and
          efficiency.
        </p>
        <h2 className="text-4xl md:text-5xl font-bold text-white pt-10 hover:text-gray-300">
          Your One Stop for all AI&apos;s
        </h2>
      </div>

      {/* AI Tools Section */}
      <ToolList />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Home;
