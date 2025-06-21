import { useState } from 'react';
import { Box, Typography, IconButton, Tooltip } from '@mui/material';
import { Star, StarBorder, StarHalf } from '@mui/icons-material';
import { styled } from '@mui/material/styles';

const StyledStar = styled(Star)(({ theme }) => ({
  color: '#FFD700',
  fontSize: '1.2rem',
  transition: 'all 0.2s ease',
  '&:hover': {
    transform: 'scale(1.1)',
  },
}));

const StyledStarBorder = styled(StarBorder)(({ theme }) => ({
  color: '#FFD700',
  fontSize: '1.2rem',
  transition: 'all 0.2s ease',
  '&:hover': {
    transform: 'scale(1.1)',
  },
}));

const StyledStarHalf = styled(StarHalf)(({ theme }) => ({
  color: '#FFD700',
  fontSize: '1.2rem',
  transition: 'all 0.2s ease',
  '&:hover': {
    transform: 'scale(1.1)',
  },
}));

const Rating = ({ 
  value = 0, 
  onChange, 
  readOnly = false, 
  size = 'medium',
  showValue = true,
  showCount = false,
  reviewCount = 0,
  precision = 1
}) => {
  const [hoverValue, setHoverValue] = useState(0);

  const handleMouseEnter = (starValue) => {
    if (!readOnly) {
      setHoverValue(starValue);
    }
  };

  const handleMouseLeave = () => {
    if (!readOnly) {
      setHoverValue(0);
    }
  };

  const handleClick = (starValue) => {
    if (!readOnly && onChange) {
      onChange(starValue);
    }
  };

  const renderStar = (index) => {
    const starValue = index + 1;
    const displayValue = hoverValue || value;
    const isHalfStar = precision === 0.5 && displayValue >= starValue - 0.5 && displayValue < starValue;
    const isFullStar = displayValue >= starValue;

    if (isHalfStar) {
      return (
        <StyledStarHalf
          key={index}
          onMouseEnter={() => handleMouseEnter(starValue - 0.5)}
          onMouseLeave={handleMouseLeave}
          onClick={() => handleClick(starValue - 0.5)}
          sx={{ cursor: readOnly ? 'default' : 'pointer' }}
        />
      );
    }

    if (isFullStar) {
      return (
        <StyledStar
          key={index}
          onMouseEnter={() => handleMouseEnter(starValue)}
          onMouseLeave={handleMouseLeave}
          onClick={() => handleClick(starValue)}
          sx={{ cursor: readOnly ? 'default' : 'pointer' }}
        />
      );
    }

    return (
      <StyledStarBorder
        key={index}
        onMouseEnter={() => handleMouseEnter(starValue)}
        onMouseLeave={handleMouseLeave}
        onClick={() => handleClick(starValue)}
        sx={{ cursor: readOnly ? 'default' : 'pointer' }}
      />
    );
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
      <Box sx={{ display: 'flex' }}>
        {[...Array(5)].map((_, index) => renderStar(index))}
      </Box>
      {showValue && (
        <Typography 
          variant="body2" 
          sx={{ 
            ml: 1, 
            fontWeight: 'medium',
            color: 'text.secondary'
          }}
        >
          {value > 0 ? value.toFixed(1) : 'No ratings'}
        </Typography>
      )}
      {showCount && reviewCount > 0 && (
        <Typography 
          variant="body2" 
          sx={{ 
            ml: 0.5, 
            color: 'text.secondary'
          }}
        >
          ({reviewCount})
        </Typography>
      )}
    </Box>
  );
};

export default Rating; 