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
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { useState } from 'react';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const theme = useTheme();

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Implement registration logic
    console.log('Register attempt with:', { name, email, password });
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: theme.palette.mode === 'light' ? 'grey.50' : 'grey.900',
        py: { xs: 4, md: 8 },
      }}
    >
      <Container maxWidth="sm">
        <Stack spacing={4} sx={{ py: 4 }}>
          <Stack spacing={2} textAlign="center">
            <Typography component="h1" variant="h4">
              Create your account
            </Typography>
            <Typography variant="body1" color="text.secondary">
              to start exploring AI tools ✨
            </Typography>
          </Stack>
          <Paper
            component="form"
            onSubmit={handleSubmit}
            elevation={2}
            sx={{ p: 4, borderRadius: 2 }}
          >
            <Stack spacing={3}>
              <TextField
                required
                fullWidth
                id="name"
                label="Full Name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
              />
              <TextField
                required
                fullWidth
                id="email"
                label="Email Address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
              <TextField
                required
                fullWidth
                id="password"
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
              />
              <TextField
                required
                fullWidth
                id="confirmPassword"
                label="Confirm Password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                autoComplete="new-password"
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                sx={{ mt: 2 }}
              >
                Sign up
              </Button>
              <Typography textAlign="center" sx={{ mt: 2 }}>
                Already a user?{' '}
                <Link component={RouterLink} to="/login" color="primary">
                  Login
                </Link>
              </Typography>
            </Stack>
          </Paper>
        </Stack>
      </Container>
    </Box>
  );
} 