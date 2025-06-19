import {
  Box,
  Container,
  Button,
  Typography,
  Stack,
  useTheme,
  Paper,
  Avatar,
  Chip,
  Fade,
  Slide,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import {
  AutoAwesome,
  Psychology,
  Memory,
  Speed,
  Star,
  TrendingUp,
  Security,
  CloudQueue,
} from '@mui/icons-material';

export default function Welcome() {
  const navigate = useNavigate();
  const theme = useTheme();
  const [checked, setChecked] = useState(false);
  const [currentFeature, setCurrentFeature] = useState(0);
  const [hoveredButton, setHoveredButton] = useState(null);

  const features = [
    { icon: <AutoAwesome />, title: 'Smart AI Tools', color: '#ff6b6b' },
    { icon: <Psychology />, title: 'Machine Learning', color: '#4ecdc4' },
    { icon: <Memory />, title: 'Neural Networks', color: '#45b7d1' },
    { icon: <Speed />, title: 'Real-time Processing', color: '#96ceb4' },
    { icon: <Security />, title: 'Secure & Private', color: '#feca57' },
    { icon: <CloudQueue />, title: 'Cloud Integration', color: '#ff9ff3' },
  ];

  const stats = [
    { number: '10K+', label: 'Active Users' },
    { number: '50+', label: 'AI Tools' },
    { number: '99.9%', label: 'Uptime' },
    { number: '24/7', label: 'Support' },
  ];

  useEffect(() => {
    setChecked(true);
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [features.length]);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: theme.palette.mode === 'light' 
          ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
          : 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `radial-gradient(circle at 20% 50%, ${theme.palette.primary.main}22 0%, transparent 50%),
                       radial-gradient(circle at 80% 20%, ${theme.palette.secondary.main}22 0%, transparent 50%),
                       radial-gradient(circle at 40% 80%, ${theme.palette.primary.main}22 0%, transparent 50%)`,
          animation: 'float 20s ease-in-out infinite',
        },
        '@keyframes float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        '@keyframes pulse': {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.05)' },
        },
        '@keyframes glow': {
          '0%, 100%': { boxShadow: `0 0 20px ${theme.palette.primary.main}40` },
          '50%': { boxShadow: `0 0 40px ${theme.palette.primary.main}60` },
        },
      }}
    >
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Fade in={checked} timeout={1000}>
          <Paper 
            elevation={24}
            sx={{ 
              p: { xs: 3, md: 6 }, 
              borderRadius: 4,
              background: `${theme.palette.background.paper}95`,
              backdropFilter: 'blur(20px)',
              border: `1px solid ${theme.palette.primary.main}30`,
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: '-100%',
                width: '100%',
                height: '100%',
                background: `linear-gradient(90deg, transparent, ${theme.palette.primary.main}20, transparent)`,
                animation: 'shimmer 3s infinite',
              },
              '@keyframes shimmer': {
                '0%': { left: '-100%' },
                '100%': { left: '100%' },
              },
            }}
          >
            <Stack spacing={6} alignItems="center" textAlign="center">
              {/* Animated Logo/Icon */}
              <Slide direction="down" in={checked} timeout={1200}>
                <Box sx={{ position: 'relative' }}>
                  <Avatar
                    sx={{
                      width: 120,
                      height: 120,
                      bgcolor: 'transparent',
                      border: `3px solid ${theme.palette.primary.main}`,
                      animation: 'pulse 2s infinite, glow 3s infinite',
                      fontSize: '3rem',
                      background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                    }}
                  >
                    <AutoAwesome sx={{ fontSize: '3rem', color: 'white' }} />
                  </Avatar>
                  {/* Floating particles */}
                  {[...Array(6)].map((_, i) => (
                    <Box
                      key={i}
                      sx={{
                        position: 'absolute',
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        bgcolor: theme.palette.primary.main,
                        top: `${Math.random() * 100}%`,
                        left: `${Math.random() * 100}%`,
                        animation: `float ${3 + Math.random() * 2}s ease-in-out infinite`,
                        animationDelay: `${Math.random() * 2}s`,
                      }}
                    />
                  ))}
                </Box>
              </Slide>

              {/* Main Title with Gradient */}
              <Slide direction="up" in={checked} timeout={1400}>
                <Typography
                  component="h1"
                  variant="h2"
                  sx={{
                    fontWeight: 800,
                    lineHeight: 1.1,
                    background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    textShadow: '0 4px 8px rgba(0,0,0,0.3)',
                    fontSize: { xs: '2rem', md: '3.5rem' },
                  }}
                >
                  AI Tools Explorer
                </Typography>
              </Slide>

              {/* Animated Feature Tags */}
              <Slide direction="up" in={checked} timeout={1600}>
                <Stack direction="row" spacing={1} flexWrap="wrap" justifyContent="center">
                  {features.map((feature, index) => (
                    <Fade key={index} in={checked} timeout={1800 + index * 200}>
                      <Chip
                        icon={feature.icon}
                        label={feature.title}
                        variant={currentFeature === index ? "filled" : "outlined"}
                        sx={{
                          m: 0.5,
                          transition: 'all 0.3s ease',
                          bgcolor: currentFeature === index ? feature.color : 'transparent',
                          color: currentFeature === index ? 'white' : theme.palette.text.primary,
                          borderColor: feature.color,
                          '&:hover': {
                            bgcolor: feature.color,
                            color: 'white',
                            transform: 'translateY(-2px)',
                          },
                        }}
                      />
                    </Fade>
                  ))}
                </Stack>
              </Slide>

              {/* Description */}
              <Slide direction="up" in={checked} timeout={1800}>
                <Typography
                  variant="h6"
                  color="text.secondary"
                  sx={{ 
                    maxWidth: 600,
                    lineHeight: 1.6,
                    fontWeight: 400,
                  }}
                >
                  Discover and explore the latest AI tools and technologies. Join our community
                  to stay updated with cutting-edge developments in artificial intelligence.
                </Typography>
              </Slide>

              {/* Stats Row */}
              <Slide direction="up" in={checked} timeout={2000}>
                <Stack 
                  direction={{ xs: 'column', sm: 'row' }} 
                  spacing={4}
                  sx={{ 
                    py: 3,
                    px: 2,
                    borderRadius: 2,
                    bgcolor: `${theme.palette.primary.main}10`,
                    backdropFilter: 'blur(10px)',
                  }}
                >
                  {stats.map((stat, index) => (
                    <Box key={index} textAlign="center">
                      <Typography 
                        variant="h4" 
                        fontWeight="bold" 
                        color="primary"
                        sx={{ 
                          background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
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
                  ))}
                </Stack>
              </Slide>

              {/* Action Buttons */}
              <Slide direction="up" in={checked} timeout={2200}>
                <Stack
                  direction={{ xs: 'column', sm: 'row' }}
                  spacing={3}
                  sx={{ mt: 4 }}
                >
                  <Button
                    variant="contained"
                    size="large"
                    startIcon={<Star />}
                    onClick={() => navigate('/login')}
                    onMouseEnter={() => setHoveredButton('login')}
                    onMouseLeave={() => setHoveredButton(null)}
                    sx={{
                      borderRadius: 28,
                      px: 4,
                      py: 1.5,
                      fontSize: '1.1rem',
                      fontWeight: 600,
                      background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                      boxShadow: `0 8px 32px ${theme.palette.primary.main}40`,
                      transform: hoveredButton === 'login' ? 'translateY(-4px) scale(1.05)' : 'translateY(0) scale(1)',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      '&:hover': {
                        background: `linear-gradient(45deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`,
                        boxShadow: `0 12px 40px ${theme.palette.primary.main}60`,
                      },
                    }}
                  >
                    Get Started
                  </Button>
                  <Button
                    variant="outlined"
                    size="large"
                    startIcon={<TrendingUp />}
                    onClick={() => navigate('/register')}
                    onMouseEnter={() => setHoveredButton('register')}
                    onMouseLeave={() => setHoveredButton(null)}
                    sx={{
                      borderRadius: 28,
                      px: 4,
                      py: 1.5,
                      fontSize: '1.1rem',
                      fontWeight: 600,
                      borderWidth: 2,
                      borderColor: theme.palette.primary.main,
                      color: theme.palette.primary.main,
                      background: 'transparent',
                      backdropFilter: 'blur(10px)',
                      transform: hoveredButton === 'register' ? 'translateY(-4px) scale(1.05)' : 'translateY(0) scale(1)',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      '&:hover': {
                        borderColor: theme.palette.primary.dark,
                        background: `${theme.palette.primary.main}15`,
                        boxShadow: `0 8px 32px ${theme.palette.primary.main}30`,
                      },
                    }}
                  >
                    Learn More
                  </Button>
                </Stack>
              </Slide>

              {/* Social Proof */}
              <Fade in={checked} timeout={2400}>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Typography variant="body2" color="text.secondary">
                    Trusted by developers worldwide
                  </Typography>
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} sx={{ color: '#ffd700', fontSize: '1rem' }} />
                  ))}
                </Stack>
              </Fade>
            </Stack>
          </Paper>
        </Fade>
      </Container>

      
    </Box>
  );
}