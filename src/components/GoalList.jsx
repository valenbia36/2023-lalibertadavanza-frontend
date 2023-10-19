import React, { useState } from "react";
import {Typography } from "@mui/material";
import FoodForm from "./Forms/FoodForm";
import GoalTable from "./Tables/GoalTable";

const GoalList = () => {
  
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div style={{ textAlign: "center", color: "black" }}>
      <Typography variant="h5" fontWeight="bold" align='center' marginBottom='2%'>GOALS TABLE</Typography>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-start",
          maxWidth: "100%",
        }}
      >
        <GoalTable/>
      </div>
      <React.Fragment>
        <FoodForm open={isModalOpen} setOpen={setIsModalOpen} />
      </React.Fragment>
    </div>
  );
};

export default GoalList;
