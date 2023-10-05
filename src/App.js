import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./screens/Login";
import SignUp from "./screens/SignUp";
import Main from "./screens/Main";
import ResetPassword from "./screens/ResetPassword";
import Statistics from "./screens/Statistics";
import MyProfile from './screens/MyProfile'
import "./styles/Home.css";
import { SnackbarProvider } from "notistack";

export default function App() {
  return (
    <div className="Home-header" style={{ backgroundColor: "#CECFC7" }}>
      <SnackbarProvider>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="signUp" element={<SignUp />} />
          <Route path="main" element={<Main />} />
          <Route path="resetPassword" element={<ResetPassword />} />
          <Route path="statistics" element={<Statistics />} />
          <Route path="myProfile" element={<MyProfile />} />
        </Routes>
      </SnackbarProvider>
    </div>
  );
}
