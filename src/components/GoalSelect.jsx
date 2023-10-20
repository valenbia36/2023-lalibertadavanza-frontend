import React, { useState, useEffect } from "react";
import { Select, MenuItem, InputLabel, FormControl } from "@mui/material";
import getApiUrl from "../helpers/apiConfig";

const apiUrl = getApiUrl();

const GoalSelect = ({ onChangeGoal, goalHasBeenAdd }) => {
  const [selectedGoal, setSelectedGoal] = useState("");
  const [goals, setGoals] = useState([]);

  useEffect(() => {
    handleGetActiveGoals();
  }, []);

  useEffect(() => {
    handleGetActiveGoals();
  }, [goalHasBeenAdd]);

  const handleGetActiveGoals = async () => {
    const response = await fetch(
      apiUrl + "/api/goals/activeGoals/" + localStorage.getItem("userId"),
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      }
    );
    const data = await response.json();
    setSelectedGoal(data.filteredData[0].name);
    onChangeGoal(data.filteredData[0])
    setGoals(data.filteredData);
  };

  return (
    <FormControl style={{ width: "100%", maxWidth: 500, minWidth: 200 }}>
      <InputLabel id="category-select-label">Goal</InputLabel>
      <Select
        labelId="category-select-label"
        id="category-select"
        label="Category"
        value={selectedGoal}
        onChange={(e) => {
          const selectedGoalObj = goals.find(
            (goal) => goal.name === e.target.value
          );
          setSelectedGoal(e.target.value);
          onChangeGoal(selectedGoalObj)
        }}
        MenuProps={{ PaperProps: { style: { maxHeight: 110 } } }}
      >
        {Array.isArray(goals) && goals.length > 0 ? (
          goals.map((option) => (
            <MenuItem key={option._id} value={option.name}>
              {option.name}
            </MenuItem>
          ))
        ) : (
          <MenuItem value="">There are no goals available</MenuItem>
        )}
      </Select>
    </FormControl>
  );
};

export default GoalSelect;
