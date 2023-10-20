import React from "react";
import { CircularProgress, Typography, Box, Grid } from "@mui/material";

const GoalChart = ({ goal, progress }) => {
  var percentage = (progress / goal) * 100;
  var perToShow = Math.round(percentage);
  let color = "";

  if (percentage <= 25) {
    color = "error.main";
  } else if (percentage <= 50) {
    color = "info.main";
  } else if (percentage <= 75) {
    color = "warning.main";
  } else if (percentage <= 100) {
    color = "success.main";
  } else {
    percentage = 100;
    color = "error.main";
  }

  return (
    <Grid color="black">
      <Box p={4} textAlign="center" sx={{ position: "relative" }}>
        <CircularProgress
          variant="determinate"
          value={percentage}
          size={200}
          thickness={4}
          sx={{
            color: color,
            margin: "0 auto",
            border: "2px solid black",
            borderRadius: "50%",
            boxShadow: "inset 0 0 10px black",
          }}
        />
        <Typography
          variant="h6"
          component="div"
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            fontWeight: "bold",
          }}
        >
          {`${perToShow}%`}
        </Typography>
      </Box>
    </Grid>
  );
};

export default GoalChart;
