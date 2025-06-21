import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Avatar,
  Chip,
  IconButton,
  Button,
  Divider,
  Skeleton,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Menu,
  MenuItem,
} from '@mui/material';
import {
  Star,
  Edit,
  Delete,
  Person,
  MoreVert,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { supabase } from '../supabaseClient';
import Rating from './Rating';
import ReviewDialog from './ReviewDialog';

const StyledCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  borderRadius: theme.spacing(2),
  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  transition: 'all 0.3s ease',
  '&:hover': {
    boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
    transform: 'translateY(-2px)',
  },
}));

const StyledAvatar = styled(Avatar)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: 'white',
  fontWeight: 'bold',
}));

const ReviewsList = ({ toolId, toolName, onReviewUpdate }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedReview, setSelectedReview] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState(null);

  useEffect(() => {
    // Get current user
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });
  }, []);

  useEffect(() => {
    if (toolId) {
      fetchReviews();
    }
  }, [toolId]);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select(`
          *,
          profiles:user_id (
            id,
            name,
            email
          )
        `)
        .eq('tool_id', toolId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setReviews(data || []);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMenuOpen = (event, review) => {
    setAnchorEl(event.currentTarget);
    setSelectedReview(review);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedReview(null);
  };

  const handleEditReview = () => {
    handleMenuClose();
    setEditDialogOpen(true);
  };

  const handleDeleteReview = () => {
    handleMenuClose();
    setReviewToDelete(selectedReview);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!reviewToDelete) return;

    try {
      const { error } = await supabase
        .from('reviews')
        .delete()
        .eq('id', reviewToDelete.id);

      if (error) throw error;

      setReviews(reviews.filter(review => review.id !== reviewToDelete.id));
      if (onReviewUpdate) {
        onReviewUpdate();
      }
    } catch (error) {
      console.error('Error deleting review:', error);
    } finally {
      setDeleteDialogOpen(false);
      setReviewToDelete(null);
    }
  };

  const handleReviewSubmitted = () => {
    fetchReviews();
    if (onReviewUpdate) {
      onReviewUpdate();
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getUserInitials = (name, email) => {
    if (name) {
      return name.split(' ').map(n => n[0]).join('').toUpperCase();
    }
    return email ? email[0].toUpperCase() : 'U';
  };

  if (loading) {
    return (
      <Box>
        {[...Array(3)].map((_, index) => (
          <StyledCard key={index}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Skeleton variant="circular" width={40} height={40} sx={{ mr: 2 }} />
                <Box sx={{ flex: 1 }}>
                  <Skeleton variant="text" width="60%" />
                  <Skeleton variant="text" width="40%" />
                </Box>
              </Box>
              <Skeleton variant="text" width="100%" />
              <Skeleton variant="text" width="80%" />
            </CardContent>
          </StyledCard>
        ))}
      </Box>
    );
  }

  if (reviews.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
          No reviews yet
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Be the first to review this tool!
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      {reviews.map((review) => (
        <StyledCard key={review.id}>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <StyledAvatar sx={{ mr: 2 }}>
                  {getUserInitials(review.profiles?.name, review.profiles?.email)}
                </StyledAvatar>
                <Box>
                  <Typography variant="subtitle1" fontWeight="600">
                    {review.profiles?.name || 'Anonymous User'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {formatDate(review.created_at)}
                  </Typography>
                </Box>
              </Box>
              
              {user && review.user_id === user.id && (
                <IconButton
                  size="small"
                  onClick={(e) => handleMenuOpen(e, review)}
                >
                  <MoreVert />
                </IconButton>
              )}
            </Box>

            <Box sx={{ mb: 2 }}>
              <Rating 
                value={review.rating} 
                readOnly 
                showValue={false}
                size="small"
              />
            </Box>

            <Typography variant="body1" sx={{ lineHeight: 1.6 }}>
              {review.comment}
            </Typography>

            {review.updated_at && review.updated_at !== review.created_at && (
              <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                Edited on {formatDate(review.updated_at)}
              </Typography>
            )}
          </CardContent>
        </StyledCard>
      ))}

      {/* Edit Review Dialog */}
      <ReviewDialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        tool={{ id: toolId, name: toolName }}
        existingReview={selectedReview}
        onReviewSubmitted={handleReviewSubmitted}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Delete Review</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete your review? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleConfirmDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Review Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleEditReview}>
          <Edit sx={{ mr: 1, fontSize: '1.2rem' }} />
          Edit Review
        </MenuItem>
        <MenuItem onClick={handleDeleteReview} sx={{ color: 'error.main' }}>
          <Delete sx={{ mr: 1, fontSize: '1.2rem' }} />
          Delete Review
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default ReviewsList; 