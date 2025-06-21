import { IconButton, Tooltip, Box } from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';
import { DarkMode, LightMode } from '@mui/icons-material';
import { useTheme } from '../contexts/ThemeContext';

// Animations
const rotate = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const pulse = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
`;

const StyledIconButton = styled(IconButton)(({ theme, darkMode }) => ({
  position: 'relative',
  background: darkMode 
    ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    : 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  color: '#fff',
  width: 48,
  height: 48,
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    transform: 'scale(1.1) rotate(5deg)',
    boxShadow: darkMode
      ? '0 8px 25px rgba(102, 126, 234, 0.4)'
      : '0 8px 25px rgba(245, 87, 108, 0.4)',
  },
  '&:active': {
    transform: 'scale(0.95)',
  },
  '& .MuiSvgIcon-root': {
    animation: `${rotate} 0.6s ease-in-out`,
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    top: -2,
    left: -2,
    right: -2,
    bottom: -2,
    background: darkMode
      ? 'linear-gradient(135deg, #667eea, #764ba2, #667eea)'
      : 'linear-gradient(135deg, #f093fb, #f5576c, #f093fb)',
    borderRadius: '50%',
    zIndex: -1,
    opacity: 0,
    transition: 'opacity 0.3s ease',
  },
  '&:hover::before': {
    opacity: 1,
    animation: `${pulse} 2s infinite`,
  },
}));

const ThemeToggle = () => {
  const { darkMode, toggleDarkMode } = useTheme();

  return (
    <Tooltip 
      title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
      placement="bottom"
      arrow
    >
      <StyledIconButton
        onClick={toggleDarkMode}
        darkMode={darkMode}
        aria-label="toggle theme"
      >
        {darkMode ? <LightMode /> : <DarkMode />}
      </StyledIconButton>
    </Tooltip>
  );
};

export default ThemeToggle; 