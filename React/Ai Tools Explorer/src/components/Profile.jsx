import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import {
  TextField,
  Button,
  Container,
  Typography,
  Stack,
  Alert,
  Paper,
  Box,
  Avatar,
  Divider,
  InputAdornment,
  IconButton,
  Fade,
} from "@mui/material";
import {
  Person,
  Email,
  Lock,
  Visibility,
  VisibilityOff,
  Edit,
  Security,
  AccountCircle,
  ArrowBack,
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";

// Gradient and Styled Components (unchanged)
const GradientBox = styled(Box)(({ theme }) => ({
  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  borderRadius: theme.spacing(3),
  padding: theme.spacing(4),
  color: "white",
  marginBottom: theme.spacing(3),
  position: "relative",
  overflow: "hidden",
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(255, 255, 255, 0.1)",
  },
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: theme.spacing(3),
  background: "rgba(255, 255, 255, 0.9)",
  backdropFilter: "blur(10px)",
  border: "1px solid rgba(255, 255, 255, 0.2)",
  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
}));

const AnimatedButton = styled(Button)(({ theme }) => ({
  borderRadius: theme.spacing(2),
  padding: theme.spacing(1.5, 4),
  textTransform: "none",
  fontWeight: 600,
  fontSize: "1rem",
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: "0 8px 25px rgba(0, 0, 0, 0.15)",
  },
  "&:active": {
    transform: "translateY(0)",
  },
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    borderRadius: theme.spacing(2),
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    transition: "all 0.3s ease",
    "&:hover": {
      backgroundColor: "rgba(255, 255, 255, 0.95)",
      "& .MuiOutlinedInput-notchedOutline": {
        borderColor: theme.palette.primary.main,
        borderWidth: 2,
      },
    },
    "&.Mui-focused": {
      backgroundColor: "white",
      "& .MuiOutlinedInput-notchedOutline": {
        borderColor: theme.palette.primary.main,
        borderWidth: 2,
      },
    },
    "& .MuiInputBase-input": {
      color: "#000",
    },
  },
  "& .MuiInputLabel-root": {
    fontWeight: 500,
    color: "#000",
  },
  "& .MuiInputLabel-shrink": {
    color: "#000",
  },
  "& .MuiFormHelperText-root": {
    color: "#000",
  },
}));

const Profile = () => {
  const [user, setUser] = useState(null);
  const [name, setName] = useState("");
  const [alertMsg, setAlertMsg] = useState(null);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: userData, error: userError } = await supabase.auth.getUser();

      if (userError) {
        setAlertMsg({ type: "error", text: userError.message });
        return;
      }

      setUser(userData.user);

      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("name")
        .eq("id", userData.user.id)
        .single();

      if (profileError) {
        setAlertMsg({ type: "error", text: profileError.message });
      } else {
        setName(profileData?.name || "");
      }
    };

    fetchProfile();
  }, []);

  const updateProfile = async () => {
    if (!user) return;

    const { error } = await supabase
      .from("profiles")
      .update({ name })
      .eq("id", user.id);

    if (error) {
      setAlertMsg({ type: "error", text: error.message });
    } else {
      setAlertMsg({ type: "success", text: "Profile updated successfully!" });
    }
  };

  const updatePassword = async () => {
    const { error } = await supabase.auth.updateUser({
      password,
    });

    if (error) {
      setAlertMsg({ type: "error", text: error.message });
    } else {
      setAlertMsg({ type: "success", text: "Password updated successfully!" });
      setPassword("");
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
        py: 4,
      }}
    >
      <Container maxWidth="sm">
        <Box sx={{ mb: 2 }}>
          <Button
            startIcon={<ArrowBack />}
            variant="text"
            color="primary"
            onClick={() => navigate("/home")}
            sx={{
              textTransform: "none",
              fontWeight: 500,
              fontSize: "1rem",
              mb: 1,
            }}
          >
            Back to Home
          </Button>
        </Box>

        <GradientBox>
          <Stack direction="column" alignItems="center" spacing={2}>
            <Avatar
              sx={{
                width: 80,
                height: 80,
                bgcolor: "rgba(255, 255, 255, 0.2)",
                border: "3px solid rgba(255, 255, 255, 0.3)",
                fontSize: "2rem",
              }}
            >
              <AccountCircle sx={{ fontSize: "3rem" }} />
            </Avatar>
            <Typography variant="h4" fontWeight="bold" textAlign="center">
              Profile Settings
            </Typography>
            <Typography
              variant="body1"
              sx={{ opacity: 0.9, textAlign: "center" }}
            >
              Manage your account information
            </Typography>
          </Stack>
        </GradientBox>

        <Fade in={!!alertMsg} timeout={500}>
          <Box sx={{ mb: 3 }}>
            {alertMsg && (
              <Alert severity={alertMsg.type} onClose={() => setAlertMsg(null)}>
                {alertMsg.text}
              </Alert>
            )}
          </Box>
        </Fade>

        <StyledPaper elevation={0}>
          <Stack spacing={4}>
            {/* Personal Information */}
            <Box>
              <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
                <Person sx={{ color: "primary.main", fontSize: "1.5rem" }} />
                <Typography variant="h6" fontWeight="bold" color="primary">
                  Personal Information
                </Typography>
              </Stack>

              <Stack spacing={3}>
                <StyledTextField
                  label="Email Address"
                  value={user?.email || ""}
                  InputProps={{
                    readOnly: true,
                    startAdornment: (
                      <InputAdornment position="start">
                        <Email sx={{ color: "text.secondary" }} />
                      </InputAdornment>
                    ),
                  }}
                  fullWidth
                  helperText="Email cannot be changed"
                />

                <StyledTextField
                  label="Display Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Person sx={{ color: "text.secondary" }} />
                      </InputAdornment>
                    ),
                    endAdornment: name && (
                      <InputAdornment position="end">
                        <Edit sx={{ color: "primary.main", fontSize: "1.2rem" }} />
                      </InputAdornment>
                    ),
                  }}
                  fullWidth
                  placeholder="Enter your display name"
                />

                <AnimatedButton
                  variant="contained"
                  size="large"
                  onClick={updateProfile}
                  fullWidth
                  sx={{
                    background: "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)",
                    color: "white",
                    py: 1.5,
                  }}
                >
                  Update Profile
                </AnimatedButton>
              </Stack>
            </Box>

            <Divider sx={{ my: 2 }}>
              <Typography variant="body2" color="text.secondary" sx={{ px: 2 }}>
                Security Settings
              </Typography>
            </Divider>

            {/* Password Settings */}
            <Box>
              <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
                <Security sx={{ color: "error.main", fontSize: "1.5rem" }} />
                <Typography variant="h6" fontWeight="bold" color="error.main">
                  Password Settings
                </Typography>
              </Stack>

              <Stack spacing={3}>
                <StyledTextField
                  label="New Password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock sx={{ color: "text.secondary" }} />
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
                  fullWidth
                  placeholder="Enter new password"
                  helperText="Choose a strong password for your account"
                />

                <AnimatedButton
                  variant="outlined"
                  size="large"
                  onClick={updatePassword}
                  fullWidth
                  sx={{
                    borderWidth: 2,
                    borderColor: "error.main",
                    color: "error.main",
                    py: 1.5,
                    "&:hover": {
                      backgroundColor: "error.main",
                      color: "white",
                    },
                  }}
                >
                  Update Password
                </AnimatedButton>
              </Stack>
            </Box>
          </Stack>
        </StyledPaper>
      </Container>
    </Box>
  );
};

export default Profile;
