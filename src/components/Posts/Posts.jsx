import React from "react";
import { Grid } from "@mui/material";

import Post from "./Post/Post";
import usePost from "../../context/PostContext";
import CircularProgress from "@mui/material/CircularProgress";

const Posts = () => {
  const { getPosts, posts } = usePost();

  if (!posts.length > 0) {
    getPosts();
  }

  return (
    <Grid
      sx={
        posts.length !== 0
          ? {
              display: "flex",
              alignItems: "center",
            }
          : {
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
            }
      }
      container
      alignItems="stretch"
      spacing={3}
    >
      {posts.length === 0 ? (
        <CircularProgress />
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
