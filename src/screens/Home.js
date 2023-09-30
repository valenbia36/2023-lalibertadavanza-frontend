import * as React from "react";
import { Button } from "@mui/material";
import logo from "../images/healthyFoodLogo.avif";
import "../styles/Home.css";

const Home = () => {
  return (
    <div className="Home">
      <header className="Home-header">
        <img src={logo} className="Home-logo" alt="logo" />
        <p>
          <h1>
            <code>HeliApp</code>
          </h1>
          <Button
            href="/Login"
            size="small"
            variant="contained"
            sx={{
              backgroundColor: "#373D20",
              "&:hover": { backgroundColor: "#373D20" },
              fontWeight: "bold",
            }}
          >
            Login
          </Button>
          <Button
            href="/SignUp"
            size="small"
            variant="contained"
            sx={{
              backgroundColor: "#373D20",
              "&:hover": { backgroundColor: "#373D20" },
              fontWeight: "bold",
            }}
          >
            Sign up
          </Button>
        </p>
      </header>
    </div>
  );
};

export default Home;
