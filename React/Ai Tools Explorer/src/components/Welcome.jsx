import {
  Box,
  Container,
  Button,
  Typography,
  Stack,
  Grid,
  Paper,
  Avatar,
  Chip,
  Fade,
  Slide,
  Card,
  CardContent,
  useTheme,
} from '@mui/material';
import { useState, useEffect } from 'react';
import {
  AutoAwesome,
  Star,
  TrendingUp,
  Search,
  Favorite,
  SmartToy,
  Visibility,
  Rocket,
  Analytics,
  ArrowForward,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';

export default function Welcome() {
  const [checked, setChecked] = useState(false);
  const [currentFeature, setCurrentFeature] = useState(0);
  const [hoveredButton, setHoveredButton] = useState(null);
  const [hoveredCard, setHoveredCard] = useState(null);

  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const navigate = useNavigate();

  const features = [
    { 
      icon: <Search />, 
      title: 'Search & Filter', 
      description: 'Find the perfect AI tool with powerful search and filtering options',
      color: '#ff6b6b' 
    },
    { 
      icon: <Favorite />, 
      title: 'Save Favorites', 
      description: 'Bookmark your favorite AI tools for quick access anytime',
      color: '#4ecdc4' 
    },
    { 
      icon: <SmartToy />, 
      title: 'AI Recommendations', 
      description: 'Get personalized tool suggestions based on your interests',
      color: '#45b7d1' 
    },
    { 
      icon: <Visibility />, 
      title: 'Clean UI', 
      description: 'Intuitive interface designed for easy discovery and exploration',
      color: '#96ceb4' 
    },
  ];

  const sampleTools = [
    {
      name: 'ChatGPT',
      category: 'Conversational AI',
      rating: 4.8,
      users: '100M+',
      description: 'Advanced AI chatbot for conversations and content creation',
      color: '#00a67e',
    },
    {
      name: 'Midjourney',
      category: 'Image Generation',
      rating: 4.9,
      users: '15M+',
      description: 'AI-powered art and image generation platform',
      color: '#7c3aed',
    },
    {
      name: 'GitHub Copilot',
      category: 'Code Assistant',
      rating: 4.7,
      users: '5M+',
      description: 'AI pair programmer that helps you write code faster',
      color: '#24292h',
    },
  ];

  const stats = [
    { number: '90+', label: 'AI Tools', icon: <Rocket /> },
    { number: '5K+', label: 'Active Users', icon: <Analytics /> },
    { number: '4.5★', label: 'User Rating', icon: <Star /> },
    { number: '24/7', label: 'Updated', icon: <TrendingUp /> },
  ];

  useEffect(() => {
    setChecked(true);
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [features.length]);

  const handleGetStarted = () => {
    navigate('/register');
  };

  const handleLogin = () => {
    navigate('/login');
  };

  // Card background colors for light/dark mode
  const cardBg = isDark ? 'rgba(28,32,40,0.96)' : 'rgba(255,255,255,0.95)';
  const cardBorder = isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(255,255,255,0.2)';
  const cardShadow = isDark
    ? (hovered => hovered ? '0 20px 40px rgba(0,0,0,0.4)' : '0 8px 24px rgba(0,0,0,0.25)')
    : (hovered => hovered ? '0 20px 40px rgba(0,0,0,0.1)' : '0 8px 24px rgba(0,0,0,0.05)');
  const cardHoverTransform = 'translateY(-8px)';
  const cardTextColor = isDark ? 'rgba(255,255,255,0.95)' : undefined;

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `radial-gradient(circle at 20% 50%, rgba(255, 107, 107, 0.1) 0%, transparent 50%),
                       radial-gradient(circle at 80% 20%, rgba(78, 205, 196, 0.1) 0%, transparent 50%),
                       radial-gradient(circle at 40% 80%, rgba(69, 183, 209, 0.1) 0%, transparent 50%)`,
          animation: 'float 20s ease-in-out infinite',
        },
        '@keyframes float': {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-20px) rotate(2deg)' },
        },
        '@keyframes pulse': {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.05)' },
        },
        '@keyframes glow': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(102, 126, 234, 0.4)' },
          '50%': { boxShadow: '0 0 40px rgba(102, 126, 234, 0.6)' },
        },
      }}
    >
      {/* Theme Toggle in top right corner */}
      <Box sx={{ position: 'absolute', top: 20, right: 20, zIndex: 10 }}>
        <ThemeToggle />
      </Box>

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1, py: 8 }}>
        {/* Hero Section */}
        <Fade in={checked} timeout={1000}>
          <Box textAlign="center" mb={8}>
            <Slide direction="down" in={checked} timeout={1200}>
              <Box sx={{ position: 'relative', mb: 4 }}>
                <Avatar
                  sx={{
                    width: 100,
                    height: 100,
                    bgcolor: 'transparent',
                    border: '3px solid rgba(255,255,255,0.3)',
                    animation: 'pulse 2s infinite, glow 3s infinite',
                    fontSize: '2.5rem',
                    background: 'linear-gradient(45deg, #667eea, #764ba2)',
                    mx: 'auto',
                    mb: 3,
                  }}
                >
                  <AutoAwesome sx={{ fontSize: '2.5rem', color: 'white' }} />
                </Avatar>
              </Box>
            </Slide>

            <Slide direction="up" in={checked} timeout={1400}>
              <Typography
                component="h1"
                variant="h2"
                sx={{
                  fontWeight: 800,
                  lineHeight: 1.1,
                  color: 'white',
                  textShadow: '0 4px 8px rgba(0,0,0,0.3)',
                  fontSize: { xs: '2.5rem', md: '4rem' },
                  mb: 2,
                }}
              >
                Discover the Best AI Tools
              </Typography>
            </Slide>

            <Slide direction="up" in={checked} timeout={1600}>
              <Typography
                variant="h5"
                sx={{
                  color: 'rgba(255,255,255,0.9)',
                  fontWeight: 400,
                  mb: 2,
                  fontSize: { xs: '1.2rem', md: '1.5rem' },
                }}
              >
                All in One Place
              </Typography>
            </Slide>

            <Slide direction="up" in={checked} timeout={1800}>
              <Typography
                variant="h6"
                sx={{
                  color: 'rgba(255,255,255,0.8)',
                  maxWidth: 600,
                  mx: 'auto',
                  lineHeight: 1.6,
                  fontWeight: 300,
                  mb: 4,
                }}
              >
                Browse, save, and explore AI tools that boost productivity and creativity. 
                Join thousands of users discovering the future of AI.
              </Typography>
            </Slide>

            {/* CTA Buttons */}
            <Slide direction="up" in={checked} timeout={2000}>
              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={3}
                justifyContent="center"
                sx={{ mb: 6 }}
              >
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<Rocket />}
                  onClick={handleGetStarted}
                  onMouseEnter={() => setHoveredButton('signup')}
                  onMouseLeave={() => setHoveredButton(null)}
                  sx={{
                    borderRadius: 28,
                    px: 4,
                    py: 1.5,
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    background: 'linear-gradient(45deg, #ff6b6b, #ff8e8e)',
                    boxShadow: '0 8px 32px rgba(255, 107, 107, 0.4)',
                    transform: hoveredButton === 'signup' ? 'translateY(-4px) scale(1.05)' : 'translateY(0) scale(1)',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                      background: 'linear-gradient(45deg, #ff5252, #ff6b6b)',
                      boxShadow: '0 12px 40px rgba(255, 107, 107, 0.6)',
                    },
                  }}
                >
                  Get Started Free
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  startIcon={<ArrowForward />}
                  onClick={handleLogin}
                  onMouseEnter={() => setHoveredButton('login')}
                  onMouseLeave={() => setHoveredButton(null)}
                  sx={{
                    borderRadius: 28,
                    px: 4,
                    py: 1.5,
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    borderWidth: 2,
                    borderColor: 'rgba(255,255,255,0.5)',
                    color: 'white',
                    background: 'rgba(255,255,255,0.1)',
                    backdropFilter: 'blur(10px)',
                    transform: hoveredButton === 'login' ? 'translateY(-4px) scale(1.05)' : 'translateY(0) scale(1)',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                      borderColor: 'white',
                      background: 'rgba(255,255,255,0.2)',
                      boxShadow: '0 8px 32px rgba(255,255,255,0.3)',
                    },
                  }}
                >
                  Login
                </Button>
              </Stack>
            </Slide>
          </Box>
        </Fade>

        {/* Stats Section */}
        <Slide direction="up" in={checked} timeout={2200}>
          <Paper
            elevation={12}
            sx={{
              p: 4,
              mb: 8,
              borderRadius: 4,
              background: isDark ? 'rgba(28,32,40,0.96)' : 'rgba(255,255,255,0.95)',
              backdropFilter: 'blur(20px)',
              border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(255,255,255,0.2)',
              color: isDark ? 'rgba(255,255,255,0.95)' : undefined,
            }}
          >
            <Grid container spacing={4}>
              {stats.map((stat, index) => (
                <Grid item xs={6} md={3} key={index}>
                  <Box textAlign="center">
                    <Box sx={{ mb: 1, color: '#667eea' }}>
                      {stat.icon}
                    </Box>
                    <Typography 
                      variant="h4" 
                      fontWeight="bold" 
                      sx={{
                        background: 'linear-gradient(45deg, #667eea, #764ba2)',
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                      }}
                    >
                      {stat.number}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {stat.label}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Slide>

        {/* Features Section */}
        <Fade in={checked} timeout={2400}>
          <Box mb={8}>
            <Typography
              variant="h3"
              textAlign="center"
              sx={{
                fontWeight: 700,
                color: 'white',
                mb: 2,
                textShadow: '0 2px 4px rgba(0,0,0,0.3)',
              }}
            >
              Why Choose Our Platform?
            </Typography>
            <Typography
              variant="h6"
              textAlign="center"
              sx={{
                color: 'rgba(255,255,255,0.8)',
                mb: 6,
                fontWeight: 300,
              }}
            >
              Everything you need to discover and manage AI tools
            </Typography>
            
            <Grid container spacing={4}>
              {features.map((feature, index) => (
                <Grid item xs={12} md={6} key={index}>
                  <Fade in={checked} timeout={2600 + index * 200}>
                    <Card
                      onMouseEnter={() => setHoveredCard(index)}
                      onMouseLeave={() => setHoveredCard(null)}
                      sx={{
                        height: '100%',
                        background: cardBg,
                        backdropFilter: 'blur(20px)',
                        border: cardBorder,
                        borderRadius: 3,
                        color: cardTextColor,
                        transform: hoveredCard === index ? cardHoverTransform : 'translateY(0)',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        boxShadow: cardShadow(hoveredCard === index),
                      }}
                    >
                      <CardContent sx={{ p: 3 }}>
                        <Box
                          sx={{
                            width: 60,
                            height: 60,
                            borderRadius: 2,
                            background: `linear-gradient(45deg, ${feature.color}, ${feature.color}dd)`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            mb: 2,
                            color: 'white',
                          }}
                        >
                          {feature.icon}
                        </Box>
                        <Typography variant="h6" fontWeight="bold" sx={{ mb: 1 }}>
                          {feature.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {feature.description}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Fade>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Fade>

        {/* Preview Section */}
        <Fade in={checked} timeout={3000}>
          <Box mb={8}>
            <Typography
              variant="h3"
              textAlign="center"
              sx={{
                fontWeight: 700,
                color: 'white',
                mb: 2,
                textShadow: '0 2px 4px rgba(0,0,0,0.3)',
              }}
            >
              Featured AI Tools
            </Typography>
            <Typography
              variant="h6"
              textAlign="center"
              sx={{
                color: 'rgba(255,255,255,0.8)',
                mb: 6,
                fontWeight: 300,
              }}
            >
              Discover some of the most popular tools on our platform
            </Typography>

            <Grid container spacing={4}>
              {sampleTools.map((tool, index) => (
                <Grid item xs={12} md={4} key={index}>
                  <Fade in={checked} timeout={3200 + index * 200}>
                    <Card
                      sx={{
                        height: '100%',
                        background: cardBg,
                        backdropFilter: 'blur(20px)',
                        border: cardBorder,
                        borderRadius: 3,
                        color: cardTextColor,
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: isDark
                            ? '0 12px 32px rgba(0,0,0,0.4)'
                            : '0 12px 32px rgba(0,0,0,0.1)',
                        },
                      }}
                    >
                      <CardContent sx={{ p: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <Avatar
                            sx={{
                              width: 48,
                              height: 48,
                              bgcolor: tool.color,
                              mr: 2,
                              fontSize: '1.2rem',
                            }}
                          >
                            {tool.name.charAt(0)}
                          </Avatar>
                          <Box>
                            <Typography variant="h6" fontWeight="bold">
                              {tool.name}
                            </Typography>
                            <Chip
                              label={tool.category}
                              size="small"
                              sx={{ 
                                bgcolor: `${tool.color}20`,
                                color: tool.color,
                                fontSize: '0.75rem',
                              }}
                            />
                          </Box>
                        </Box>
                        
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                          {tool.description}
                        </Typography>
                        
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Star sx={{ color: '#ffd700', fontSize: '1rem', mr: 0.5 }} />
                            <Typography variant="body2" fontWeight="bold">
                              {tool.rating}
                            </Typography>
                          </Box>
                          <Typography variant="body2" color="text.secondary">
                            {tool.users} users
                          </Typography>
                        </Box>
                      </CardContent>
                    </Card>
                  </Fade>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Fade>

        {/* Footer */}
        <Fade in={checked} timeout={3400}>
          <Box textAlign="center" py={4}>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', mb: 1 }}>
              Built with ❤️ for the AI community
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)' }}>
              © 2025 AI Tools Explorer. Discover the future of artificial intelligence.
            </Typography>
          </Box>
        </Fade>
      </Container>
    </Box>
  );
}