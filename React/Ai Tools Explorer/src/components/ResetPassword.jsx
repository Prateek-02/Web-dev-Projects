import {
  Box,
  Button,
  TextField,
  Stack,
  Typography,
  Container,
  Paper,
  useTheme,
  InputAdornment,
  IconButton,
  Fade,
  Slide,
  Avatar,
  Alert,
  LinearProgress,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Lock,
  LockReset,
} from '@mui/icons-material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient.js';

export default function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [mounted, setMounted] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [session, setSession] = useState(null);

  const theme = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    setMounted(true);
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY') {
        setSession(session);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password)) strength += 25;
    if (/[^A-Za-z0-9]/.test(password)) strength += 25;
    setPasswordStrength(strength);
  }, [password]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    if (passwordStrength < 100) {
      setError('Password is not strong enough.');
      return;
    }
    setIsLoading(true);
    setMessage('');
    setError('');

    try {
        const { error } = await supabase.auth.updateUser({ password });

      if (error) {
        setError(error.message);
      } else {
        setMessage('Your password has been reset successfully! You can now log in.');
      }
    } catch (err) {
      setError('An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength < 50) return '#f44336';
    if (passwordStrength < 75) return '#ff9800';
    return '#4caf50';
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: theme.palette.mode === 'light'
          ? 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)'
          : 'linear-gradient(135deg, #0f3460 0%, #16213e 50%, #1a1a2e 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        py: { xs: 4, md: 8 },
      }}
    >
      <Container maxWidth="sm">
        <Fade in={mounted} timeout={800}>
          <Paper
            elevation={24}
            sx={{
              p: 4,
              borderRadius: 3,
              background: `${theme.palette.background.paper}95`,
              backdropFilter: 'blur(10px)',
            }}
          >
            <Slide direction="down" in={mounted} timeout={1000}>
              <Stack spacing={2} textAlign="center" sx={{ mb: 4 }}>
                <Avatar
                  sx={{
                    width: 70,
                    height: 70,
                    mx: 'auto',
                    background: `linear-gradient(45deg, ${theme.palette.secondary.main}, ${theme.palette.primary.main})`,
                  }}
                >
                  <LockReset />
                </Avatar>
                <Typography component="h1" variant="h4" sx={{ fontWeight: 700 }}>
                  Reset Your Password
                </Typography>
                <Typography color="text.secondary">
                  {session ? 'Choose a new, strong password.' : 'Waiting for authentication...'}
                </Typography>
              </Stack>
            </Slide>

            <Slide direction="up" in={mounted} timeout={1200}>
              {session ? (
              <Stack component="form" onSubmit={handleSubmit} spacing={3}>
                {message && <Alert severity="success">{message}</Alert>}
                {error && <Alert severity="error">{error}</Alert>}

                <TextField
                  required
                  fullWidth
                  id="password"
                  label="New Password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock />
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
                />

                {password && (
                  <Box>
                    <LinearProgress
                      variant="determinate"
                      value={passwordStrength}
                      sx={{
                        '& .MuiLinearProgress-bar': {
                          backgroundColor: getPasswordStrengthColor(),
                        },
                      }}
                    />
                  </Box>
                )}

                <TextField
                  required
                  fullWidth
                  id="confirm-password"
                  label="Confirm New Password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock />
                      </InputAdornment>
                    ),
                  }}
                />

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  size="large"
                  disabled={isLoading || Boolean(message)}
                  sx={{ py: 1.5, fontWeight: 600 }}
                >
                  {isLoading ? 'Resetting...' : 'Reset Password'}
                </Button>

                {message && (
                   <Button
                   component={RouterLink}
                   to="/login"
                   variant="outlined"
                   fullWidth
                   >
                   Back to Login
                 </Button>
                )}
              </Stack>
              ) : (
                <Box sx={{ textAlign: 'center' }}>
                  <Typography>Please check your email and click the recovery link to proceed.</Typography>
                </Box>
              )}
            </Slide>
          </Paper>
        </Fade>
      </Container>
    </Box>
  );
} 