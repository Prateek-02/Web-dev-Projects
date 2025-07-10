import { Box, Typography, Link, Container, IconButton, Stack, Divider } from "@mui/material";
import { GitHub, LinkedIn, Email, Favorite } from "@mui/icons-material";

function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        background: "linear-gradient(135deg, #0f172a 0%, #1e293b 25%, #334155 50%, #475569 75%, #64748b 100%)",
        color: "#fff",
        py: 6,
        mt: 8,
        position: "relative",
        overflow: "hidden",
        boxShadow: "0 -8px 32px rgba(15,23,42,0.25)",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "2px",
          background: "linear-gradient(90deg, transparent, #38bdf8, #0ea5e9, #06b6d4, transparent)",
          animation: "shimmer 3s ease-in-out infinite",
        },
        "@keyframes shimmer": {
          "0%, 100%": { opacity: 0.3 },
          "50%": { opacity: 1 },
        },
      }}
    >
      <Container maxWidth="lg">
        <Stack spacing={4}>
          {/* Main Content */}
          <Stack
            direction={{ xs: "column", sm: "row" }}
            justifyContent="space-between"
            alignItems="center"
            spacing={3}
          >
            {/* Brand Section */}
            <Box sx={{ textAlign: { xs: "center", sm: "left" } }}>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 800,
                  letterSpacing: 1.5,
                  mb: 1,
                  background: "linear-gradient(90deg, #38bdf8, #0ea5e9, #06b6d4)",
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  textShadow: "0 0 20px rgba(56,189,248,0.3)",
                }}
              >
                AI Tools
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: "rgba(255,255,255,0.7)",
                  fontSize: "0.9rem",
                  fontWeight: 500,
                }}
              >
                © 2025 All rights reserved.
              </Typography>
            </Box>

            {/* Social Icons */}
            <Stack direction="row" spacing={2}>
              <IconButton
                component={Link}
                href="https://github.com/Prateek-02"
                target="_blank"
                rel="noopener"
                aria-label="GitHub"
                sx={{
                  color: "#fff",
                  p: 1.5,
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "12px",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  "&:hover": {
                    color: "#fff",
                    background: "linear-gradient(135deg, #333, #555)",
                    borderColor: "#555",
                    transform: "translateY(-2px)",
                    boxShadow: "0 8px 25px rgba(0,0,0,0.3)",
                  },
                }}
              >
                <GitHub sx={{ fontSize: "1.4rem" }} />
              </IconButton>
              
              <IconButton
                component={Link}
                href="https://www.linkedin.com/in/prateekraj02/"
                target="_blank"
                rel="noopener"
                aria-label="LinkedIn"
                sx={{
                  color: "#fff",
                  p: 1.5,
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "12px",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  "&:hover": {
                    color: "#fff",
                    background: "linear-gradient(135deg, #0a66c2, #004182)",
                    borderColor: "#0a66c2",
                    transform: "translateY(-2px)",
                    boxShadow: "0 8px 25px rgba(10,102,194,0.4)",
                  },
                }}
              >
                <LinkedIn sx={{ fontSize: "1.4rem" }} />
              </IconButton>
              
              <IconButton
                aria-label="Email"
                onClick={() => {
                  window.location.href = "mailto:prateekrajgrd74@gmail.com";
                }}
                sx={{
                  color: "#fff",
                  p: 1.5,
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "12px",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  "&:hover": {
                    color: "#fff",
                    background: "linear-gradient(135deg, #ea4335, #c23321)",
                    borderColor: "#ea4335",
                    transform: "translateY(-2px)",
                    boxShadow: "0 8px 25px rgba(234,67,53,0.4)",
                  },
                }}
              >
                <Email sx={{ fontSize: "1.4rem" }} />
              </IconButton>
            </Stack>
          </Stack>

          {/* Divider */}
          <Divider 
            sx={{ 
              borderColor: "rgba(255,255,255,0.1)",
              borderWidth: "1px",
            }} 
          />

          {/* Bottom Section */}
          <Stack
            direction={{ xs: "column", sm: "row" }}
            justifyContent="space-between"
            alignItems="center"
            spacing={2}
          >
            <Typography
              variant="body2"
              sx={{
                color: "rgba(255,255,255,0.6)",
                fontSize: "0.9rem",
                fontWeight: 400,
              }}
            >
              Built with passion for innovation and excellence
            </Typography>
            
            <Stack
              direction="row"
              alignItems="center"
              spacing={1}
              sx={{
                color: "rgba(255,255,255,0.7)",
                fontSize: "0.9rem",
              }}
            >
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                Made with
              </Typography>
              <Favorite
                sx={{
                  fontSize: "1rem",
                  color: "#ef4444",
                  animation: "heartbeat 2s ease-in-out infinite",
                  "@keyframes heartbeat": {
                    "0%, 100%": { transform: "scale(1)" },
                    "50%": { transform: "scale(1.1)" },
                  },
                }}
              />
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                by Prateek
              </Typography>
            </Stack>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}

export default Footer;