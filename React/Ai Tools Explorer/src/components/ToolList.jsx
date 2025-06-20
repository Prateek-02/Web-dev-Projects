import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

const ToolList = () => {
  const [tools, setTools] = useState([]);
  const [filteredTools, setFilteredTools] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(true); // 🔄 Loading State

  useEffect(() => {
    const fetchTools = async () => {
      try {
        // 🔐 Ensure user is logged in before fetching
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();

        if (sessionError) {
          console.error("Error fetching session:", sessionError);
          setLoading(false);
          return;
        }

        if (!session) {
          console.warn("No session found. Not fetching tools.");
          setLoading(false);
          return;
        }

        // ✅ Fetch tools now
        const { data, error } = await supabase.from("ai_tools").select("*");
        if (error) {
          console.error("Error fetching tools:", error);
        } else {
          setTools(data || []);
          setFilteredTools(data || []);
        }
      } catch (err) {
        console.error("Unexpected error fetching tools:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTools();
  }, []);

  // 🔍 Handle Search & Filtering
  useEffect(() => {
    let filtered = tools;

    if (searchQuery) {
      filtered = filtered.filter((tool) =>
        tool.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedCategory !== "All") {
      filtered = filtered.filter((tool) => tool.category === selectedCategory);
    }

    setFilteredTools(filtered);
  }, [searchQuery, selectedCategory, tools]);

  return (
    <div className="px-20 pb-10 mt-40 mb-0 bg-black shadow-lg">
      <h1 className="text-4xl font-bold text-center text-white hover:text-blue-950 pt-5">
        AI Tools
      </h1>

      {/* 🔍 Search Input */}
      <div className="flex justify-center">
        <input
          type="text"
          placeholder="Search AI Tools..."
          className="w-3xl p-3 rounded-md border border-gray-600 text-white bg-gray-900 mt-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* 🏷️ Category Filters */}
      <div className="flex gap-3 justify-center mt-4">
        {["All", "Writing", "Design", "Audio", "Chatbots", "Coding", "PPT", "Video"].map(
          (category) => (
            <button
              key={category}
              className={`px-4 py-2 rounded-lg ${
                selectedCategory === category
                  ? "bg-blue-500 text-white"
                  : "bg-gray-800 text-gray-300"
              }`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          )
        )}
      </div>

      {/* 🔄 Loading Animation */}
      {loading && (
        <div className="text-center mt-10 text-lg text-gray-400">
          Loading AI Tools...
        </div>
      )}

      {/* 🔽 AI Tools List - Grid with Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12 mt-6">
        {filteredTools.length > 0 ? (
          filteredTools.map((tool) => (
            <div
              key={tool.id}
              className="bg-gray-800 p-6 rounded-lg shadow-lg transition-transform transform hover:scale-105 hover:shadow-xl"
            >
              <h2 className="text-xl font-semibold mt-4 text-center">
                {tool.name}
              </h2>
              <p className="text-gray-400 text-sm text-center">{tool.category}</p>
              <p className="text-gray-300 mt-2 text-sm text-center">
                {tool.description}
              </p>
              <a
                href={tool.website_url}
                target="_blank"
                rel="noopener noreferrer"
                className="block mt-4 bg-blue-500 hover:bg-blue-600 hover:cursor-pointer text-white text-center py-2 rounded-md"
                onClick={() => window.open(tool.website_url, "_blank")}
              >
                Visit Website
              </a>
            </div>
          ))
        ) : (
          !loading && (
            <p className="text-center text-gray-400">No tools found.</p>
          )
        )}
      </div>
    </div>
  );
};

export default ToolList;
