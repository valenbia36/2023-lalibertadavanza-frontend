import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./screens/Login";
import SignUp from "./screens/SignUp";
import Main from "./screens/Main";
import ResetPassword from "./screens/ResetPassword";
import Statistics from "./screens/Statistics";
import MyProfile from "./screens/MyProfile";
import Recipes from "./screens/Recipes";
import "./styles/Home.css";
import { SnackbarProvider, closeSnackbar } from "notistack";
import Meals from "./screens/Meals";
import { ThemeProvider, createTheme } from "@mui/material";
import Planner from "./screens/Planner";
import ProtectedRoute from "./ProtectedRoute";

const customTheme = createTheme({
  typography: {
    fontFamily: '"Open Sans", sans-serif',
  },
});

export default function App() {
  return (
    <ThemeProvider theme={customTheme}>
      <div className="Home-header" style={{ backgroundColor: "#CECFC7" }}>
        <SnackbarProvider
          action={(snackbarId) => (
            <button
              onClick={() => {
                closeSnackbar(snackbarId);
              }}
            >
              Dismiss
            </button>
          )}
        >
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="signUp" element={<SignUp />} />
            <Route
              path="main"
              element={
                <ProtectedRoute>
                  <Main />
                </ProtectedRoute>
              }
            />
            <Route
              path="meals"
              element={
                <ProtectedRoute>
                  <Meals />
                </ProtectedRoute>
              }
            />
            <Route
              path="recipes"
              element={
                <ProtectedRoute>
                  <Recipes />
                </ProtectedRoute>
              }
            />
            <Route
              path="myPlanner"
              element={
                <ProtectedRoute>
                  <Planner />
                </ProtectedRoute>
              }
            />
            <Route path="resetPassword" element={<ResetPassword />} />
            <Route
              path="statistics"
              element={
                <ProtectedRoute>
                  <Statistics />
                </ProtectedRoute>
              }
            />
            <Route
              path="myProfile"
              element={
                <ProtectedRoute>
                  <MyProfile />
                </ProtectedRoute>
              }
            />
          </Routes>
        </SnackbarProvider>
      </div>
    </ThemeProvider>
  );
}
