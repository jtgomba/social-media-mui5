import React from "react";
import {
  AppBar,
  Typography,
  Toolbar,
  Avatar,
  Button,
  Box,
} from "@mui/material";
import { deepPurple } from "@mui/material/colors";
import { createTheme } from "@mui/material/styles";
import { Link, useNavigate, useLocation } from "react-router-dom";

import memoriesLogo from "../../assets/memories-Logo.png";
import memoriesText from "../../assets/memories-Text.png";
import useAuth from "../../context/AuthContext";

const theme = createTheme();

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  let navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  /* useEffect(() => {
    const token = user?.token;

    if (token) {
      const decodedToken = decode(token);
      if (decodedToken.exp * 1000 < new Date().getTime()) logout();
    }

    setUser(JSON.parse(localStorage.getItem("profile")));
  }, [location, logout, user?.token]);
 */

  return (
    <AppBar
      position="static"
      color="inherit"
      sx={{
        borderRadius: 3,
        margin: "30px 0",
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        justifyContent: "space-between",
        alignItems: "center",
        padding: "10px 30px",
      }}
    >
      <Box
        component={Link}
        to="/"
        sx={{ display: "flex", alignItems: "center" }}
      >
        <Box
          component="img"
          sx={{
            marginLeft: "10px",
            height: "45px",
          }}
          alt="icon"
          src={memoriesText}
        />
        <Box
          component="img"
          sx={{
            marginLeft: "10px",
            marginTop: "5px",
            height: "40px",
          }}
          alt="icon"
          src={memoriesLogo}
        />
      </Box>
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          width: { xs: "auto", md: "400px" },
        }}
      >
        {user.uid ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: { xs: "center", md: "space-between" },
              width: { xs: "auto", md: "400px" },
              alignItems: "center",
            }}
          >
            <Avatar
              alt={user?.displayName}
              src={user?.imageUrl}
              sx={{
                backgroundColor: deepPurple[500],
              }}
            >
              {user.displayName?.charAt(0)}
            </Avatar>
            <Typography
              variant="h6"
              sx={{
                display: "flex",
                alignItems: "center",
                textAlign: "center",
              }}
            >
              {user?.displayName}
            </Typography>
            <Button
              variant="contained"
              color="secondary"
              onClick={handleLogout}
              sx={{
                marginLeft: "20px",
              }}
            >
              Logout
            </Button>
          </Box>
        ) : (
          <Button
            component={Link}
            to="/auth"
            variant="contained"
            color="primary"
          >
            Sign in
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
