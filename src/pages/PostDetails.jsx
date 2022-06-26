import React, { useState } from "react";
import { Paper, Typography, Divider, Box, Stack } from "@mui/material";
import { Link, useParams } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";

import usePost from "../context/PostContext";

const PostDetails = () => {
  let { postId } = useParams();
  const { getPost, post } = usePost();

  if (!post.title) {
    getPost(postId);
    return <CircularProgress />;
  }

  return (
    <Paper sx={{ padding: "20px", borderRadius: "15px" }} elevation={6}>
      <Stack direction={{ xs: "column", md: "row" }} spacing={1}>
        <Box
          sx={{
            borderRadius: "20px",
            margin: "10px",
            flex: 1,
          }}
        >
          <Typography variant="h3" component="h2">
            {post.title}
          </Typography>
          <Typography
            gutterBottom
            variant="h6"
            color="textSecondary"
            component="h2"
          >
            {post.tags.map((tag, i) => (
              <Link
                key={i}
                to={`/tags/${tag}`}
                style={{ textDecoration: "none", color: "#3f51b5" }}
              >
                {` #${tag} `}
              </Link>
            ))}
          </Typography>
          <Typography gutterBottom variant="body1" component="p">
            {post.message}
          </Typography>
          <Typography variant="h6" gutterBottom>
            Created by:
            <Link
              to={`/creator/${post.name}`}
              style={{ textDecoration: "none", color: "#3f51b5" }}
            >
              {` ${post.name}`}
            </Link>
          </Typography>
          <Typography variant="body1">
            {new Date(post.createdAt?.seconds * 1000).toDateString()}
          </Typography>
          <Divider style={{ margin: "20px 0" }} />
          Comment Section
          <Divider style={{ margin: "20px 0" }} />
        </Box>
        <Box
          component="img"
          src={post.imageLocation}
          alt={post.title}
          sx={{
            borderRadius: "20px",
            objectFit: "cover",
            width: "100%",
            maxWidth: "600px",
            maxHeight: "600px",
          }}
        />
      </Stack>
      <Box sx={{ borderRadius: "20px", margin: "10px", flex: 1 }}>
        <Typography gutterBottom variant="h5">
          You might also like:
        </Typography>
        <Divider />
        {/*         <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={{ xs: 1, sm: 2, md: 4 }}
          sx={{
            mt: "15px",
          }}
        >
          <Paper sx={{ cursor: "pointer", padding: "10px", maxWidth: "250px" }}>
            <Stack>
              <Typography gutterBottom variant="h6">
                {post.title}
              </Typography>
              <Typography gutterBottom variant="subtitle2">
                {post.name}
              </Typography>
              <Typography gutterBottom variant="subtitle2">
                {post.message}
              </Typography>
              <Typography gutterBottom variant="subtitle1">
                Likes: 4
              </Typography>
              <img
                src={post.image}
                alt={post.title}
                width="200px"
                style={{ alignSelf: "center" }}
              />
            </Stack>
          </Paper>
        </Stack> */}
      </Box>
    </Paper>
  );
};

export default PostDetails;
