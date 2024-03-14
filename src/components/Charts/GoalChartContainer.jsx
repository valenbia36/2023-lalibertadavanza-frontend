import React, { useState, useEffect } from "react";
import { Typography, Grid, CircularProgress } from "@mui/material";
import GoalSelect from "../GoalSelect";
import GoalChart from "./GoalChart";
import getApiUrl from "../../helpers/apiConfig";

const apiUrl = getApiUrl();

const GoalChartContainer = () => {
  const [selectedGoal, setSelectedGoal] = useState();
  const [progress, setProgress] = useState();
  const [isLoading, setIsLoading] = useState(false);

  const onChangeGoal = async (aGoal) => {
    setSelectedGoal(aGoal);
  };

  const getCaloriesForGoal = async () => {
    setIsLoading(true);
    const response = await fetch(
      apiUrl +
        "/api/meals/user" +
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
    setIsLoading(false);
  };

  useEffect(() => {
    if (selectedGoal) {
      getCaloriesForGoal();
    }
  }, [selectedGoal]);

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
        <Grid item xs={12}>
          <GoalSelect onChangeGoal={onChangeGoal} />
        </Grid>
      </Grid>

      {isLoading ? (
        <div
          style={{ display: "flex", justifyContent: "center", width: "100%" }}
        >
          <CircularProgress size={80} thickness={3} />
        </div>
      ) : selectedGoal ? (
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
            <GoalChart goal={selectedGoal.calories} progress={progress} />
          </div>
          <Typography
            style={{
              color: "black",
              fontSize: "18px",
              width: "100%",
              textAlign: "center",
            }}
          >
            {progress > selectedGoal.calories ? (
              <>
                You exceeded by
                <span style={{ fontWeight: "bold" }}>
                  {" "}
                  {progress - selectedGoal.calories}{" "}
                </span>
                calories
              </>
            ) : (
              <>
                You are missing
                <span style={{ fontWeight: "bold" }}>
                  {" "}
                  {selectedGoal.calories - progress}{" "}
                </span>
                calories
              </>
            )}
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
              You have time until:{" "}
              <span style={{ fontWeight: "bold" }}>
                {selectedGoal.endDate.split("T")[0]}
              </span>
            </Typography>
          )}
        </Grid>
      ) : (
        <p
          style={{
            color: "black",
            fontSize: "18px",
            textAlign: "center",
            marginTop: "10%",
            fontWeight: "bold",
          }}
        >
          You dont have active goals
        </p>
      )}
    </div>
  );
};

export default GoalChartContainer;
