import React, { useEffect } from "react";
import { Grid, Box } from "@mui/material";

import Post from "./Post/Post";
import usePost from "../../context/PostContext";
import CircularProgress from "@mui/material/CircularProgress";

const Posts = () => {
  const { getPosts, posts } = usePost();

  useEffect(() => {
    getPosts();
  }, []);

  return (
    <Grid
      sx={{
        display: "flex",
        alignItems: "center",
      }}
      container
      alignItems="stretch"
      spacing={3}
    >
      {posts.length === 0 ? (
        <Box sx={{ position: "absolute", top: "50vh", left: "50vw" }}>
          <CircularProgress />
        </Box>
      ) : (
        posts?.map((post, index) => (
          <Grid key={index} item xs={12} sm={12} md={6} lg={3}>
            <Post post={post} />
          </Grid>
        ))
      )}
    </Grid>
  );
};

export default Posts;
