import React, { useState } from "react";
import { IconButton, Tooltip, Typography } from "@mui/material";
import MealForm from "../Forms/MealForm";
import AddCircleRoundedIcon from "@mui/icons-material/AddCircleRounded";
import MealTable from "../Tables/MealTable";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import { useNavigate } from "react-router-dom";

const MealList = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const navigatePlanerScreen = () => {
    navigate("/myPlanner", { replace: true });
  };

  return (
    <div style={{ textAlign: "center", marginBottom: "250px", color: "black" }}>
      <Typography
        variant="h5"
        fontWeight="bold"
        align="center"
        marginBottom="2%"
      >
        MEALS TABLE
      </Typography>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-start",
          maxWidth: "100%",
        }}
      >
        <MealTable modalOpen={isModalOpen} />
      </div>

      <React.Fragment>
        <MealForm open={isModalOpen} setOpen={setIsModalOpen} />
      </React.Fragment>
      {localStorage.getItem("viewAs") === "false" && (
        <IconButton
          onClick={() => {
            setIsModalOpen(true);
          }}
        >
          <AddCircleRoundedIcon />
        </IconButton>
      )}
      <Tooltip title="Plan Meals">
        <IconButton
          onClick={() => {
            navigatePlanerScreen();
          }}
        >
          <CalendarMonthIcon />
        </IconButton>
      </Tooltip>
    </div>
  );
};

export default MealList;
