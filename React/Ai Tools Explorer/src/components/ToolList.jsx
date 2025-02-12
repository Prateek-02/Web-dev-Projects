import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

const ToolList = () => {
  const [tools, setTools] = useState([]);
  const [filteredTools, setFilteredTools] = useState([]); // For search/filter results
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    const fetchTools = async () => {
      const { data, error } = await supabase.from("ai_tools").select("*");
      if (error) console.log("Error fetching tools:", error);
      else {
        console.log("Fetched Tools:", data);
        setTools(data);
        setFilteredTools(data);
      }
    };

    fetchTools();
  }, []);

  // 🔍 Handle Search
  useEffect(() => {
    let filtered = tools;

    if (searchQuery) {
      filtered = filtered.filter(tool =>
        tool.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedCategory !== "All") {
      filtered = filtered.filter(tool => tool.category === selectedCategory);
    }

    setFilteredTools(filtered);
  }, [searchQuery, selectedCategory, tools]);

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-4xl font-bold text-center mb-6">AI Tools</h1>

      {/* 🔍 Search Input */}
      <input
        type="text"
        placeholder="Search AI Tools..."
        className="w-full p-3 rounded-md border border-gray-600 text-white"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      {/* 🏷️ Category Filters */}
      <div className="flex gap-3 justify-center mt-4">
        {["All", "Writing", "Design", "Audio", "Chatbots"].map((category) => (
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
        ))}
      </div>

      {/* 🔽 AI Tools List */}
      <ul className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {filteredTools.length > 0 ? (
          filteredTools.map((tool) => (
            <li
              key={tool.id}
              className="p-4 bg-gray-800 rounded-lg shadow-md"
            >
              <h2 className="text-xl font-semibold">{tool.name}</h2>
              <p className="text-gray-400">{tool.category}</p>
            </li>
          ))
        ) : (
          <p className="text-center text-gray-400">No tools found.</p>
        )}
      </ul>
    </div>
  );
};

export default ToolList;
