import React from "react";
import { Container } from "@mui/material";
import { Routes, Route, Navigate } from "react-router-dom";

import PostDetails from "./pages/PostDetails";
import SearchResults from "./components/SearchResults/SearchResults";
import Auth from "./components/Auth/Auth";
import Navbar from "./components/Navbar/Navbar";
import Home from "./pages/Home";

const App = () => {
  return (
    <Container maxWidth="xl">
      <Navbar />
      <Routes>
        <Route path="/" element={<Navigate to="/posts" replace />} />
        <Route path="/posts" index element={<Home />} />
        <Route path="post" element={<PostDetails />} />
        <Route path="searchresults" element={<SearchResults />} />
        <Route path="auth" element={<Auth />} />
      </Routes>
    </Container>
  );
};

export default App;
