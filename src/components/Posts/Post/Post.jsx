import React from "react";
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

import { useNavigate } from "react-router-dom";

const Post = ({ post }) => {
  let navigate = useNavigate();

  const openPost = () => navigate(`/posts/${post.id}`, { replace: true });
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
      <Box
        sx={{
          position: "absolute",
          top: "10px",
          right: "10px",
          color: "white",
          zIndex: "5",
        }}
      >
        <Button style={{ color: "white" }} size="small">
          <MoreHoriz fontSize="medium" />
        </Button>
      </Box>
      <ButtonBase
        component="span"
        sx={{
          display: "block",
          textAlign: "initial",
        }}
        onClick={openPost}
      >
        <CardMedia
          sx={{
            height: 0,
            paddingTop: "56.25%",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            backgroundBlendMode: "darken",
          }}
          image={post.imageLocation}
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
          <Typography variant="body2">
            {new Date(post.createdAt?.seconds * 1000).toDateString()}
          </Typography>
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
