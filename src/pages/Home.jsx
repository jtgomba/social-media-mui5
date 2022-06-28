import React, { useState, useEffect } from "react";
import {
  Grow,
  Container,
  Grid,
  Paper,
  AppBar,
  TextField,
  Button,
  Box,
  Pagination,
} from "@mui/material";
import { location } from "react-router-dom";
import usePost from "../context/PostContext";

import { Form, Posts } from "../components";

const Home = () => {
  const { searchPosts } = usePost();

  const [tagSearch, setTagSearch] = useState("");

  const handleTagSearch = () => {
    if (tagSearch) {
      const queryObject = { queryType: "tags", q: tagSearch };
      searchPosts(queryObject);
    }
  };

  return (
    <Grow in>
      <Container maxWidth={false}>
        <Grid
          container
          justifyContent="space-between"
          alignItems="stretch"
          spacing={3}
          sx={{
            flexDirection: { xs: "column-reverse", sm: "row" },
          }}
        >
          <Grid item xs={12} sm={6} md={9}>
            <Posts />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <AppBar
              position="static"
              color="inherit"
              sx={{
                borderRadius: 1,
                marginBottom: "1rem",
                display: "flex",
                padding: "16px",
              }}
            >
              <TextField
                name="search"
                variant="outlined"
                label="Search Memories by Tags"
                fullWidth
                value={tagSearch}
                onChange={(e) => setTagSearch(e.target.value.split(","))}
                sx={{ marginBottom: "0.5rem" }}
              />
              <Button
                variant="contained"
                color="primary"
                onClick={handleTagSearch}
              >
                Search
              </Button>
            </AppBar>
            <Form />
            <Paper
              elevation={6}
              sx={{
                borderRadius: 1,
                marginTop: "1rem",
                padding: "16px",
              }}
            >
              <Box sx={{ display: "flex", justifyContent: "center" }}>
                <Pagination count={1} variant="outlined" />
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Grow>
  );
};

export default Home;
