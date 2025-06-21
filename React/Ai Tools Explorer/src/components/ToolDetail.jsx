import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Chip,
  Divider,
  Container,
  Grid,
  IconButton,
  Tooltip,
  Fade,
  Zoom,
  Paper,
  Alert,
} from '@mui/material';
import {
  Launch as LaunchIcon,
  BookmarkBorder as BookmarkBorderIcon,
  Bookmark as BookmarkIcon,
  Star,
  RateReview,
  ArrowBack,
} from '@mui/icons-material';
import { styled, keyframes } from '@mui/material/styles';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import Rating from './Rating';
import ReviewDialog from './ReviewDialog';
import ReviewsList from './ReviewsList';
import ThemeToggle from './ThemeToggle';
import { useTheme } from '../contexts/ThemeContext';

// Animations
const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-8px); }
`;

const glow = keyframes`
  0%, 100% { box-shadow: 0 0 20px rgba(33, 150, 243, 0.3); }
  50% { box-shadow: 0 0 30px rgba(33, 150, 243, 0.6); }
`;

// Styled Components
const StyledContainer = styled(Container)(({ theme, darkMode }) => ({
  background: darkMode 
    ? 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)'
    : 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
  minHeight: '100vh',
  paddingTop: theme.spacing(4),
  paddingBottom: theme.spacing(4),
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '200px',
    background: darkMode
      ? 'linear-gradient(180deg, rgba(33, 150, 243, 0.1) 0%, transparent 100%)'
      : 'linear-gradient(180deg, rgba(33, 150, 243, 0.05) 0%, transparent 100%)',
    zIndex: 0,
  },
  '& > *': {
    position: 'relative',
    zIndex: 1,
  },
}));

const ToolCard = styled(Card)(({ theme, darkMode }) => ({
  background: darkMode 
    ? 'rgba(255, 255, 255, 0.05)'
    : 'rgba(255, 255, 255, 0.9)',
  backdropFilter: 'blur(15px)',
  border: darkMode 
    ? '1px solid rgba(255, 255, 255, 0.1)'
    : '1px solid rgba(0, 0, 0, 0.1)',
  borderRadius: '20px',
  transition: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
  animation: `${float} 6s ease-in-out infinite`,
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 20px 40px rgba(33, 150, 243, 0.2)',
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: '25px',
  textTransform: 'none',
  fontWeight: 'bold',
  padding: '12px 24px',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 8px 25px rgba(33, 150, 243, 0.4)',
  },
}));

const ToolDetail = () => {
  const { toolId } = useParams();
  const { darkMode } = useTheme();
  const navigate = useNavigate();
  
  const [tool, setTool] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [bookmarked, setBookmarked] = useState(false);
  const [averageRating, setAverageRating] = useState(0);
  const [reviewCount, setReviewCount] = useState(0);
  const [userReview, setUserReview] = useState(null);
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  useEffect(() => {
    // Get current user
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });
  }, []);

  useEffect(() => {
    if (toolId) {
      fetchToolDetails();
    }
  }, [toolId, user]);

  const fetchToolDetails = async () => {
    setLoading(true);
    try {
      // Fetch tool details
      const { data: toolData, error: toolError } = await supabase
        .from('ai_tools')
        .select('*')
        .eq('id', toolId)
        .single();

      if (toolError) throw toolError;
      setTool(toolData);

      // Fetch average rating and review count
      const { data: ratingData, error: ratingError } = await supabase
        .rpc('get_tool_average_rating', { tool_uuid: toolId });

      const { data: countData, error: countError } = await supabase
        .rpc('get_tool_review_count', { tool_uuid: toolId });

      if (!ratingError) setAverageRating(ratingData || 0);
      if (!countError) setReviewCount(countData || 0);

      // Check if user has bookmarked this tool
      if (user) {
        const { data: bookmarkData } = await supabase
          .from('bookmarks')
          .select('id')
          .eq('user_id', user.id)
          .eq('tool_id', toolId)
          .single();

        setBookmarked(!!bookmarkData);

        // Check if user has reviewed this tool
        const { data: reviewData } = await supabase
          .from('reviews')
          .select('*')
          .eq('user_id', user.id)
          .eq('tool_id', toolId)
          .single();

        setUserReview(reviewData);
      }

    } catch (error) {
      console.error('Error fetching tool details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBookmarkToggle = async () => {
    if (!user) {
      setSnackbarMessage("You must be logged in to bookmark tools.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return;
    }

    try {
      if (bookmarked) {
        // Remove bookmark
        const { error } = await supabase
          .from("bookmarks")
          .delete()
          .match({ user_id: user.id, tool_id: toolId });

        if (error) throw error;
        setBookmarked(false);
        setSnackbarMessage("Bookmark removed!");
        setSnackbarSeverity("info");
      } else {
        // Add bookmark
        const { error } = await supabase
          .from("bookmarks")
          .insert({ user_id: user.id, tool_id: toolId });

        if (error) throw error;
        setBookmarked(true);
        setSnackbarMessage("Added to bookmarks!");
        setSnackbarSeverity("success");
      }
    } catch (error) {
      console.error("Error toggling bookmark:", error.message);
      setSnackbarMessage("Error updating bookmark.");
      setSnackbarSeverity("error");
    } finally {
      setSnackbarOpen(true);
    }
  };

  const handleReviewSubmitted = () => {
    fetchToolDetails(); // Refresh tool details to update ratings
  };

  const handleWriteReview = () => {
    if (!user) {
      setSnackbarMessage("You must be logged in to write a review.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return;
    }
    setReviewDialogOpen(true);
  };

  if (loading) {
    return (
      <StyledContainer maxWidth="lg" darkMode={darkMode}>
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h4" sx={{ color: darkMode ? '#fff' : '#333' }}>
            Loading tool details...
          </Typography>
        </Box>
      </StyledContainer>
    );
  }

  if (!tool) {
    return (
      <StyledContainer maxWidth="lg" darkMode={darkMode}>
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h4" sx={{ color: darkMode ? '#fff' : '#333' }}>
            Tool not found
          </Typography>
          <Button 
            onClick={() => navigate('/home')} 
            variant="contained" 
            sx={{ mt: 2 }}
          >
            Back to Tools
          </Button>
        </Box>
      </StyledContainer>
    );
  }

  return (
    <StyledContainer maxWidth="lg" darkMode={darkMode}>
      {/* Header with back button and theme toggle */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate('/home')}
          variant="outlined"
          sx={{ color: darkMode ? '#fff' : '#333', borderColor: darkMode ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)' }}
        >
          Back to Tools
        </Button>
        <ThemeToggle />
      </Box>

      <Grid container spacing={4}>
        {/* Tool Details Card */}
        <Grid item xs={12} lg={8}>
          <Fade in timeout={800}>
            <ToolCard darkMode={darkMode}>
              <CardContent sx={{ p: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
                  <Box sx={{ flex: 1 }}>
                    <Typography 
                      variant="h3" 
                      component="h1" 
                      sx={{ 
                        fontWeight: 'bold',
                        color: darkMode ? '#fff' : '#333',
                        mb: 2,
                      }}
                    >
                      {tool.name}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                      <Rating 
                        value={averageRating} 
                        readOnly 
                        showCount 
                        reviewCount={reviewCount}
                      />
                      <Chip 
                        label={tool.category} 
                        color="primary" 
                        variant="outlined"
                      />
                    </Box>
                  </Box>
                  
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Tooltip title={bookmarked ? "Remove from Bookmarks" : "Add to Bookmarks"}>
                      <IconButton
                        onClick={handleBookmarkToggle}
                        sx={{ 
                          color: bookmarked ? 'primary.main' : 'inherit',
                          '&:hover': {
                            backgroundColor: 'rgba(33, 150, 243, 0.1)'
                          }
                        }}
                      >
                        {bookmarked ? <BookmarkIcon /> : <BookmarkBorderIcon />}
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Box>

                <Typography 
                  variant="body1" 
                  sx={{ 
                    color: darkMode ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.8)',
                    lineHeight: 1.8,
                    mb: 4,
                    fontSize: '1.1rem',
                  }}
                >
                  {tool.description}
                </Typography>

                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  <StyledButton
                    variant="contained"
                    startIcon={<LaunchIcon />}
                    component="a"
                    href={tool.website_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{
                      background: 'linear-gradient(45deg, #2196F3, #21CBF3)',
                      '&:hover': {
                        background: 'linear-gradient(45deg, #1976D2, #0288D1)',
                      },
                    }}
                  >
                    Visit Website
                  </StyledButton>
                  
                  <StyledButton
                    variant="outlined"
                    startIcon={<RateReview />}
                    onClick={handleWriteReview}
                    sx={{
                      borderColor: darkMode ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)',
                      color: darkMode ? '#fff' : '#333',
                    }}
                  >
                    {userReview ? 'Edit Review' : 'Write Review'}
                  </StyledButton>
                </Box>
              </CardContent>
            </ToolCard>
          </Fade>
        </Grid>

        {/* Reviews Section */}
        <Grid item xs={12} lg={4}>
          <Fade in timeout={1000} style={{ transitionDelay: '200ms' }}>
            <Paper 
              sx={{ 
                p: 3, 
                borderRadius: 3,
                background: darkMode 
                  ? 'rgba(255, 255, 255, 0.05)'
                  : 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(10px)',
                border: darkMode 
                  ? '1px solid rgba(255, 255, 255, 0.1)'
                  : '1px solid rgba(0, 0, 0, 0.1)',
              }}
            >
              <Typography 
                variant="h5" 
                sx={{ 
                  fontWeight: 'bold',
                  color: darkMode ? '#fff' : '#333',
                  mb: 2,
                }}
              >
                Reviews ({reviewCount})
              </Typography>
              
              <ReviewsList 
                toolId={toolId} 
                toolName={tool.name}
                onReviewUpdate={handleReviewSubmitted}
              />
            </Paper>
          </Fade>
        </Grid>
      </Grid>

      {/* Review Dialog */}
      <ReviewDialog
        open={reviewDialogOpen}
        onClose={() => setReviewDialogOpen(false)}
        tool={tool}
        existingReview={userReview}
        onReviewSubmitted={handleReviewSubmitted}
      />

      {/* Snackbar for notifications */}
      {snackbarOpen && (
        <Alert 
          severity={snackbarSeverity} 
          sx={{ 
            position: 'fixed', 
            bottom: 20, 
            right: 20, 
            zIndex: 9999,
            minWidth: 300,
          }}
          onClose={() => setSnackbarOpen(false)}
        >
          {snackbarMessage}
        </Alert>
      )}
    </StyledContainer>
  );
};

export default ToolDetail; 