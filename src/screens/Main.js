import React, { useState, useEffect } from "react";
import { useTheme } from "@mui/material/styles";
import Drawer from "../components/Drawer";
import GoalProgress from "../components/GoalProgress";
import LabelBottomNavigation from "../components/BottomMenu";
import { IconButton, Typography, Grid } from "@mui/material";
import GoalForm from "../components/Forms/GoalForm";
import AddCircleRoundedIcon from "@mui/icons-material/AddCircleRounded";
import GoalSelect from "../components/GoalSelect";
import getApiUrl from "../helpers/apiConfig";
import GoalList from "../components/GoalList";

const apiUrl = getApiUrl();

const Main = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState();
  const [progress, setProgress] = useState();
  const theme = useTheme();
  const [isMobile, setIsMobile] = useState(false);
  const [goalHasBeenAdd, setGoalHasBeenAdd] = useState(false);

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

  const getCaloriesForGoal = async () => {
    const response = await fetch(
      apiUrl +
        "/api/meals/user/" +
        localStorage.getItem("userId") +
        "/startDate/" +
        selectedGoal.startDate +
        "/endDate/" +
        selectedGoal.endDate,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      }
    );

    const data = await response.json();
    setProgress(data.totalCalorias);
  };

  useEffect(() => {
    if (selectedGoal) {
      getCaloriesForGoal();
    }
  }, [selectedGoal, goalHasBeenAdd]);

  return (
    <div className="container">
      {!isMobile ? (
        <Drawer user={localStorage.getItem("username")} />
      ) : (
        <LabelBottomNavigation />
      )}
      <div className="row justify-content-center">
        <div className="col-lg-10">
          <div className="row justify-content-center">
            <div className="col-lg-4 col-md-6">
              <Typography
                variant="h5"
                fontWeight="bold"
                align="center"
                marginBottom="1%"
                style={{ color: "black", width: "100%" }}
              >
                ACTIVE GOALS:
              </Typography>
              <Grid container alignItems="center" style={{ width: "100%" }}>
                <Grid item xs={10}>
                  <GoalSelect
                    selectedGoal={selectedGoal}
                    setSelectedGoal={setSelectedGoal}
                    goalHasBeenAdd={goalHasBeenAdd}
                  />
                </Grid>
                <Grid item xs={2}>
                  <React.Fragment>
                    <GoalForm
                      open={isModalOpen}
                      setOpen={setIsModalOpen}
                      setGoalHasBeenAdd={setGoalHasBeenAdd}
                      goalHasBeenAdd={goalHasBeenAdd}
                    />
                  </React.Fragment>
                  <IconButton
                    onClick={() => {
                      setIsModalOpen(true);
                    }}
                  >
                    <AddCircleRoundedIcon />
                  </IconButton>
                </Grid>
              </Grid>
              {selectedGoal ? (
                <Grid
                  container
                  alignItems="center"
                  style={{ width: "100%", maxWidth: 600 }}
                  textAlign="center"
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      width: "100%",
                    }}
                  >
                    <GoalProgress
                      goal={selectedGoal.calories}
                      progress={progress}
                    />
                  </div>
                  <Typography
                    style={{
                      color: "black",
                      fontSize: "18px",
                      width: "100%",
                      textAlign: "center",
                    }}
                  >
                    {progress > selectedGoal.calories
                      ? `You exceeded by ${
                          progress - selectedGoal.calories
                        } calories`
                      : `You are missing ${
                          selectedGoal.calories - progress
                        } calories`}
                  </Typography>
                  {progress < selectedGoal.calories && (
                    <Typography
                      style={{
                        color: "black",
                        fontSize: "18px",
                        width: "100%",
                        textAlign: "center",
                      }}
                    >
                      You have time until: {selectedGoal.endDate.split("T")[0]}
                    </Typography>
                  )}
                </Grid>
              ) : (
                <p>Loading...</p>
              )}
            </div>
            <div className="col-lg-8 col-md-6">
              <GoalList />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Main;
