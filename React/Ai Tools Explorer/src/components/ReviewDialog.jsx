import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  Rating as MuiRating,
  Alert,
  IconButton,
  Chip,
} from '@mui/material';
import { Close, Star } from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { supabase } from '../supabaseClient';
import { analyticsService } from '../services/analyticsService';

const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    borderRadius: theme.spacing(3),
    minWidth: 400,
    maxWidth: 500,
  },
}));

const StyledDialogTitle = styled(DialogTitle)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: theme.spacing(3, 3, 1, 3),
  '& .MuiTypography-root': {
    fontWeight: 600,
  },
}));

const StyledRating = styled(MuiRating)(({ theme }) => ({
  '& .MuiRating-iconFilled': {
    color: '#FFD700',
  },
  '& .MuiRating-iconHover': {
    color: '#FFD700',
  },
}));

const ReviewDialog = ({ 
  open, 
  onClose, 
  tool, 
  existingReview = null,
  onReviewSubmitted 
}) => {
  const [rating, setRating] = useState(existingReview?.rating || 0);
  const [comment, setComment] = useState(existingReview?.comment || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Get current user
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });
  }, []);

  useEffect(() => {
    if (existingReview) {
      setRating(existingReview.rating);
      setComment(existingReview.comment);
    } else {
      setRating(0);
      setComment('');
    }
    setError('');
  }, [existingReview, open]);

  const handleSubmit = async () => {
    if (!user) {
      setError('You must be logged in to submit a review.');
      return;
    }

    if (rating === 0) {
      setError('Please select a rating.');
      return;
    }

    if (!comment.trim()) {
      setError('Please write a comment.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      if (existingReview) {
        // Update existing review
        const { error } = await supabase
          .from('reviews')
          .update({
            rating,
            comment: comment.trim(),
            updated_at: new Date().toISOString(),
          })
          .eq('id', existingReview.id);

        if (error) throw error;
      } else {
        // Create new review
        const { error } = await supabase
          .from('reviews')
          .insert({
            user_id: user.id,
            tool_id: tool.id,
            rating,
            comment: comment.trim(),
          });

        if (error) throw error;
      }

      // Track review submission
      await analyticsService.trackReview(tool.id);

      onReviewSubmitted();
      onClose();
    } catch (error) {
      console.error('Error submitting review:', error);
      setError(error.message || 'Failed to submit review. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
    }
  };

  const getRatingLabel = (value) => {
    const labels = {
      1: 'Poor',
      2: 'Fair',
      3: 'Good',
      4: 'Very Good',
      5: 'Excellent',
    };
    return labels[value] || '';
  };

  return (
    <StyledDialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <StyledDialogTitle>
        <Box>
          <Typography variant="h6">
            {existingReview ? 'Edit Review' : 'Write a Review'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {tool?.name}
          </Typography>
        </Box>
        <IconButton onClick={handleClose} disabled={isSubmitting}>
          <Close />
        </IconButton>
      </StyledDialogTitle>

      <DialogContent sx={{ px: 3, py: 2 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600 }}>
            Rating *
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <StyledRating
              value={rating}
              onChange={(event, newValue) => setRating(newValue)}
              precision={1}
              size="large"
              icon={<Star sx={{ fontSize: 32 }} />}
            />
            {rating > 0 && (
              <Chip 
                label={getRatingLabel(rating)} 
                color="primary" 
                variant="outlined"
                size="small"
              />
            )}
          </Box>
        </Box>

        <Box>
          <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600 }}>
            Comment *
          </Typography>
          <TextField
            multiline
            rows={4}
            fullWidth
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your experience with this AI tool..."
            variant="outlined"
            disabled={isSubmitting}
            inputProps={{ maxLength: 500 }}
            helperText={`${comment.length}/500 characters`}
          />
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button 
          onClick={handleClose} 
          disabled={isSubmitting}
          variant="outlined"
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={isSubmitting || rating === 0 || !comment.trim()}
          sx={{
            background: 'linear-gradient(45deg, #2196F3, #21CBF3)',
            '&:hover': {
              background: 'linear-gradient(45deg, #1976D2, #0288D1)',
            },
          }}
        >
          {isSubmitting ? 'Submitting...' : (existingReview ? 'Update Review' : 'Submit Review')}
        </Button>
      </DialogActions>
    </StyledDialog>
  );
};

export default ReviewDialog; 