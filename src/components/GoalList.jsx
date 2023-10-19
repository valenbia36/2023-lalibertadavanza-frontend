import React from "react";
import { Typography } from "@mui/material";
import GoalTable from "./Tables/GoalTable";

const GoalList = () => {
  return (
    <div
      style={{
        textAlign: "center",
        color: "black",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: "100px",
      }}
    >
      <Typography
        variant="h5"
        fontWeight="bold"
        align="center"
        marginBottom="2%"
      >
        GOALS TABLE
      </Typography>
      <div style={{ maxWidth: "100%" }}>
        <GoalTable />
      </div>
    </div>
  );
};

export default GoalList;
