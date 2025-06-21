import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient.js";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  Grid,
  Container,
  CircularProgress,
  IconButton,
  Tooltip,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { Launch as LaunchIcon, Delete as DeleteIcon } from "@mui/icons-material";

export default function Bookmarks() {
  const [bookmarkedTools, setBookmarkedTools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();
  }, []);

  useEffect(() => {
    if (user) {
      fetchBookmarkedTools();
    }
  }, [user]);

  const fetchBookmarkedTools = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("bookmarks")
        .select(`
          tool_id,
          ai_tools (
            id,
            name,
            description,
            website_url,
            category
          )
        `)
        .eq("user_id", user.id);

      if (error) throw error;
      
      const tools = data.map(bookmark => bookmark.ai_tools);
      setBookmarkedTools(tools);
    } catch (error) {
      console.error("Error fetching bookmarked tools:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveBookmark = async (toolId) => {
    if (!user) return;
    try {
      const { error } = await supabase
        .from("bookmarks")
        .delete()
        .match({ user_id: user.id, tool_id: toolId });

      if (error) throw error;

      setBookmarkedTools(bookmarkedTools.filter(tool => tool.id !== toolId));
    } catch (error) {
      console.error("Error removing bookmark:", error.message);
    }
  };

  return (
    <Container sx={{ py: 8 }}>
      <Typography variant="h3" component="h1" gutterBottom align="center" sx={{ fontWeight: 700, color: 'primary.main' }}>
        My Bookmarks
      </Typography>
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : bookmarkedTools.length === 0 ? (
        <Typography align="center" sx={{ mt: 4 }}>
          You haven't bookmarked any tools yet.
        </Typography>
      ) : (
        <Grid container spacing={4} sx={{ mt: 4 }}>
          {bookmarkedTools.map((tool) => (
            <Grid item key={tool.id} xs={12} sm={6} md={4}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent>
                  <Typography variant="h5" component="div" gutterBottom>
                    {tool.name}
                  </Typography>
                  <Typography color="text.secondary">
                    {tool.description}
                  </Typography>
                </CardContent>
                <CardActions sx={{ mt: 'auto' }}>
                  <Button
                    component="a"
                    href={tool.website_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    startIcon={<LaunchIcon />}
                  >
                    Visit
                  </Button>
                  <Tooltip title="Remove Bookmark">
                    <IconButton onClick={() => handleRemoveBookmark(tool.id)} sx={{ ml: 'auto' }}>
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
       <Box sx={{ mt: 4, textAlign: 'center' }}>
            <Button component={RouterLink} to="/home" variant="outlined">
                Back to Home
            </Button>
        </Box>
    </Container>
  );
} 