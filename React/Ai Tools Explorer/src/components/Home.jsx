import { useEffect, useState } from "react";
import ToolList from "./ToolList";
import Bg_img from "../assets/Bg_img.jpg";
import Footer from "./Footer";
import ThemeToggle from "./ThemeToggle";
import { 
  Avatar, 
  Menu, 
  MenuItem, 
  IconButton, 
  Box, 
  Typography, 
  Container, 
  Fade, 
  Zoom, 
  Chip,
  Paper,
} from "@mui/material";
import { styled, keyframes } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient.js";
import { Bookmarks as BookmarksIcon, TrendingUp as TrendingUpIcon } from "@mui/icons-material";

// Animations
const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
`;

const glow = keyframes`
  0%, 100% { box-shadow: 0 0 20px rgba(255, 193, 7, 0.3); }
  50% { box-shadow: 0 0 30px rgba(255, 193, 7, 0.6); }
`;

const shimmer = keyframes`
  0% { background-position: -200px 0; }
  100% { background-position: calc(200px + 100%) 0; }
`;

// Styled Components
const HeroContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  minHeight: '75vh',
  backgroundImage: `url(${Bg_img})`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundAttachment: 'fixed',
  display: 'flex',
  flexDirection: 'column',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(135deg, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.2) 100%)',
    zIndex: 1,
  },
  '& > *': {
    position: 'relative',
    zIndex: 2,
  },
}));

const StyledAvatar = styled(Avatar)(({ theme }) => ({
  border: '3px solid rgba(255, 255, 255, 0.8)',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'scale(1.1)',
    border: '3px solid #fff',
    boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
  },
}));

const GlowingChip = styled(Chip)(({ theme }) => ({
  background: 'linear-gradient(45deg, rgba(255, 193, 7, 0.9), rgba(255, 235, 59, 0.9))',
  color: '#1a1a1a',
  fontWeight: 'bold',
  animation: `${glow} 3s ease-in-out infinite`,
  '&:hover': {
    transform: 'scale(1.05)',
    transition: 'transform 0.2s ease',
  },
}));

const ShimmerText = styled(Typography)(({ theme }) => ({
  background: 'linear-gradient(90deg, #fff 0%, #ffd700 50%, #fff 100%)',
  backgroundSize: '200px 100%',
  backgroundClip: 'text',
  WebkitBackgroundClip: 'text',
  color: 'transparent',
  animation: `${shimmer} 2s infinite linear`,
  textShadow: '0 0 20px rgba(255, 255, 255, 0.5)',
}));

const FloatingPaper = styled(Paper)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.1)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  borderRadius: '20px',
  padding: theme.spacing(3),
  animation: `${float} 6s ease-in-out infinite`,
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-5px) scale(1.02)',
    background: 'rgba(255, 255, 255, 0.15)',
    boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
  },
}));

const HeaderContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: theme.spacing(2, 3),
  background: 'rgba(0, 0, 0, 0.2)',
  backdropFilter: 'blur(5px)',
}));

const StyledMenu = styled(Menu)(({ theme }) => ({
  '& .MuiPaper-root': {
    background: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(10px)',
    borderRadius: '12px',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
  },
  '& .MuiMenuItem-root': {
    borderRadius: '8px',
    margin: '4px 8px',
    transition: 'all 0.2s ease',
    '&:hover': {
      background: 'linear-gradient(45deg, rgba(255, 193, 7, 0.1), rgba(255, 235, 59, 0.1))',
      transform: 'translateX(4px)',
    },
  },
}));

const Home = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [user, setUser] = useState(null);
  const [showContent, setShowContent] = useState(false);
  const navigate = useNavigate();
  const open = Boolean(anchorEl);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: authData } = await supabase.auth.getUser();
      const user = authData?.user;
      if (user) {
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("name")
          .eq("id", user.id)
          .single();

        if (profileError) {
          console.error("Error fetching profile:", profileError);
          setUser(user); // fallback
        } else {
          setUser({
            ...user,
            name: profileData?.name || null,
          });
        }
      }
    };

    fetchUser();

    const timer = setTimeout(() => setShowContent(true), 300);
    return () => clearTimeout(timer);
  }, []);

  const handleMenu = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleProfile = () => { handleClose(); navigate("/profile"); };
  const handleBookmarks = () => { handleClose(); navigate("/bookmarks"); };
  const handleActivity = () => { handleClose(); navigate("/activity"); };
  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  return (
    <HeroContainer>
      {/* Header */}
      <HeaderContainer>
        <Fade in={true} timeout={800}>
          <Box>
            <ThemeToggle />
          </Box>
        </Fade>

        {user && (
          <Fade in={!!user} timeout={800}>
            <Box>
              <IconButton onClick={handleMenu} sx={{ padding: 1, '&:hover': { background: 'rgba(255, 255, 255, 0.1)' } }}>
                <StyledAvatar>
                  {user.name ? user.name[0]?.toUpperCase() : user.email[0]?.toUpperCase()}
                </StyledAvatar>
              </IconButton>
              <StyledMenu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
              >
                <MenuItem onClick={handleBookmarks}>
                  <BookmarksIcon sx={{ mr: 1, color: '#000' }} />
                  <Typography variant="body1" fontWeight="medium" sx={{ color: '#000' }}>
                    My Bookmarks
                  </Typography>
                </MenuItem>
                <MenuItem onClick={handleActivity}>
                  <TrendingUpIcon sx={{ mr: 1, color: '#000' }} />
                  <Typography variant="body1" fontWeight="medium" sx={{ color: '#000' }}>
                    My Activity
                  </Typography>
                </MenuItem>
                <MenuItem onClick={handleProfile}>
                  <Typography variant="body1" fontWeight="medium" sx={{ color: '#000' }}>
                    Profile
                  </Typography>
                </MenuItem>
                <MenuItem onClick={handleLogout}>
                  <Typography variant="body1" fontWeight="medium" sx={{ color: '#000' }}>
                    Logout
                  </Typography>
                </MenuItem>
              </StyledMenu>
            </Box>
          </Fade>
        )}
      </HeaderContainer>

      {/* Hero Content */}
      <Container maxWidth="lg" sx={{ flex: 1, display: 'flex', alignItems: 'center' }}>
        <Box sx={{ width: '100%', textAlign: 'center', py: 6 }}>
          <Zoom in={showContent} timeout={1000}>
            <FloatingPaper elevation={0} sx={{ mb: 4, mx: 'auto', maxWidth: '800px' }}>
              <Box sx={{ mb: 2 }}>
                <GlowingChip label="✨ AI-Powered Excellence" size="medium" sx={{ mb: 3 }} />
              </Box>
              <ShimmerText
                variant="h2"
                component="h1"
                sx={{
                  fontWeight: 'bold',
                  fontSize: { xs: '2.5rem', md: '3.5rem' },
                  mb: 3,
                  lineHeight: 1.2,
                }}
              >
                Explore the Best AI Tools
              </ShimmerText>
              <Typography
                variant="h6"
                sx={{
                  color: 'rgba(255, 255, 255, 0.9)',
                  mb: 4,
                  fontWeight: 300,
                  lineHeight: 1.6,
                }}
              >
                Discover AI-powered tools that enhance productivity, creativity, and efficiency.
                Transform your workflow with cutting-edge artificial intelligence.
              </Typography>
            </FloatingPaper>
          </Zoom>

          <Fade in={showContent} timeout={1500} style={{ transitionDelay: '500ms' }}>
            <Box>
              <Typography
                variant="h3"
                component="h2"
                sx={{
                  fontWeight: 'bold',
                  fontSize: { xs: '2rem', md: '3rem' },
                  color: '#fff',
                  textShadow: '2px 2px 8px rgba(0,0,0,0.5)',
                  transition: 'all 0.3s ease',
                  cursor: 'default',
                  '&:hover': {
                    color: '#f5f5f5',
                    textShadow: '2px 2px 12px rgba(0,0,0,0.7)',
                    transform: 'translateY(-2px)',
                  },
                }}
              >
                Your One Stop for all AI&apos;s
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 3 }}>
                {['Productivity', 'Creativity', 'Innovation'].map((tag, index) => (
                  <Fade
                    key={tag}
                    in={showContent}
                    timeout={1000}
                    style={{ transitionDelay: `${800 + index * 200}ms` }}
                  >
                    <Chip
                      label={tag}
                      variant="outlined"
                      sx={{
                        color: '#fff',
                        borderColor: 'rgba(255, 255, 255, 0.5)',
                        background: 'rgba(255, 255, 255, 0.1)',
                        backdropFilter: 'blur(5px)',
                        '&:hover': {
                          borderColor: '#ffd700',
                          background: 'rgba(255, 215, 0, 0.2)',
                          transform: 'translateY(-2px)',
                        },
                        transition: 'all 0.3s ease',
                      }}
                    />
                  </Fade>
                ))}
              </Box>
            </Box>
          </Fade>
        </Box>
      </Container>

      <ToolList />
      <Footer />
    </HeroContainer>
  );
};

export default Home;
