import React, { useState } from "react";
import {
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Button,
  Typography,
  ButtonBase,
  Box,
} from "@mui/material";
import {
  ThumbUpAlt,
  Delete,
  MoreHoriz,
  ThumbUpAltOutlined,
} from "@mui/icons-material/";

import about4 from "../../../assets/about04.png";

const Post = ({ post }) => {
  return (
    <Card
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        borderRadius: "15px",
        height: "100%",
        position: "relative",
      }}
      raised
      elevation={6}
    >
      <ButtonBase
        component="span"
        sx={{
          display: "block",
          textAlign: "initial",
        }}
      >
        <CardMedia
          sx={{
            height: 0,
            paddingTop: "56.25%",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            backgroundBlendMode: "darken",
          }}
          image={post.image}
          title={post.title}
        />
        <Box
          sx={{
            position: "absolute",
            top: "20px",
            left: "20px",
            color: "white",
          }}
        >
          <Typography variant="h6">{post.name}</Typography>
          <Typography variant="body2">{post.createdAt}</Typography>
        </Box>

        <Box
          sx={{
            position: "absolute",
            top: "20px",
            right: "20px",
            color: "white",
          }}
        >
          <Button style={{ color: "white" }} size="small">
            <MoreHoriz fontSize="medium" />
          </Button>
        </Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            margin: "20px",
          }}
        >
          <Typography variant="body2" color="textSecondary" component="h2">
            {post.tags.map((tag) => `#${tag} `)}
          </Typography>
        </Box>
        <Typography
          sx={{ padding: "0 16px" }}
          gutterBottom
          variant="h5"
          component="h2"
        >
          {post.title}
        </Typography>
        <CardContent>
          <Typography variant="body2" color="textSecondary" component="p">
            {post.message}
          </Typography>
        </CardContent>
      </ButtonBase>
      <CardActions
        sx={{
          padding: "0 16px 8px 16px",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Button size="small" color="primary">
          {/* <Likes /> */}
        </Button>
        <Button size="small" color="secondary">
          <Delete fontSize="small" /> Delete
        </Button>
      </CardActions>
    </Card>
  );
};

export default Post;
