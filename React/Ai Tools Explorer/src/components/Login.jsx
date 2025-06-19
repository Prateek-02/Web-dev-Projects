import {
  Box,
  Button,
  TextField,
  Stack,
  Typography,
  Link,
  Container,
  Paper,
  useTheme,
  InputAdornment,
  IconButton,
  Fade,
  Slide,
  Avatar,
  Divider,
  Chip,
  LinearProgress,
  Alert,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Email,
  Lock,
  Login as LoginIcon,
  Google,
  AutoAwesome,
  Security,
  Speed,
} from '@mui/icons-material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [showAlert, setShowAlert] = useState(false);

  // Social login loading state
  const [socialLoading, setSocialLoading] = useState(null); // 'google' | null

  const theme = useTheme();
  const navigate = useNavigate();

  const features = [
    { icon: <Security />, text: 'Secure Login', color: '#4caf50' },
    { icon: <Speed />, text: 'Fast Access', color: '#2196f3' },
    { icon: <AutoAwesome />, text: 'Smart Features', color: '#ff9800' },
  ];

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    // Simple password strength calculation
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password)) strength += 25;
    if (/[^A-Za-z0-9]/.test(password)) strength += 25;
    setPasswordStrength(strength);
  }, [password]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setShowAlert(true);
      console.log('Login attempt with:', { email, password });

      // Redirect to home after login
      setTimeout(() => {
        setShowAlert(false);
        navigate('/');
      }, 1000);
    }, 2000);
  };

  // --- Google Sign-In logic (like Register page) ---
  // This will use the Google Identity Services button and handle the callback.
  // We'll render the button in a ref container and trigger it on click.

  const googleBtnRef = useRef(null);
  const [googleBtnRendered, setGoogleBtnRendered] = useState(false);

  // Google Client ID (should match the one in Register page)
  const GOOGLE_CLIENT_ID = '663732832122-em3m7djoa0rl09jam6htka8pae4v92gq.apps.googleusercontent.com';

  // Load Google script and render button on mount (once)
  useEffect(() => {
    if (googleBtnRendered) return;
    if (!window.google || !window.google.accounts || !window.google.accounts.id) {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = () => {
        renderGoogleButton();
      };
      document.body.appendChild(script);
    } else {
      renderGoogleButton();
    }
    // eslint-disable-next-line
  }, []);

  const renderGoogleButton = () => {
    if (
      window.google &&
      window.google.accounts &&
      window.google.accounts.id &&
      googleBtnRef.current &&
      !googleBtnRendered
    ) {
      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: handleGoogleCredentialResponse,
        ux_mode: 'popup',
      });
      window.google.accounts.id.renderButton(googleBtnRef.current, {
        theme: theme.palette.mode === 'dark' ? 'filled_black' : 'outline',
        size: 'large',
        text: 'continue_with',
        shape: 'pill',
        width: 320,
        logo_alignment: 'left',
      });
      setGoogleBtnRendered(true);
    }
  };

  // Handle Google credential response
  const handleGoogleCredentialResponse = (response) => {
    setSocialLoading(null);
    setShowAlert(true);
    // You can decode the JWT if you want to show the user's email
    // For now, just log the credential
    console.log('Google credential:', response.credential);
    // Redirect to home after Google login
    setTimeout(() => {
      setShowAlert(false);
      navigate('/');
    }, 1000);
  };

  // Social login handler (only Google)
  const handleSocialLogin = (provider) => {
    if (provider.toLowerCase() === 'google') {
      setSocialLoading('google');
      // Simulate click on the rendered Google button
      if (
        googleBtnRef.current &&
        googleBtnRef.current.querySelector('div[role="button"]')
      ) {
        googleBtnRef.current.querySelector('div[role="button"]').click();
      } else {
        // fallback: try to render again
        renderGoogleButton();
        setTimeout(() => {
          if (
            googleBtnRef.current &&
            googleBtnRef.current.querySelector('div[role="button"]')
          ) {
            googleBtnRef.current.querySelector('div[role="button"]').click();
          } else {
            setSocialLoading(null);
            alert('Google Sign-In is not available.');
          }
        }, 500);
      }
      return;
    }
    // No other providers supported
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength < 50) return '#f44336';
    if (passwordStrength < 75) return '#ff9800';
    return '#4caf50';
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength === 0) return '';
    if (passwordStrength < 50) return 'Weak';
    if (passwordStrength < 75) return 'Medium';
    return 'Strong';
  };

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
        py: { xs: 4, md: 8 },
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `radial-gradient(circle at 30% 70%, ${theme.palette.primary.main}15 0%, transparent 50%),
                       radial-gradient(circle at 70% 30%, ${theme.palette.secondary.main}15 0%, transparent 50%)`,
          animation: 'float 15s ease-in-out infinite',
        },
        '@keyframes float': {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-10px) rotate(1deg)' },
        },
      }}
    >
      <Container maxWidth="sm" sx={{ position: 'relative', zIndex: 1 }}>
        <Fade in={mounted} timeout={800}>
          <Box>
            {/* Header Section */}
            <Slide direction="down" in={mounted} timeout={1000}>
              <Stack spacing={3} textAlign="center" sx={{ mb: 4 }}>
                <Avatar
                  sx={{
                    width: 80,
                    height: 80,
                    mx: 'auto',
                    background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                    animation: 'pulse 2s infinite',
                    '@keyframes pulse': {
                      '0%, 100%': { transform: 'scale(1)' },
                      '50%': { transform: 'scale(1.05)' },
                    },
                  }}
                >
                  <LoginIcon sx={{ fontSize: '2.5rem' }} />
                </Avatar>

                <Typography
                  component="h1"
                  variant="h3"
                  sx={{
                    fontWeight: 800,
                    background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    textShadow: '0 2px 4px rgba(0,0,0,0.1)',
                  }}
                >
                  Welcome Back
                </Typography>

                <Typography variant="h6" color="white" sx={{ opacity: 0.9 }}>
                  Sign in to explore amazing{' '}
                  <Link
                    component={RouterLink}
                    to="/"
                    sx={{
                      color: theme.palette.secondary.main,
                      textDecoration: 'none',
                      fontWeight: 600,
                      '&:hover': { textDecoration: 'underline' }
                    }}
                  >
                    AI features
                  </Link>
                </Typography>

                {/* Feature Pills */}
                <Stack direction="row" justifyContent="center" spacing={1} flexWrap="wrap">
                  {features.map((feature, index) => (
                    <Fade key={index} in={mounted} timeout={1200 + index * 200}>
                      <Chip
                        icon={feature.icon}
                        label={feature.text}
                        size="small"
                        sx={{
                          bgcolor: `${feature.color}20`,
                          color: feature.color,
                          border: `1px solid ${feature.color}40`,
                          fontWeight: 600,
                          '&:hover': {
                            bgcolor: `${feature.color}30`,
                            transform: 'translateY(-2px)',
                          },
                          transition: 'all 0.3s ease',
                        }}
                      />
                    </Fade>
                  ))}
                </Stack>
              </Stack>
            </Slide>

            {/* Alert */}
            {showAlert && (
              <Fade in={showAlert}>
                <Alert
                  severity="success"
                  sx={{ mb: 3, borderRadius: 2 }}
                  onClose={() => setShowAlert(false)}
                >
                  Login successful! Redirecting...
                </Alert>
              </Fade>
            )}

            {/* Main Form */}
            <Slide direction="up" in={mounted} timeout={1200}>
              <Paper
                elevation={24}
                sx={{
                  p: 4,
                  borderRadius: 3,
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
                    height: '2px',
                    background: `linear-gradient(90deg, transparent, ${theme.palette.primary.main}, transparent)`,
                    animation: 'slide 3s infinite',
                  },
                  '@keyframes slide': {
                    '0%': { left: '-100%' },
                    '100%': { left: '100%' },
                  },
                }}
              >
                <Stack component="form" onSubmit={handleSubmit} spacing={3}>
                  {/* Email Field */}
                  <Box sx={{ position: 'relative' }}>
                    <TextField
                      required
                      fullWidth
                      id="email"
                      label="Email Address"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onFocus={() => setEmailFocused(true)}
                      onBlur={() => setEmailFocused(false)}
                      autoComplete="email"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Email
                              sx={{
                                color: emailFocused ? theme.palette.primary.main : 'text.secondary',
                                transition: 'color 0.3s ease'
                              }}
                            />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            transform: 'translateY(-2px)',
                            boxShadow: `0 4px 20px ${theme.palette.primary.main}20`,
                          },
                          '&.Mui-focused': {
                            transform: 'translateY(-2px)',
                            boxShadow: `0 8px 25px ${theme.palette.primary.main}30`,
                          },
                        },
                      }}
                    />
                  </Box>

                  {/* Password Field */}
                  <Box sx={{ position: 'relative' }}>
                    <TextField
                      required
                      fullWidth
                      id="password"
                      label="Password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onFocus={() => setPasswordFocused(true)}
                      onBlur={() => setPasswordFocused(false)}
                      autoComplete="current-password"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Lock
                              sx={{
                                color: passwordFocused ? theme.palette.primary.main : 'text.secondary',
                                transition: 'color 0.3s ease'
                              }}
                            />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() => setShowPassword(!showPassword)}
                              edge="end"
                              sx={{
                                '&:hover': {
                                  backgroundColor: `${theme.palette.primary.main}10`,
                                },
                              }}
                            >
                              {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            transform: 'translateY(-2px)',
                            boxShadow: `0 4px 20px ${theme.palette.primary.main}20`,
                          },
                          '&.Mui-focused': {
                            transform: 'translateY(-2px)',
                            boxShadow: `0 8px 25px ${theme.palette.primary.main}30`,
                          },
                        },
                      }}
                    />

                    {/* Password Strength Indicator */}
                    {password && (
                      <Fade in={Boolean(password)}>
                        <Box sx={{ mt: 1 }}>
                          <LinearProgress
                            variant="determinate"
                            value={passwordStrength}
                            sx={{
                              height: 4,
                              borderRadius: 2,
                              backgroundColor: 'grey.200',
                              '& .MuiLinearProgress-bar': {
                                backgroundColor: getPasswordStrengthColor(),
                                borderRadius: 2,
                              },
                            }}
                          />
                          <Typography
                            variant="caption"
                            sx={{
                              color: getPasswordStrengthColor(),
                              fontWeight: 600,
                              mt: 0.5,
                              display: 'block'
                            }}
                          >
                            {getPasswordStrengthText()}
                          </Typography>
                        </Box>
                      </Fade>
                    )}
                  </Box>

                  {/* Login Button */}
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    size="large"
                    disabled={isLoading || socialLoading !== null}
                    startIcon={isLoading ? null : <LoginIcon />}
                    sx={{
                      mt: 3,
                      py: 1.5,
                      borderRadius: 2,
                      fontSize: '1.1rem',
                      fontWeight: 600,
                      background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                      boxShadow: `0 8px 32px ${theme.palette.primary.main}40`,
                      position: 'relative',
                      overflow: 'hidden',
                      '&:hover': {
                        background: `linear-gradient(45deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`,
                        transform: 'translateY(-2px)',
                        boxShadow: `0 12px 40px ${theme.palette.primary.main}50`,
                      },
                      '&:disabled': {
                        background: 'grey.400',
                      },
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    }}
                  >
                    {isLoading ? (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box
                          sx={{
                            width: 20,
                            height: 20,
                            border: '2px solid transparent',
                            borderTop: '2px solid white',
                            borderRadius: '50%',
                            animation: 'spin 1s linear infinite',
                          }}
                        />
                        Signing in...
                      </Box>
                    ) : (
                      'Sign In'
                    )}
                  </Button>

                  {/* Divider */}
                  <Divider sx={{ my: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      or continue with
                    </Typography>
                  </Divider>

                  {/* Social Login Buttons */}
                  <Stack direction="row" spacing={2}>
                    <Box
                      ref={googleBtnRef}
                      sx={{
                        width: '100%',
                        minHeight: 40,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    />
                  </Stack>

                  {/* Footer Links */}
                  <Stack spacing={2} textAlign="center" sx={{ mt: 3 }}>
                    <Link
                      href="#"
                      color="primary"
                      sx={{
                        textDecoration: 'none',
                        fontWeight: 500,
                        '&:hover': {
                          textDecoration: 'underline',
                        },
                      }}
                    >
                      Forgot your password?
                    </Link>

                    <Typography variant="body2" color="text.secondary">
                      Don&apos;t have an account?{' '}
                      <Link
                        component={RouterLink}
                        to="/register"
                        sx={{
                          color: theme.palette.primary.main,
                          textDecoration: 'none',
                          fontWeight: 600,
                          '&:hover': {
                            textDecoration: 'underline',
                          },
                        }}
                      >
                        Create one now
                      </Link>
                    </Typography>
                  </Stack>
                </Stack>
              </Paper>
            </Slide>
          </Box>
        </Fade>
      </Container>

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </Box>
  );
}