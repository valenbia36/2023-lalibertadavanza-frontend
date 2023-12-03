import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./screens/Login";
import SignUp from "./screens/SignUp";
import Main from "./screens/Main";
import MainNutritionist from "./screens/MainNutritionist";
import ResetPassword from "./screens/ResetPassword";
import Statistics from "./screens/Statistics";
import MyProfile from './screens/MyProfile'
import Nutritionist from "./screens/Nutritionist";
import "./styles/Home.css";
import { SnackbarProvider } from "notistack";
import Meals from "./screens/Meals";
import { ThemeProvider, createTheme } from "@mui/material";
import RelationshipRequestInbox from "./screens/RelationshipRequestInbox";

const customTheme = createTheme({
  typography: {
    fontFamily: '"Open Sans", sans-serif',
  },
});

export default function App() {
  return (
    <ThemeProvider theme={customTheme}>
    <div className="Home-header" style={{ backgroundColor: "#CECFC7" }}>
      <SnackbarProvider>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="signUp" element={<SignUp />} />
          <Route path="main" element={<Main />} />
          <Route path="mainNutritionist" element={<MainNutritionist />} />
          <Route path="meals" element={<Meals />} />
          <Route path="nutritionist" element={<Nutritionist />} />
          <Route path="resetPassword" element={<ResetPassword />} />
          <Route path="statistics" element={<Statistics />} />
          <Route path="myProfile" element={<MyProfile />} />
          <Route path="relationshipRequestInbox" element={<RelationshipRequestInbox />} />
        </Routes>
      </SnackbarProvider>
    </div>
    </ThemeProvider>
  );
}
