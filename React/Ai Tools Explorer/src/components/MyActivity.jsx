import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Container,
  Chip,
  Avatar,
  IconButton,
  Button,
  Divider,
  Skeleton,
  Alert,
  Paper,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  Tabs,
  Tab,
  Fade,
  Zoom,
} from '@mui/material';
import {
  Visibility,
  Bookmark,
  RateReview,
  Launch,
  TrendingUp,
  History,
  Star,
  Category,
  CalendarToday,
  AutoAwesome,
  ArrowForward,
  Refresh,
} from '@mui/icons-material';
import { styled, keyframes } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { analyticsService } from '../services/analyticsService';
import Rating from './Rating';
import ThemeToggle from './ThemeToggle';
import { useTheme } from '../contexts/ThemeContext';

// Animations
const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-8px); }
`;

const pulse = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
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

const StatsCard = styled(Card)(({ theme, darkMode }) => ({
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

const ActivityCard = styled(Card)(({ theme, darkMode }) => ({
  background: darkMode 
    ? 'rgba(255, 255, 255, 0.05)'
    : 'rgba(255, 255, 255, 0.9)',
  backdropFilter: 'blur(10px)',
  border: darkMode 
    ? '1px solid rgba(255, 255, 255, 0.1)'
    : '1px solid rgba(0, 0, 0, 0.1)',
  borderRadius: '15px',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 8px 25px rgba(33, 150, 243, 0.15)',
  },
}));

const MyActivity = () => {
  const { darkMode } = useTheme();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const [activitySummary, setActivitySummary] = useState(null);
  const [activityHistory, setActivityHistory] = useState([]);
  const [mostViewedCategories, setMostViewedCategories] = useState([]);
  const [dailyActivity, setDailyActivity] = useState([]);

  useEffect(() => {
    fetchActivityData();
  }, []);

  const fetchActivityData = async () => {
    setLoading(true);
    try {
      const [
        recentlyViewedData,
        summaryData,
        historyData,
        categoriesData,
        dailyData
      ] = await Promise.all([
        analyticsService.getRecentlyViewedTools(10),
        analyticsService.getUserActivitySummary(30),
        analyticsService.getActivityHistory(30, 20),
        analyticsService.getMostViewedCategories(30, 5),
        analyticsService.getActivityByDay(7)
      ]);

      setRecentlyViewed(recentlyViewedData);
      setActivitySummary(summaryData);
      setActivityHistory(historyData);
      setMostViewedCategories(categoriesData);
      setDailyActivity(dailyData);
    } catch (error) {
      console.error('Error fetching activity data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleToolClick = (toolId) => {
    navigate(`/tool/${toolId}`);
  };

  const getActivityIcon = (activityType) => {
    switch (activityType) {
      case 'view': return <Visibility />;
      case 'bookmark': return <Bookmark />;
      case 'review': return <RateReview />;
      case 'visit_website': return <Launch />;
      case 'click': return <TrendingUp />;
      default: return <AutoAwesome />;
    }
  };

  const getActivityColor = (activityType) => {
    switch (activityType) {
      case 'view': return '#2196F3';
      case 'bookmark': return '#FF9800';
      case 'review': return '#4CAF50';
      case 'visit_website': return '#9C27B0';
      case 'click': return '#FF5722';
      default: return '#607D8B';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatRelativeTime = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return formatDate(dateString);
  };

  if (loading) {
    return (
      <StyledContainer maxWidth="lg" darkMode={darkMode}>
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Skeleton variant="rectangular" height={400} sx={{ borderRadius: 3, mb: 2 }} />
          <Skeleton variant="text" width="60%" sx={{ mx: 'auto' }} />
        </Box>
      </StyledContainer>
    );
  }

  return (
    <StyledContainer maxWidth="lg" darkMode={darkMode}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography 
          variant="h3" 
          sx={{ 
            fontWeight: 'bold',
            color: darkMode ? '#fff' : '#333',
          }}
        >
          My Activity
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            startIcon={<Refresh />}
            onClick={fetchActivityData}
            variant="outlined"
            sx={{ 
              color: darkMode ? '#fff' : '#333',
              borderColor: darkMode ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)'
            }}
          >
            Refresh
          </Button>
          <ThemeToggle />
        </Box>
      </Box>

      {/* Activity Summary Cards */}
      {activitySummary && (
        <Fade in timeout={800}>
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={3}>
              <StatsCard darkMode={darkMode}>
                <CardContent sx={{ textAlign: 'center', p: 3 }}>
                  <Visibility sx={{ fontSize: 40, color: '#2196F3', mb: 1 }} />
                  <Typography variant="h4" sx={{ fontWeight: 'bold', color: darkMode ? '#fff' : '#333' }}>
                    {activitySummary.total_views}
                  </Typography>
                  <Typography variant="body2" sx={{ color: darkMode ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)' }}>
                    Tool Views
                  </Typography>
                </CardContent>
              </StatsCard>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <StatsCard darkMode={darkMode}>
                <CardContent sx={{ textAlign: 'center', p: 3 }}>
                  <Bookmark sx={{ fontSize: 40, color: '#FF9800', mb: 1 }} />
                  <Typography variant="h4" sx={{ fontWeight: 'bold', color: darkMode ? '#fff' : '#333' }}>
                    {activitySummary.total_bookmarks}
                  </Typography>
                  <Typography variant="body2" sx={{ color: darkMode ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)' }}>
                    Bookmarks
                  </Typography>
                </CardContent>
              </StatsCard>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <StatsCard darkMode={darkMode}>
                <CardContent sx={{ textAlign: 'center', p: 3 }}>
                  <RateReview sx={{ fontSize: 40, color: '#4CAF50', mb: 1 }} />
                  <Typography variant="h4" sx={{ fontWeight: 'bold', color: darkMode ? '#fff' : '#333' }}>
                    {activitySummary.total_reviews}
                  </Typography>
                  <Typography variant="body2" sx={{ color: darkMode ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)' }}>
                    Reviews
                  </Typography>
                </CardContent>
              </StatsCard>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <StatsCard darkMode={darkMode}>
                <CardContent sx={{ textAlign: 'center', p: 3 }}>
                  <Category sx={{ fontSize: 40, color: '#9C27B0', mb: 1 }} />
                  <Typography variant="h4" sx={{ fontWeight: 'bold', color: darkMode ? '#fff' : '#333' }}>
                    {activitySummary.unique_tools_viewed}
                  </Typography>
                  <Typography variant="body2" sx={{ color: darkMode ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)' }}>
                    Unique Tools
                  </Typography>
                </CardContent>
              </StatsCard>
            </Grid>
          </Grid>
        </Fade>
      )}

      {/* Tabs */}
      <Paper 
        sx={{ 
          mb: 3,
          background: darkMode 
            ? 'rgba(255, 255, 255, 0.05)'
            : 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(10px)',
        }}
      >
        <Tabs 
          value={activeTab} 
          onChange={handleTabChange}
          sx={{
            '& .MuiTab-root': {
              color: darkMode ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)',
              '&.Mui-selected': {
                color: darkMode ? '#fff' : '#333',
              },
            },
          }}
        >
          <Tab label="Recently Viewed" icon={<History />} />
          <Tab label="Activity History" icon={<TrendingUp />} />
          <Tab label="Categories" icon={<Category />} />
        </Tabs>
      </Paper>

      {/* Tab Content */}
      {activeTab === 0 && (
        <Fade in timeout={600}>
          <Box>
            <Typography 
              variant="h5" 
              sx={{ 
                mb: 3,
                fontWeight: 'bold',
                color: darkMode ? '#fff' : '#333',
              }}
            >
              Recently Viewed Tools
            </Typography>
            
            {recentlyViewed.length === 0 ? (
              <Alert severity="info" sx={{ borderRadius: 2 }}>
                No recently viewed tools. Start exploring AI tools to see your activity here!
              </Alert>
            ) : (
              <Grid container spacing={3}>
                {recentlyViewed.map((tool, index) => (
                  <Grid item xs={12} sm={6} md={4} key={tool.tool_id}>
                    <Zoom in timeout={600} style={{ transitionDelay: `${index * 100}ms` }}>
                      <ActivityCard darkMode={darkMode}>
                        <CardContent>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                            <Typography 
                              variant="h6" 
                              sx={{ 
                                fontWeight: 'bold',
                                color: darkMode ? '#fff' : '#333',
                                cursor: 'pointer',
                                '&:hover': { color: '#2196F3' }
                              }}
                              onClick={() => handleToolClick(tool.tool_id)}
                            >
                              {tool.tool_name}
                            </Typography>
                            <Chip 
                              label={tool.tool_category} 
                              size="small" 
                              color="primary" 
                              variant="outlined"
                            />
                          </Box>
                          
                          <Rating 
                            value={tool.average_rating} 
                            readOnly 
                            showCount 
                            reviewCount={tool.review_count}
                            size="small"
                          />
                          
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              mt: 2,
                              color: darkMode ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)',
                              lineHeight: 1.5,
                            }}
                          >
                            {tool.tool_description}
                          </Typography>
                          
                          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="caption" sx={{ color: darkMode ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)' }}>
                              Viewed {formatRelativeTime(tool.viewed_at)}
                            </Typography>
                            <Typography variant="caption" sx={{ color: darkMode ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)' }}>
                              {tool.view_count} time{tool.view_count > 1 ? 's' : ''}
                            </Typography>
                          </Box>
                        </CardContent>
                      </ActivityCard>
                    </Zoom>
                  </Grid>
                ))}
              </Grid>
            )}
          </Box>
        </Fade>
      )}

      {activeTab === 1 && (
        <Fade in timeout={600}>
          <Box>
            <Typography 
              variant="h5" 
              sx={{ 
                mb: 3,
                fontWeight: 'bold',
                color: darkMode ? '#fff' : '#333',
              }}
            >
              Recent Activity
            </Typography>
            
            {activityHistory.length === 0 ? (
              <Alert severity="info" sx={{ borderRadius: 2 }}>
                No activity history found. Start interacting with tools to see your activity here!
              </Alert>
            ) : (
              <List>
                {activityHistory.map((activity, index) => (
                  <Zoom in timeout={600} key={activity.id} style={{ transitionDelay: `${index * 50}ms` }}>
                    <ActivityCard darkMode={darkMode} sx={{ mb: 2 }}>
                      <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Avatar 
                            sx={{ 
                              bgcolor: getActivityColor(activity.activity_type),
                              mr: 2,
                            }}
                          >
                            {getActivityIcon(activity.activity_type)}
                          </Avatar>
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: darkMode ? '#fff' : '#333' }}>
                              {activity.ai_tools?.name || 'Unknown Tool'}
                            </Typography>
                            <Typography variant="body2" sx={{ color: darkMode ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)' }}>
                              {activity.activity_type.charAt(0).toUpperCase() + activity.activity_type.slice(1)} • {formatRelativeTime(activity.created_at)}
                            </Typography>
                          </Box>
                          <Chip 
                            label={activity.ai_tools?.category || 'Unknown'} 
                            size="small" 
                            variant="outlined"
                          />
                        </Box>
                      </CardContent>
                    </ActivityCard>
                  </Zoom>
                ))}
              </List>
            )}
          </Box>
        </Fade>
      )}

      {activeTab === 2 && (
        <Fade in timeout={600}>
          <Box>
            <Typography 
              variant="h5" 
              sx={{ 
                mb: 3,
                fontWeight: 'bold',
                color: darkMode ? '#fff' : '#333',
              }}
            >
              Most Viewed Categories
            </Typography>
            
            {mostViewedCategories.length === 0 ? (
              <Alert severity="info" sx={{ borderRadius: 2 }}>
                No category data available. Start viewing tools to see your preferences here!
              </Alert>
            ) : (
              <Grid container spacing={3}>
                {mostViewedCategories.map((category, index) => (
                  <Grid item xs={12} sm={6} md={4} key={category.category}>
                    <Zoom in timeout={600} style={{ transitionDelay: `${index * 100}ms` }}>
                      <ActivityCard darkMode={darkMode}>
                        <CardContent sx={{ textAlign: 'center', p: 3 }}>
                          <Category sx={{ fontSize: 40, color: '#9C27B0', mb: 2 }} />
                          <Typography variant="h4" sx={{ fontWeight: 'bold', color: darkMode ? '#fff' : '#333', mb: 1 }}>
                            {category.count}
                          </Typography>
                          <Typography variant="h6" sx={{ color: darkMode ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.8)' }}>
                            {category.category}
                          </Typography>
                          <Typography variant="body2" sx={{ color: darkMode ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)' }}>
                            tools viewed
                          </Typography>
                        </CardContent>
                      </ActivityCard>
                    </Zoom>
                  </Grid>
                ))}
              </Grid>
            )}
          </Box>
        </Fade>
      )}
    </StyledContainer>
  );
};

export default MyActivity; 