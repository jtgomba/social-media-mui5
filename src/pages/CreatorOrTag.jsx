import React, { useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import {
  Typography,
  Grid,
  Divider,
  Box,
  CircularProgress,
} from "@mui/material";

import Post from "../components/Posts/Post/Post";
import usePost from "../context/PostContext";

const CreatorOrTag = () => {
  const { name } = useParams();
  const { posts, searchPosts, loading } = usePost();

  const location = useLocation();

  useEffect(() => {
    if (location.pathname.startsWith("/tags")) {
      const queryObject = { queryType: "oneTag", q: name };
      searchPosts(queryObject);
    } else {
      const queryObject = { queryType: "author", q: name };
      searchPosts(queryObject);
    }
  }, []);

  if (!posts.length && !loading) return "No posts";

  return (
    <div>
      <Typography variant="h2">{name}</Typography>
      <Divider sx={{ margin: "20px 0 50px 0" }} />
      {loading ? (
        <CircularProgress />
      ) : (
        <Grid container alignItems="stretch" spacing={3}>
          {posts?.map((post) => (
            <Grid key={post.id} item xs={12} sm={12} md={6} lg={3}>
              <Post post={post} />
            </Grid>
          ))}
        </Grid>
      )}
    </div>
  );
};

export default CreatorOrTag;
