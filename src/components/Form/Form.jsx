import React, { useState } from "react";
import {
  TextField,
  Button,
  Typography,
  Paper,
  Box,
  Stack,
} from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";

import useAuth from "../../context/AuthContext";
import usePost from "../../context/PostContext";

const theme = createTheme();

const Form = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { createPost } = usePost();

  const [postData, setPostData] = useState({
    title: "",
    message: "",
    tags: "",
    image: "",
    creatorId: user.uid,
    imageFile: null,
  });

  const handleImage = (e) => {
    setPostData({
      ...postData,
      image: e.target.value,
      imageFile: e.target.files[0],
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    //check if user is logged in
    if (
      postData.title.length > 0 &&
      postData.message.length > 0 &&
      postData.tags.length > 0 &&
      postData.imageFile
    ) {
      createPost(postData);
      clear();
      navigate("/", { replace: true });
    }
  };

  function clear() {
    setPostData({
      title: "",
      message: "",
      tags: "",
      image: "",
      creatorId: user.uid,
      imageFile: null,
    });
  }

  if (!user.uid) {
    return (
      <Paper
        sx={{
          padding: theme.spacing(2),
          borderRadius: 1,
        }}
        elevation={6}>
        <Typography variant="h6" align="center">
          Please Sign In to create your own memories and like others memories.
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper
      sx={{
        padding: theme.spacing(2),
        borderRadius: 1,
      }}
      elevation={6}>
      <form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Stack
          spacing={2}
          sx={{ alignItems: "center", justifyContent: "center" }}>
          <Typography variant="h6">Creating a Memory</Typography>
          <TextField
            name="title"
            variant="outlined"
            label="Title"
            fullWidth
            value={postData.title}
            onChange={(e) =>
              setPostData({ ...postData, title: e.target.value })
            }
          />
          <TextField
            name="message"
            variant="outlined"
            label="Message"
            fullWidth
            multiline
            minRows={4}
            value={postData.message}
            onChange={(e) =>
              setPostData({ ...postData, message: e.target.value })
            }
          />

          <TextField
            name="tags"
            variant="outlined"
            label="Tags"
            fullWidth
            value={postData.tags}
            onChange={(e) =>
              setPostData({ ...postData, tags: e.target.value.split(",") })
            }
          />
          <Box sx={{ width: "97%", margin: "10px 0" }}>
            <input
              type="file"
              id="image"
              name="image"
              value={postData.image}
              onChange={handleImage}
              accept="image/png, image/jpeg, image/jpg"
            />
          </Box>
          <Button
            variant="contained"
            color="primary"
            size="large"
            type="submit"
            fullWidth>
            Submit
          </Button>
          <Button
            variant="contained"
            color="secondary"
            size="small"
            fullWidth
            onClick={clear}>
            Clear
          </Button>
        </Stack>
      </form>
    </Paper>
  );
};

export default Form;
