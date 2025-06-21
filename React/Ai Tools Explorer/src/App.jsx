import { ThemeProvider as MuiThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { useTheme } from './contexts/ThemeContext';
import Welcome from './components/Welcome';
import Login from './components/Login';
import Register from './components/Register';
import Home from './components/Home';
import Profile from './components/Profile';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';
import Bookmarks from './components/Bookmarks';
import ToolDetailPage from './components/ToolDetailPage';
import MyActivityPage from './components/MyActivityPage';

// Dynamic theme creation component
const ThemedApp = () => {
  const { darkMode } = useTheme();

  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
      primary: {
        main: darkMode ? '#667eea' : '#2196f3',
      },
      secondary: {
        main: darkMode ? '#764ba2' : '#f50057',
      },
      background: {
        default: darkMode ? '#0a0a0a' : '#e3f2fd',
        paper: darkMode ? '#1a1a1a' : '#ffffff',
      },
      text: {
        primary: darkMode ? '#ffffff' : '#1a1a1a',
        secondary: darkMode ? '#b0b0b0' : '#666666',
      },
    },
    typography: {
      fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    },
    components: {
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
          },
        },
      },
    },
  });

  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/home" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/bookmarks" element={<Bookmarks />} />
          <Route path="/tool/:toolId" element={<ToolDetailPage />} />
          <Route path="/activity" element={<MyActivityPage />} />
        </Routes>
      </Router>
    </MuiThemeProvider>
  );
};

function App() {
  return (
    <ThemeProvider>
      <ThemedApp />
    </ThemeProvider>
  );
}

export default App;
