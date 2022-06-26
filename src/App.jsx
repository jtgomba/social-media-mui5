import React from "react";
import { Container } from "@mui/material";
import { Routes, Route, Navigate } from "react-router-dom";

import { Home, PostDetails, CreatorOrTag } from "./pages/";
import { Navbar, Auth } from "./components/";
import { AuthProvider } from "./context/AuthContext";
import { PostProvider } from "./context/PostContext";

const App = () => {
  return (
    <Container maxWidth={false}>
      <AuthProvider>
        <PostProvider>
          <Navbar />
          <Routes>
            <Route path="/" element={<Navigate to="/posts" replace />} />
            <Route path="/posts" index element={<Home />} />
            <Route path="/posts/:postId" element={<PostDetails />} />
            <Route path="auth" element={<Auth />} />
            <Route path="/creator/:name" element={<CreatorOrTag />} />
            <Route path="/tags/:name" element={<CreatorOrTag />} />
          </Routes>
        </PostProvider>
      </AuthProvider>
    </Container>
  );
};

export default App;
