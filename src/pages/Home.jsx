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

import { Form, Posts } from "../components";

const Home = () => {
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
                label="Search Memories"
                fullWidth
                sx={{ marginBottom: "0.5rem" }}
              />
              <Button variant="contained" color="primary">
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
                <Pagination count={5} variant="outlined" />
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Grow>
  );
};

export default Home;
