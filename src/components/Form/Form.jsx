import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Typography,
  Paper,
  Box,
  Stack,
} from "@mui/material";
import { createTheme } from "@mui/material/styles";

import useAuth from "../../context/AuthContext";

const theme = createTheme();

const Form = () => {
  const { user } = useAuth();

  if (!user?.name) {
    return (
      <Paper
        sx={{
          padding: theme.spacing(2),
          borderRadius: 1,
        }}
        elevation={6}
      >
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
      elevation={6}
    >
      <form autoComplete="off" noValidate>
        <Stack
          spacing={2}
          sx={{ alignItems: "center", justifyContent: "center" }}
        >
          <Typography variant="h6">Creating a Memory</Typography>
          <TextField name="title" variant="outlined" label="Title" fullWidth />
          <TextField
            name="message"
            variant="outlined"
            label="Message"
            fullWidth
            multiline
            minRows={4}
          />

          <TextField name="tags" variant="outlined" label="Tags" fullWidth />
          <Box sx={{ width: "97%", margin: "10px 0" }}>
            <input
              type="file"
              id="image"
              name="image"
              accept="image/png, image/jpeg"
            />
          </Box>
          <Button
            variant="contained"
            color="primary"
            size="large"
            type="submit"
            fullWidth
          >
            Submit
          </Button>
          <Button variant="contained" color="secondary" size="small" fullWidth>
            Clear
          </Button>
        </Stack>
      </form>
    </Paper>
  );
};

export default Form;
