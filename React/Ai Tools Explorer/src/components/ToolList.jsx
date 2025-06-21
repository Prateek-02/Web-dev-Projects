import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import {
  Box,
  Typography,
  TextField,
  Chip,
  Card,
  CardContent,
  CardActions,
  Button,
  Grid,
  Container,
  CircularProgress,
  Fade,
  Zoom,
  InputAdornment,
  Paper,
  Skeleton,
  IconButton,
  Tooltip,
  Badge,
  Snackbar,
  Alert,
} from "@mui/material";
import {
  Search as SearchIcon,
  Launch as LaunchIcon,
  Category as CategoryIcon,
  AutoAwesome as AutoAwesomeIcon,
  FilterList as FilterListIcon,
  BookmarkBorder as BookmarkBorderIcon,
  Bookmark as BookmarkIcon,
} from "@mui/icons-material";
import { styled, keyframes } from "@mui/material/styles";

// Animations
const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-8px); }
`;

const glow = keyframes`
  0%, 100% { box-shadow: 0 0 20px rgba(33, 150, 243, 0.3); }
  50% { box-shadow: 0 0 30px rgba(33, 150, 243, 0.6); }
`;

const shimmer = keyframes`
  0% { background-position: -200px 0; }
  100% { background-position: calc(200px + 100%) 0; }
