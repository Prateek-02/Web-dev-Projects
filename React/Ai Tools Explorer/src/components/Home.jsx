import { useEffect, useState } from "react";
import ToolList from "./ToolList";
import Bg_img from "../assets/Bg_img.jpg";
import Footer from "./Footer";
import { Avatar, Menu, MenuItem, IconButton } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

const Home = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const open = Boolean(anchorEl);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });
  }, []);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => setAnchorEl(null);

  const handleProfile = () => {
    handleClose();
    navigate("/profile");
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  return (
    <div
    style={{
      backgroundImage: `url(${Bg_img})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      height: "75vh",
    }}
    >
      {/* Header with Profile Icon */}
      <div className="flex justify-end px-6 py-4">
        {user && (
          <>
            <IconButton onClick={handleMenu}>
              <Avatar>{user.email[0]?.toUpperCase()}</Avatar>
            </IconButton>
            <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
              <MenuItem onClick={handleProfile}>Profile</MenuItem>
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
          </>
        )}
      </div>

      {/* Hero Section */}
      <div className="text-center max-w-3xl mx-auto pt-10">
        <h1 className="text-4xl md:text-5xl font-bold text-white">
          Explore the Best AI Tools
        </h1>
        <p className="mt-4 text-amber-100">
          Discover AI-powered tools that enhance productivity, creativity, and efficiency.
        </p>
        <h2 className="text-4xl md:text-5xl font-bold text-white pt-10 hover:text-gray-300">
          Your One Stop for all AI&apos;s
        </h2>
      </div>

      <ToolList />
      <Footer />
    </div>
  );
};

export default Home;
