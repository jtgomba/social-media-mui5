import React from "react";
import { Grid } from "@mui/material";

import Post from "./Post/Post";
import about1 from "../../assets/about01.png";
import about2 from "../../assets/about02.png";
import about3 from "../../assets/about03.png";
import about4 from "../../assets/about04.png";

const fakePost = {
  _id: "id",
  name: "Demo User",
  tags: ["tag1", "tag2", "tag3"],
  title: "Tile",
  message: "Message",
  image: about4,
  createdAt: "Yesterday",
};

const posts = [fakePost, fakePost, fakePost, fakePost, fakePost];

const Posts = () => {
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
      {posts.map((post, index) => (
        <Grid key={index} item xs={12} sm={12} md={6} lg={3}>
          <Post post={post} />
        </Grid>
      ))}
    </Grid>
  );
};

export default Posts;
