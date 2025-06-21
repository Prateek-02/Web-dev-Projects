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
  Fade,
  Slide,
  Avatar,
  Alert,
} from '@mui/material';
import { Email, Send, ArrowBack } from '@mui/icons-material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient.js';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [mounted, setMounted] = useState(false);
  const theme = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');
    setError('');

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    setIsLoading(false);
    if (error) {
      setError(error.message);
    } else {
      setMessage('Password reset link has been sent to your email.');
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: theme.palette.mode === 'light'
          ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
          : 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
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
                    background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  }}
                >
                  <Send />
                </Avatar>
                <Typography component="h1" variant="h4" sx={{ fontWeight: 700 }}>
                  Forgot Password?
                </Typography>
                <Typography color="text.secondary">
                  No worries! Enter your email and we'll send you a reset link.
                </Typography>
              </Stack>
            </Slide>

            <Slide direction="up" in={mounted} timeout={1200}>
              <Stack component="form" onSubmit={handleSubmit} spacing={3}>
                {message && <Alert severity="success">{message}</Alert>}
                {error && <Alert severity="error">{error}</Alert>}

                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Email />
                      </InputAdornment>
                    ),
                  }}
                />

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  size="large"
                  disabled={isLoading}
                  startIcon={isLoading ? null : <Send />}
                  sx={{ py: 1.5, fontWeight: 600 }}
                >
                  {isLoading ? 'Sending...' : 'Send Reset Link'}
                </Button>

                <Stack direction="row" justifyContent="center">
                    <Link
                        component={RouterLink}
                        to="/login"
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            textDecoration: 'none',
                            color: 'primary.main',
                            fontWeight: 500
                        }}
                    >
                        <ArrowBack sx={{ mr: 0.5, fontSize: '1rem' }} />
                        Back to Login
                    </Link>
                </Stack>
              </Stack>
            </Slide>
          </Paper>
        </Fade>
      </Container>
    </Box>
  );
} 