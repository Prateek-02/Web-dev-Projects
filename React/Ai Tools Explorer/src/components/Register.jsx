import { useState, useEffect, useRef } from 'react';
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
  FormControlLabel,
  Checkbox,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Email,
  Lock,
  Person,
  PersonAdd,
  CheckCircle,
  Error,
  Shield,
  Rocket,
  Star,
} from '@mui/icons-material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
// Initialize Supabase client
import { supabase } from '../supabaseClient.js';
import ThemeToggle from './ThemeToggle';

// Google Identity Services loader
const loadGoogleScript = () => {
  if (document.getElementById('google-client-script')) return;
  const script = document.createElement('script');
  script.src = 'https://accounts.google.com/gsi/client';
  script.async = true;
  script.defer = true;
  script.id = 'google-client-script';
  document.body.appendChild(script);
};

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [focusedField, setFocusedField] = useState('');
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [showAlert, setShowAlert] = useState(false);
  const [alertType, setAlertType] = useState('success');
  const [alertMessage, setAlertMessage] = useState('');


  // Google One Tap state
  const [googleLoading, setGoogleLoading] = useState(false);

  const theme = useTheme();
  const navigate = useNavigate();

  const benefits = [
    { icon: <Shield />, title: 'Secure & Private', color: '#4caf50' },
    { icon: <Rocket />, title: 'Advanced AI Tools', color: '#2196f3' },
    { icon: <Star />, title: 'Premium Features', color: '#ff9800' },
  ];

  // Google button ref for rendering the button
  const googleBtnRef = useRef(null);

  useEffect(() => {
    setMounted(true);
    loadGoogleScript();
  }, []);

  useEffect(() => {
    // Password strength calculation
    let strength = 0;
    const { password } = formData;
    if (password.length >= 8) strength += 20;
    if (password.length >= 12) strength += 10;
    if (/[A-Z]/.test(password)) strength += 20;
    if (/[a-z]/.test(password)) strength += 10;
    if (/[0-9]/.test(password)) strength += 20;
    if (/[^A-Za-z0-9]/.test(password)) strength += 20;
    setPasswordStrength(Math.min(strength, 100));
  }, [formData.password]);

  const handleInputChange = (field) => (e) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
  };

  const validateForm = () => {
    const { name, email, password, confirmPassword } = formData;

    if (!name.trim()) {
      showAlertMessage('error', 'Please enter your full name');
      return false;
    }

    if (!email.includes('@')) {
      showAlertMessage('error', 'Please enter a valid email address');
      return false;
    }

    if (password.length < 8) {
      showAlertMessage('error', 'Password must be at least 8 characters long');
      return false;
    }

    if (password !== confirmPassword) {
      showAlertMessage('error', 'Passwords do not match');
      return false;
    }

    

    return true;
  };

  const showAlertMessage = (type, message) => {
    setAlertType(type);
    setAlertMessage(message);
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 4000);
  };

  // Register user with Supabase and store user details in public "profiles" table
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!validateForm()) return;
  
    setIsLoading(true);
  
    try {
      // Sign up user with Supabase Auth
      const { error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            name: formData.name, // ✅ stored in user_metadata
          },
        },
      });
  
      if (signUpError) {
        setIsLoading(false);
        showAlertMessage('error', signUpError.message || 'Registration failed');
        return;
      }
  
      // 🔍 Verify if name is correctly stored
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();
  
      if (userError) {
        console.error("User fetch error:", userError.message);
      } else {
        console.log("User name from metadata:", user.user_metadata?.name);
      }
  
      // ✅ Redirect to login page
      navigate('/login');
    } catch (err) {
      console.error("Unexpected error:", err.message);
      setIsLoading(false);
      showAlertMessage('error', err.message || 'Registration failed');
    }
  };

  // Google Sign Up Handler (render Google button as in login page)
  useEffect(() => {
    if (!mounted) return;
    if (!window.google || !googleBtnRef.current) return;

    setGoogleLoading(false);

    // Remove any previous button
    googleBtnRef.current.innerHTML = '';

    window.google.accounts.id.initialize({
      client_id: '663732832122-em3m7djoa0rl09jam6htka8pae4v92gq.apps.googleusercontent.com', // <-- Replace with your Google client ID
      callback: handleGoogleCredentialResponse,
      ux_mode: 'popup',
    });

    window.google.accounts.id.renderButton(googleBtnRef.current, {
      theme: theme.palette.mode === 'dark' ? 'filled_black' : 'outline',
      size: 'large',
      text: 'signup_with',
      shape: 'pill',
      width: 340,
      logo_alignment: 'left',
    });
    // eslint-disable-next-line
  }, [mounted, theme.palette.mode]);

  // Handle Google credential response
  const handleGoogleCredentialResponse = async (response) => {
    setGoogleLoading(false);
    if (response.credential) {
      try {
        // Use Supabase to sign in/up with Google credential
        // This will create the user in Supabase Auth and return a session
        const { data, error } = await supabase.auth.signInWithIdToken({
          provider: 'google',
          token: response.credential,
        });

        if (error) {
          showAlertMessage('error', error.message || 'Google sign up failed.');
          return;
        }

        // Insert user details into 'profiles' table if not already present
        // data.user contains id, email, user_metadata, etc.
        if (data?.user) {
          const { id, email, user_metadata } = data.user;
          // Check if profile already exists
          const { data: existingProfile } = await supabase
            .from('profiles')
            .select('id')
            .eq('id', id)
            .single();

          if (!existingProfile) {
            await supabase
              .from('profiles')
              .insert([
                {
                  id,
                  email,
                  name: user_metadata?.name || '',
                },
              ]);
          } else {
            // If profile exists but name is missing, update it
            if (!existingProfile.name && user_metadata?.name) {
              await supabase
                .from('profiles')
                .update({ name: user_metadata.name })
                .eq('id', id);
            }
          }
        }

        showAlertMessage('success', 'Google sign up successful! Redirecting...');
        setTimeout(() => {
          navigate('/login');
        }, 1500);
      } catch (err) {
        showAlertMessage('error', err.message || 'Google sign up failed.');
      }
    } else {
      showAlertMessage('error', 'Google sign up failed.');
    }
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength < 40) return '#f44336';
    if (passwordStrength < 70) return '#ff9800';
    return '#4caf50';
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength === 0) return '';
    if (passwordStrength < 40) return 'Weak';
    if (passwordStrength < 70) return 'Medium';
    return 'Strong';
  };

  const isPasswordMatch = formData.password && formData.confirmPassword && formData.password === formData.confirmPassword;
  const isPasswordMismatch = formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword;

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
        py: { xs: 4, md: 6 },
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `radial-gradient(circle at 25% 75%, ${theme.palette.primary.main}12 0%, transparent 50%),
                       radial-gradient(circle at 75% 25%, ${theme.palette.secondary.main}12 0%, transparent 50%)`,
          animation: 'float 20s ease-in-out infinite',
        },
        '@keyframes float': {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-15px) rotate(2deg)' },
        },
      }}
    >
      {/* Theme Toggle in top right corner */}
      <Box sx={{ position: 'absolute', top: 20, right: 20, zIndex: 10 }}>
        <ThemeToggle />
      </Box>

      <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
        <Fade in={mounted} timeout={800}>
          <Box>
            {/* Header Section */}
            <Slide direction="down" in={mounted} timeout={1000}>
              <Stack spacing={3} textAlign="center" sx={{ mb: 4 }}>
                <Avatar
                  sx={{
                    width: 90,
                    height: 90,
                    mx: 'auto',
                    background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                    animation: 'pulse 2s infinite',
                    '@keyframes pulse': {
                      '0%, 100%': { transform: 'scale(1)' },
                      '50%': { transform: 'scale(1.08)' },
                    },
                  }}
                >
                  <PersonAdd sx={{ fontSize: '3rem' }} />
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
                  Join the Future
                </Typography>
                
                <Typography variant="h6" color="white" sx={{ opacity: 0.9 }}>
                  Create your account to start exploring amazing AI tools ✨
                </Typography>

                {/* Benefits Pills */}
                <Stack direction="row" justifyContent="center" spacing={1} flexWrap="wrap">
                  {benefits.map((benefit, index) => (
                    <Fade key={index} in={mounted} timeout={1200 + index * 200}>
                      <Chip
                        icon={benefit.icon}
                        label={benefit.title}
                        size="small"
                        sx={{
                          bgcolor: `${benefit.color}20`,
                          color: benefit.color,
                          border: `1px solid ${benefit.color}40`,
                          fontWeight: 600,
                          '&:hover': {
                            bgcolor: `${benefit.color}30`,
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
                  severity={alertType}
                  sx={{ mb: 3, borderRadius: 2 }}
                  onClose={() => setShowAlert(false)}
                >
                  {alertMessage}
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
                    animation: 'slide 4s infinite',
                  },
                  '@keyframes slide': {
                    '0%': { left: '-100%' },
                    '100%': { left: '100%' },
                  },
                }}
              >
                <Stack component="form" onSubmit={handleSubmit} spacing={3}>
                  {/* Name Field */}
                  <TextField
                    required
                    fullWidth
                    id="name"
                    label="Full Name"
                    type="text"
                    value={formData.name}
                    onChange={handleInputChange('name')}
                    onFocus={() => setFocusedField('name')}
                    onBlur={() => setFocusedField('')}
                    autoComplete="name"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Person 
                            sx={{ 
                              color: focusedField === 'name' ? theme.palette.primary.main : 'text.secondary',
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

                  {/* Email Field */}
                  <TextField
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange('email')}
                    onFocus={() => setFocusedField('email')}
                    onBlur={() => setFocusedField('')}
                    autoComplete="email"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Email 
                            sx={{ 
                              color: focusedField === 'email' ? theme.palette.primary.main : 'text.secondary',
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

                  {/* Password Field */}
                  <Box>
                    <TextField
                      required
                      fullWidth
                      id="password"
                      label="Password"
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={handleInputChange('password')}
                      onFocus={() => setFocusedField('password')}
                      onBlur={() => setFocusedField('')}
                      autoComplete="new-password"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Lock 
                              sx={{ 
                                color: focusedField === 'password' ? theme.palette.primary.main : 'text.secondary',
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
                    {formData.password && (
                      <Fade in={Boolean(formData.password)}>
                        <Box sx={{ mt: 1 }}>
                          <LinearProgress
                            variant="determinate"
                            value={passwordStrength}
                            sx={{
                              height: 6,
                              borderRadius: 3,
                              backgroundColor: 'grey.200',
                              '& .MuiLinearProgress-bar': {
                                backgroundColor: getPasswordStrengthColor(),
                                borderRadius: 3,
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
                            Password Strength: {getPasswordStrengthText()}
                          </Typography>
                        </Box>
                      </Fade>
                    )}
                  </Box>

                  {/* Confirm Password Field */}
                  <TextField
                    required
                    fullWidth
                    id="confirmPassword"
                    label="Confirm Password"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={handleInputChange('confirmPassword')}
                    onFocus={() => setFocusedField('confirmPassword')}
                    onBlur={() => setFocusedField('')}
                    autoComplete="new-password"
                    error={isPasswordMismatch}
                    helperText={isPasswordMismatch ? 'Passwords do not match' : ''}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Lock 
                            sx={{ 
                              color: isPasswordMatch ? '#4caf50' : 
                                     isPasswordMismatch ? '#f44336' :
                                     focusedField === 'confirmPassword' ? theme.palette.primary.main : 'text.secondary',
                              transition: 'color 0.3s ease'
                            }} 
                          />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            edge="end"
                            sx={{ mr: 1 }}
                          >
                            {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                          {formData.confirmPassword && (
                            isPasswordMatch ? 
                            <CheckCircle sx={{ color: '#4caf50' }} /> :
                            <Error sx={{ color: '#f44336' }} />
                          )}
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

                  

                  {/* Register Button */}
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    size="large"
                    disabled={isLoading}
                    startIcon={isLoading ? null : <PersonAdd />}
                    sx={{
                      mt: 3,
                      py: 1.5,
                      borderRadius: 2,
                      fontSize: '1.1rem',
                      fontWeight: 600,
                      background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                      boxShadow: `0 8px 32px ${theme.palette.primary.main}40`,
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
                        Creating Account...
                      </Box>
                    ) : (
                      'Create Account'
                    )}
                  </Button>

                  {/* Divider */}
                  <Divider sx={{ my: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      or sign up with
                    </Typography>
                  </Divider>

                  {/* Social Registration Buttons */}
                  <Stack direction="row" spacing={2} justifyContent="center">
                    <Box
                      ref={googleBtnRef}
                      sx={{
                        width: '100%',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        minHeight: 44,
                      }}
                    />
                  </Stack>

                  {/* Footer Link */}
                  <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ mt: 3 }}>
                    Already have an account?{' '}
                    <Link
                      component={RouterLink}
                      to="/login"
                      sx={{
                        color: theme.palette.primary.main,
                        textDecoration: 'none',
                        fontWeight: 600,
                        '&:hover': {
                          textDecoration: 'underline',
                        },
                      }}
                    >
                      Sign in here
                    </Link>
                  </Typography>
                </Stack>
              </Paper>
            </Slide>
          </Box>
        </Fade>
      </Container>
      <style>
        {`@keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }`}
      </style>
    </Box>
  );
}