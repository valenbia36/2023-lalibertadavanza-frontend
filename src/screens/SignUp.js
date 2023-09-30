import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import {
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
} from "@mui/material";
import { useSnackbar } from "notistack";

const defaultTheme = createTheme();

const SignUp = () => {
  const { enqueueSnackbar } = useSnackbar();

  const [user, setUser] = React.useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    age: "",
    sex: "",
    height: "",
    weight: "",
  });

  const handleRegister = () => {
    if (
      user.firstName === "" ||
      user.lastName === "" ||
      user.email === "" ||
      user.password === "" ||
      user.sex === "" ||
      user.age === "" ||
      user.height === "" ||
      user.weight === ""
    ) {
      enqueueSnackbar("Some fields are empty.", { variant: "error" });
      return;
    }
    fetch("http://localhost:3001/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    }).then(function (response) {
      if (response.status === 200) {
        enqueueSnackbar("Registered successfully.", { variant: "success" });
        window.location.replace("/");
      } else {
        enqueueSnackbar("Something went wrong.", { variant: "error" });
      }
    });
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography
            component="h1"
            variant="h5"
            style={{ color: "black", fontWeight: "bold" }}
          >
            Sign up
          </Typography>
          <Box sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="given-name"
                  name="firstName"
                  required
                  fullWidth
                  id="firstName"
                  label="First Name"
                  InputLabelProps={{
                    style: { color: "black" },
                  }}
                  InputProps={{
                    style: { color: "black" },
                  }}
                  autoFocus
                  onChange={(e) =>
                    setUser({ ...user, firstName: e.target.value })
                  }
                  onKeyPress={(event) => {
                    if (event.key === "Enter") {
                      handleRegister();
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="lastName"
                  label="Last Name"
                  name="lastName"
                  autoComplete="family-name"
                  InputLabelProps={{
                    style: { color: "black" },
                  }}
                  InputProps={{
                    style: { color: "black" },
                  }}
                  onChange={(e) =>
                    setUser({ ...user, lastName: e.target.value })
                  }
                  onKeyPress={(event) => {
                    if (event.key === "Enter") {
                      handleRegister();
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  InputLabelProps={{
                    style: { color: "black" },
                  }}
                  InputProps={{
                    style: { color: "black" },
                  }}
                  onChange={(e) => setUser({ ...user, email: e.target.value })}
                  onKeyPress={(event) => {
                    if (event.key === "Enter") {
                      handleRegister();
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                  InputLabelProps={{
                    style: { color: "black" },
                  }}
                  InputProps={{
                    style: { color: "black" },
                  }}
                  onChange={(e) =>
                    setUser({ ...user, password: e.target.value })
                  }
                  onKeyPress={(event) => {
                    if (event.key === "Enter") {
                      handleRegister();
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="age"
                  label="Age"
                  name="age"
                  type="number"
                  InputLabelProps={{
                    style: { color: "black" },
                  }}
                  InputProps={{
                    style: { color: "black", min: 0 },
                  }}
                  onChange={(e) => setUser({ ...user, age: e.target.value })}
                  onKeyPress={(event) => {
                    if (event.key === "Enter") {
                      handleRegister();
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl>
                  <FormLabel style={{ color: "black" }}>Sex</FormLabel>
                  <FormGroup row>
                    <FormControlLabel
                      control={
                        <Checkbox
                          name="sex"
                          value="male"
                          color="primary"
                          style={{ color: "black" }}
                          onChange={(e) => setUser({ ...user, sex: "male" })}
                        />
                      }
                      label="Male"
                      style={{ color: "black" }}
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          name="sex"
                          value="female"
                          color="primary"
                          style={{ color: "black" }}
                          onChange={(e) => setUser({ ...user, sex: "female" })}
                        />
                      }
                      label="Female"
                      style={{ color: "black" }}
                    />
                  </FormGroup>
                </FormControl>
              </Grid>
              <Grid item xs={6} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="height"
                  label="Height (cm)"
                  name="height"
                  type="number"
                  InputLabelProps={{
                    style: { color: "black" },
                  }}
                  InputProps={{
                    style: {
                      color: "black",
                      min: 0,
                    },
                  }}
                  onChange={(e) => setUser({ ...user, height: e.target.value })}
                  onKeyPress={(event) => {
                    if (event.key === "Enter") {
                      handleRegister();
                    }
                  }}
                />
              </Grid>
              <Grid item xs={6} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="weight"
                  label="Weight (kg)"
                  name="weight"
                  type="number"
                  InputLabelProps={{
                    style: { color: "black" },
                  }}
                  InputProps={{
                    style: {
                      color: "black",
                      min: 0,
                    },
                  }}
                  onChange={(e) => setUser({ ...user, weight: e.target.value })}
                  onKeyPress={(event) => {
                    if (event.key === "Enter") {
                      handleRegister();
                    }
                  }}
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                mt: 3,
                mb: 2,
                backgroundColor: "#373D20",
                "&:hover": { backgroundColor: "#373D20" },
                fontWeight: "bold",
              }}
              onClick={handleRegister}
            >
              Sign Up
            </Button>
            <Grid container justifyContent="center">
              <Grid item>
                <Link href="/" variant="body2" sx={{ color: "black" }}>
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default SignUp;
