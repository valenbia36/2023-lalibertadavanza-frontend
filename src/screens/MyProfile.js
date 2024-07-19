import Drawer from "../components/Menu/Drawer";
import React, { useState, useEffect } from "react";
import { useTheme } from "@mui/material/styles";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import LabelBottomNavigation from "../components/Menu/BottomMenu";
import {
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
} from "@mui/material";
import { useSnackbar } from "notistack";
import getApiUrl from "../helpers/apiConfig";

const apiUrl = getApiUrl();

const defaultTheme = createTheme();

const MyProfile = () => {
  const theme = useTheme();
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth <= theme.breakpoints.values.sm);
    }
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [theme]);

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

  React.useEffect(() => {
    getUserById();
  }, []);

  const getUserById = async () => {
    const response = await fetch(apiUrl + "/api/auth/users/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    });
    if (response.status === 401) {
      // Token ha expirado, desloguear al usuario
      localStorage.removeItem("token");
      localStorage.setItem("sessionExpired", "true");
      window.location.href = "/";
    }
    const data = await response.json();
    setUser(data.data);
  };

  const handleWeightInputChange = (e) => {
    const inputValue = Number(e.target.value);
    if (!isNaN(inputValue) && inputValue >= 1) {
      setUser({ ...user, weight: e.target.value });
    } else {
      setUser({ ...user, weight: "" });
    }
  };

  const handleHeightInputChange = (e) => {
    const inputValue = Number(e.target.value);
    if (!isNaN(inputValue) && inputValue >= 1) {
      setUser({ ...user, height: e.target.value });
    } else {
      setUser({ ...user, height: "" });
    }
  };

  const handleAgeInputChange = (e) => {
    const inputValue = Number(e.target.value);
    if (!isNaN(inputValue) && inputValue >= 1) {
      setUser({ ...user, age: e.target.value });
    } else {
      setUser({ ...user, age: "" });
    }
  };

  const handleSexChange = (event) => {
    setUser({ ...user, sex: event.target.value });
  };

  const handleUpdateUser = () => {
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

    fetch(apiUrl + "/api/auth/users/", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
      body: JSON.stringify(user),
    }).then(function (response) {
      if (response.status === 401) {
        // Token ha expirado, desloguear al usuario
        localStorage.removeItem("token");
        localStorage.setItem("sessionExpired", "true");
        window.location.href = "/";
      }
      if (response.status === 200) {
        enqueueSnackbar("User updated successfully.", { variant: "success" });
        getUserById();
        localStorage.setItem("username", user.firstName + " " + user.lastName);
      } else {
        enqueueSnackbar("Something went wrong.", { variant: "error" });
      }
    });
  };

  return (
    <div className="container">
      {isMobile ? (
        <LabelBottomNavigation />
      ) : (
        <Drawer user={localStorage.getItem("username")} />
      )}
      <ThemeProvider theme={defaultTheme}>
        <Container component="main" maxWidth="s" maxheight="s">
          <CssBaseline />
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
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
                    value={user.firstName}
                    onChange={(e) =>
                      setUser({ ...user, firstName: e.target.value })
                    }
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
                    value={user.lastName}
                    InputLabelProps={{
                      style: { color: "black" },
                    }}
                    InputProps={{
                      style: { color: "black" },
                    }}
                    onChange={(e) =>
                      setUser({ ...user, lastName: e.target.value })
                    }
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
                    value={user.email}
                    InputLabelProps={{
                      style: { color: "black" },
                    }}
                    InputProps={{
                      style: { color: "black" },
                    }}
                    onChange={(e) =>
                      setUser({ ...user, email: e.target.value })
                    }
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
                    value={user.age}
                    InputLabelProps={{
                      style: { color: "black" },
                    }}
                    InputProps={{
                      style: { color: "black" },
                      inputProps: { min: 1 },
                    }}
                    onChange={(e) => handleAgeInputChange(e)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl component="fieldset">
                    <FormLabel style={{ color: "black" }}>Sex</FormLabel>
                    <RadioGroup
                      row
                      aria-label="sex"
                      name="sex"
                      value={user.sex}
                      onChange={handleSexChange}
                    >
                      <FormControlLabel
                        value="male"
                        control={<Radio style={{ color: "black" }} />}
                        label="Male"
                        style={{ color: "black" }}
                      />
                      <FormControlLabel
                        value="female"
                        control={<Radio style={{ color: "black" }} />}
                        label="Female"
                        style={{ color: "black" }}
                      />
                    </RadioGroup>
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
                    value={user.height}
                    InputLabelProps={{
                      style: { color: "black" },
                    }}
                    InputProps={{
                      style: {
                        color: "black",
                      },
                      inputProps: { min: 1 },
                    }}
                    onChange={(e) => handleHeightInputChange(e)}
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
                    value={user.weight}
                    InputLabelProps={{
                      style: { color: "black" },
                    }}
                    InputProps={{
                      style: {
                        color: "black",
                      },
                      inputProps: { min: 1 },
                    }}
                    onChange={(e) => handleWeightInputChange(e)}
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
                onClick={handleUpdateUser}
              >
                Update
              </Button>
            </Box>
          </Box>
        </Container>
      </ThemeProvider>
    </div>
  );
};

export default MyProfile;
