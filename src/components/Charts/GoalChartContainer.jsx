import React, { useState, useEffect } from "react";
import { IconButton, Typography, Grid } from "@mui/material";
import GoalForm from "../Forms/GoalForm";
import AddCircleRoundedIcon from "@mui/icons-material/AddCircleRounded";
import GoalSelect from "../GoalSelect";
import GoalChart from "./GoalChart";
import getApiUrl from "../../helpers/apiConfig";


const apiUrl = getApiUrl();

const GoalChartContainer = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedGoal, setSelectedGoal] = useState();
    const [progress, setProgress] = useState();
    const [goalHasBeenAdd, setGoalHasBeenAdd] = useState(false);
    
    const onChangeGoal =async(aGoal) =>{
        setSelectedGoal(aGoal)
    }
  
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
              <div className="col-lg-4 col-md-6">
                <Typography
                  variant="h5"
                  fontWeight="bold"
                  align="center"
                  marginBottom="1%"
                  style={{ color: "black", width: "100%" }}
                >
                  ACTIVE GOALS
                </Typography>
                <Grid container alignItems="center" style={{ width: "100%" }}>
                  <Grid item xs={10}>
                    <GoalSelect
                      onChangeGoal={onChangeGoal}
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
                      <GoalChart
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
                  <p style={{color: 'black'}}>You dont have active goals</p>
                )}
              </div>

           )};

export default GoalChartContainer;
