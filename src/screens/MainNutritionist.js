import React, { useState, useEffect } from "react";
import DrawerNutritionist from "../components/Menu/DrawerNutritionist";
import LabelBottomNavigationNutritionist from "../components/Menu/BottomMenuNutritionist";
import { useTheme } from "@mui/material/styles";
import { Button, Grid } from "@mui/material";
import { useNavigate } from "react-router-dom";
import getApiUrl from "../helpers/apiConfig";

const apiUrl = getApiUrl();

const MainNutritionist = () => {
  const theme = useTheme();
  const [isMobile, setIsMobile] = useState(false);
  const [patients, setPatients] = useState([]);
  const navigate = useNavigate();

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

  useEffect(() => {
    handleGetPatientsByNutritionist();
  }, []);

  const handleGetPatientsByNutritionist = async () => {
    const response = await fetch(
      apiUrl +
        "/api/auth/patientsByNutritionistId/" +
        localStorage.getItem("userId"),
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      }
    );
    const data = await response.json();
    setPatients(data.data);
  };

  const boxStyle = {
    border: "1px solid black",
    borderRadius: "5px",
    padding: "10px",
    margin: "10px",
    backgroundColor: "#f9f9f9",
    fontSize: "18px",
  };

  const rowStyle = {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "10px",
  };

  const noPatientsStyle = {
    textAlign: "center",
    margin: "20px",
    fontSize: "1.5rem",
    color: "grey",
  };

  return (
    <div className="container">
      {!isMobile ? (
        <DrawerNutritionist user={localStorage.getItem("username")} />
      ) : (
        <LabelBottomNavigationNutritionist />
      )}
      <h2 style={{ fontWeight: "bold", color: "black", textAlign: "center" }}>
        MY CURRENT PATIENTS
      </h2>
      {patients.length === 0 ? (
        <p style={noPatientsStyle}>You currently have no patients.</p>
      ) : (
        <Grid
          container
          spacing={2}
          justifyContent={patients.length % 2 === 0 ? "flex-start" : "center"}
        >
          {patients.map((patient) => (
            <Grid item xs={12} sm={6} key={patient._id}>
              <div style={boxStyle}>
                <div style={rowStyle}>
                  <p style={{ color: "black", margin: 0 }}>
                    Name: {patient.firstName} {patient.lastName}
                  </p>
                  <p style={{ color: "black", margin: 0 }}>
                    Email: {patient.email}
                  </p>
                </div>
                <div style={rowStyle}>
                  <p style={{ color: "black", margin: 0 }}>
                    Sex: {patient.sex}
                  </p>
                  <p style={{ color: "black", margin: 0 }}>
                    Age: {patient.age} years
                  </p>
                </div>
                <div style={rowStyle}>
                  <p style={{ color: "black", margin: 0 }}>
                    Height: {patient.height} cm
                  </p>
                  <p style={{ color: "black", margin: 0 }}>
                    Weight: {patient.weight} kg
                  </p>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    marginTop: "10px",
                  }}
                >
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => {
                      localStorage.setItem(
                        "nutritionistUserId",
                        localStorage.getItem("userId")
                      );
                      localStorage.setItem("userId", patient._id);
                      localStorage.setItem(
                        "patientUserName",
                        patient.firstName + " " + patient.lastName
                      );
                      localStorage.setItem("viewAs", true);
                      navigate("/main", { replace: true });
                    }}
                    sx={{
                      mt: 3,
                      mb: 2,
                      backgroundColor: "#373D20",
                      "&:hover": { backgroundColor: "#373D20" },
                      fontWeight: "bold",
                    }}
                  >
                    View Patient
                  </Button>
                </div>
              </div>
            </Grid>
          ))}
        </Grid>
      )}
    </div>
  );
};

export default MainNutritionist;