`;

// Styled Components
const StyledContainer = styled(Container)(({ theme }) => ({
  background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)',
  minHeight: '100vh',
  paddingTop: theme.spacing(8),
  paddingBottom: theme.spacing(8),
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '200px',
    background: 'linear-gradient(180deg, rgba(33, 150, 243, 0.1) 0%, transparent 100%)',
    zIndex: 0,
  },
  '& > *': {
    position: 'relative',
    zIndex: 1,
  },
}));

const GlowingTitle = styled(Typography)(({ theme }) => ({
  background: 'linear-gradient(45deg, #2196F3, #21CBF3, #2196F3)',
  backgroundSize: '200% 200%',
  animation: `${shimmer} 3s ease-in-out infinite`,
  backgroundClip: 'text',
  WebkitBackgroundClip: 'text',
  color: 'transparent',
  textShadow: '0 0 30px rgba(33, 150, 243, 0.5)',
  fontWeight: 'bold',
  textAlign: 'center',
  marginBottom: theme.spacing(4),
  transition: 'all 0.3s ease',
  cursor: 'default',
  '&:hover': {
    transform: 'scale(1.02)',
  },
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    background: 'rgba(255, 255, 255, 0.05)',
    backdropFilter: 'blur(10px)',
    borderRadius: '25px',
    transition: 'all 0.3s ease',
    '&:hover': {
      background: 'rgba(255, 255, 255, 0.08)',
      transform: 'translateY(-2px)',
      boxShadow: '0 8px 25px rgba(33, 150, 243, 0.2)',
    },
    '&.Mui-focused': {
      background: 'rgba(255, 255, 255, 0.1)',
      boxShadow: '0 0 20px rgba(33, 150, 243, 0.4)',
    },
    '& fieldset': {
      borderColor: 'rgba(255, 255, 255, 0.2)',
    },
    '&:hover fieldset': {
      borderColor: 'rgba(33, 150, 243, 0.5)',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#2196F3',
    },
  },
  '& .MuiInputBase-input': {
    color: '#fff',
    fontSize: '1.1rem',
  },
  '& .MuiInputLabel-root': {
    color: 'rgba(255, 255, 255, 0.7)',
  },
}));

const CategoryChip = styled(Chip)(({ theme, selected }) => ({
  background: selected 
    ? 'linear-gradient(45deg, #2196F3, #21CBF3)'
    : 'rgba(255, 255, 255, 0.1)',
  color: selected ? '#fff' : 'rgba(255, 255, 255, 0.8)',
  border: selected ? 'none' : '1px solid rgba(255, 255, 255, 0.2)',
  backdropFilter: 'blur(10px)',
  fontWeight: selected ? 'bold' : 'normal',
  transition: 'all 0.3s ease',
  animation: selected ? `${glow} 2s ease-in-out infinite` : 'none',
  '&:hover': {
    transform: 'translateY(-3px) scale(1.05)',
    background: selected 
      ? 'linear-gradient(45deg, #1976D2, #0288D1)'
      : 'rgba(33, 150, 243, 0.2)',
    boxShadow: '0 8px 20px rgba(33, 150, 243, 0.3)',
  },
}));

const ToolCard = styled(Card)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.05)',
  backdropFilter: 'blur(15px)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  borderRadius: '20px',
  transition: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
  animation: `${float} 6s ease-in-out infinite`,
  '&:hover': {
    transform: 'translateY(-10px) scale(1.02)',
    background: 'rgba(255, 255, 255, 0.08)',
    border: '1px solid rgba(33, 150, 243, 0.3)',
    boxShadow: '0 20px 40px rgba(33, 150, 243, 0.2)',
    '& .tool-icon': {
      transform: 'rotate(360deg) scale(1.2)',
    },
  },
  '&:nth-of-type(even)': {
    animationDelay: '1s',
  },
  '&:nth-of-type(3n)': {
    animationDelay: '2s',
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  background: 'linear-gradient(45deg, #2196F3, #21CBF3)',
  borderRadius: '25px',
  textTransform: 'none',
  fontWeight: 'bold',
  padding: '12px 24px',
  transition: 'all 0.3s ease',
  '&:hover': {
    background: 'linear-gradient(45deg, #1976D2, #0288D1)',
    transform: 'translateY(-2px)',
    boxShadow: '0 8px 25px rgba(33, 150, 243, 0.4)',
  },
}));

const LoadingContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: theme.spacing(3),
  marginTop: theme.spacing(8),
  '& .MuiCircularProgress-root': {
    filter: 'drop-shadow(0 0 10px rgba(33, 150, 243, 0.5))',
  },
}));

const FilterContainer = styled(Paper)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.05)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  borderRadius: '20px',
  padding: theme.spacing(3),
  marginBottom: theme.spacing(4),
}));

const ToolList = () => {
  const [tools, setTools] = useState([]);
  const [filteredTools, setFilteredTools] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [showContent, setShowContent] = useState(false);
  const [bookmarks, setBookmarks] = useState(new Set());
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const categories = ["All", "Writing", "Design", "Audio", "Chatbots", "Coding", "PPT", "Video"];

  // ✅ Check session on mount and subscribe to auth changes
  useEffect(() => {
    const initAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.user) {
        setUser(session.user);
      }

      // Subscribe to changes
      const { data: listener } = supabase.auth.onAuthStateChange(
        (event, session) => {
          if (session?.user) {
            setUser(session.user);
          } else {
            setUser(null);
            setTools([]);
            setFilteredTools([]);
          }
        }
      );

      return () => {
        listener.subscription.unsubscribe();
      };
    };

    initAuth();
  }, []);

  // 🔄 Fetch tools once user is confirmed
  useEffect(() => {
    const fetchToolsAndBookmarks = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        // Fetch tools
        const { data: toolsData, error: toolsError } = await supabase
          .from("ai_tools")
          .select("*")
          .order("id", { ascending: true });

        if (toolsError) throw toolsError;
        setTools(toolsData || []);
        
        // Fetch bookmarks
        const { data: bookmarksData, error: bookmarksError } = await supabase
          .from("bookmarks")
          .select("tool_id")
          .eq("user_id", user.id);

        if (bookmarksError) throw bookmarksError;
        setBookmarks(new Set(bookmarksData.map(b => b.tool_id)));

      } catch (error) {
        console.error("Error fetching data:", error.message);
      } finally {
        setLoading(false);
        // Start fade in animation after a short delay
        setTimeout(() => setShowContent(true), 100);
      }
    };

    fetchToolsAndBookmarks();
  }, [user]);

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  const handleBookmarkToggle = async (toolId) => {
    if (!user) {
      setSnackbarMessage("You must be logged in to bookmark tools.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return;
    }

    const isBookmarked = bookmarks.has(toolId);
    const newBookmarks = new Set(bookmarks);

    try {
      if (isBookmarked) {
        // Remove bookmark
        const { error } = await supabase
          .from("bookmarks")
          .delete()
          .match({ user_id: user.id, tool_id: toolId });

        if (error) throw error;
        newBookmarks.delete(toolId);
        setSnackbarMessage("Bookmark removed!");
        setSnackbarSeverity("info");
      } else {
        // Add bookmark
        const { error } = await supabase
          .from("bookmarks")
          .insert({ user_id: user.id, tool_id: toolId });

        if (error) throw error;
        newBookmarks.add(toolId);
        setSnackbarMessage("Added to bookmarks!");
        setSnackbarSeverity("success");
      }
      setBookmarks(newBookmarks);
    } catch (error) {
      console.error("Error toggling bookmark:", error.message);
      setSnackbarMessage("Error updating bookmark.");
      setSnackbarSeverity("error");
    } finally {
      setSnackbarOpen(true);
    }
  };

  // 🔍 Handle filtering and search
  useEffect(() => {
    let filtered = tools;

    if (searchQuery) {
      filtered = filtered.filter((tool) =>
        tool.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedCategory !== "All") {
      filtered = filtered.filter(
        (tool) => tool.category === selectedCategory
      );
    }

    setFilteredTools(filtered);
  }, [searchQuery, selectedCategory, tools]);

  const getCategoryCount = (category) => {
    if (category === "All") return tools.length;
    return tools.filter(tool => tool.category === category).length;
  };

  return (
    <StyledContainer maxWidth="xl">
      <Fade in timeout={1000}>
        <Box>
          <GlowingTitle variant="h2" component="h1">
            <AutoAwesomeIcon sx={{ fontSize: '2rem', mr: 2, verticalAlign: 'middle' }} />
            AI Tools Collection
          </GlowingTitle>
        </Box>
      </Fade>

      <Fade in timeout={1200} style={{ transitionDelay: '200ms' }}>
        <FilterContainer elevation={0}>
          {/* 🔍 Search Input */}
          <Box sx={{ mb: 4 }}>
            <StyledTextField
              fullWidth
              variant="outlined"
              placeholder="Search for AI tools..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: 'rgba(255, 255, 255, 0.5)' }} />
                  </InputAdornment>
                ),
              }}
              sx={{ maxWidth: 600, mx: 'auto', display: 'block' }}
            />
          </Box>

          {/* 🏷️ Category Filters */}
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <FilterListIcon sx={{ color: 'rgba(255, 255, 255, 0.7)', mr: 2 }} />
            <Typography variant="h6" sx={{ color: 'rgba(255, 255, 255, 0.8)', mr: 3 }}>
              Categories:
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', justifyContent: 'center' }}>
            {categories.map((category, index) => (
              <Zoom 
                key={category} 
                in={showContent} 
                timeout={800} 
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <Badge 
                  badgeContent={getCategoryCount(category)} 
                  color="primary"
                  sx={{
                    '& .MuiBadge-badge': {
                      background: 'linear-gradient(45deg, #FF6B6B, #FF8E53)',
                      fontWeight: 'bold',
                    },
                  }}
                >
                  <CategoryChip
                    icon={<CategoryIcon />}
                    label={category}
                    selected={selectedCategory === category}
                    onClick={() => setSelectedCategory(category)}
                    clickable
                  />
                </Badge>
              </Zoom>
            ))}
          </Box>
        </FilterContainer>
      </Fade>

      {/* 🔄 Loading */}
      {loading && (
        <LoadingContainer>
          <CircularProgress size={60} thickness={4} />
          <Typography variant="h6" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
            Loading AI Tools...
          </Typography>
        </LoadingContainer>
      )}

      {/* Loading Skeletons */}
      {loading && (
        <Grid container spacing={4} sx={{ mt: 2 }}>
          {[...Array(6)].map((_, index) => (
            <Grid item xs={12} sm={6} lg={4} key={index}>
              <Skeleton 
                variant="rectangular" 
                height={300} 
                sx={{ 
                  borderRadius: '20px',
                  background: 'rgba(255, 255, 255, 0.05)',
                }} 
              />
            </Grid>
          ))}
        </Grid>
      )}

      {/* 🔽 Tools List */}
      {!loading && (
        <Grid container spacing={4}>
          {filteredTools.length > 0 ? (
            filteredTools.map((tool, index) => (
              <Grid item xs={12} sm={6} lg={4} key={tool.id}>
                <Zoom 
                  in={showContent} 
                  timeout={600} 
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <ToolCard elevation={0}>
                    <CardContent sx={{ position: 'relative' }}>
                      <Tooltip title={bookmarks.has(tool.id) ? "Remove from Bookmarks" : "Add to Bookmarks"}>
                        <IconButton
                          onClick={() => handleBookmarkToggle(tool.id)}
                          sx={{
                            position: 'absolute',
                            top: 8,
                            right: 8,
                            color: bookmarks.has(tool.id) ? 'primary.main' : 'inherit',
                            '&:hover': {
                              backgroundColor: 'rgba(33, 150, 243, 0.1)'
                            }
                          }}
                        >
                          {bookmarks.has(tool.id) ? <BookmarkIcon /> : <BookmarkBorderIcon />}
                        </IconButton>
                      </Tooltip>

                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <AutoAwesomeIcon className="tool-icon" sx={{ color: '#2196F3', mr: 2, transition: 'transform 0.5s ease' }} />
                        <Typography 
                          variant="h5" 
                          component="h2" 
                          sx={{ 
                            color: '#fff', 
                            fontWeight: 'bold',
                            flex: 1,
                          }}
                        >
                          {tool.name}
                        </Typography>
                      </Box>
                      
                      <Chip
                        label={tool.category}
                        size="small"
                        sx={{
                          background: 'rgba(33, 150, 243, 0.2)',
                          color: '#2196F3',
                          border: '1px solid rgba(33, 150, 243, 0.3)',
                          mb: 2,
                        }}
                      />
                      
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          color: 'rgba(255, 255, 255, 0.8)',
                          lineHeight: 1.6,
                          minHeight: '60px',
                        }}
                      >
                        {tool.description}
                      </Typography>
                    </CardContent>
                    
                    <CardActions sx={{ p: 3, pt: 0 }}>
                      <StyledButton
                        fullWidth
                        variant="contained"
                        endIcon={<LaunchIcon />}
                        component="a"
                        href={tool.website_url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Visit Website
                      </StyledButton>
                    </CardActions>
                  </ToolCard>
                </Zoom>
              </Grid>
            ))
          ) : (
            <Grid item xs={12}>
              <Fade in timeout={800}>
                <Box sx={{ textAlign: 'center', py: 8 }}>
                  <AutoAwesomeIcon 
                    sx={{ 
                      fontSize: '4rem', 
                      color: 'rgba(255, 255, 255, 0.3)',
                      mb: 2,
                    }} 
                  />
                  <Typography 
                    variant="h5" 
                    sx={{ 
                      color: 'rgba(255, 255, 255, 0.6)',
                      mb: 1,
                    }}
                  >
                    No tools found
                  </Typography>
                  <Typography 
                    variant="body1" 
                    sx={{ color: 'rgba(255, 255, 255, 0.4)' }}
                  >
                    Try adjusting your search or category filter
                  </Typography>
                </Box>
              </Fade>
            </Grid>
          )}
        </Grid>
      )}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%', boxShadow: 6 }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </StyledContainer>
  );
};

export default ToolList;