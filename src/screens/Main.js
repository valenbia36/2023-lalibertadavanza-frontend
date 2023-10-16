import React, { useState, useEffect } from "react";
import { useTheme } from "@mui/material/styles";
import Drawer from "../components/Drawer";
import GoalProgress from "../components/GoalProgress";
import LabelBottomNavigation from "../components/BottomMenu";
import { useSnackbar } from "notistack";
import BarChartComponent from "../components/Charts/BarChartComponent";
import { IconButton, Typography } from "@mui/material";
import Button from "@mui/material/Button";
import GoalForm from "../components/GoalForm";
import AddCircleRoundedIcon from "@mui/icons-material/AddCircleRounded";
import GoalSelect from "../components/GoalSelect";

const Main = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState();
  const theme = useTheme();
  const [isMobile, setIsMobile] = useState(false);
  const [newGoal, setNewGoal] = useState({
    name: "",
    calories: "",
    userId: localStorage.getItem("userId"),
    startDate: "",
    endDate: "",
  });
  const [goals, setGoals] = useState([]);

  useEffect(() => {
    handleGetGoals();
  }, []);

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

  const handleGetGoals = async () => {
    const response = await fetch(
      "http://localhost:3001/api/goals/" + localStorage.getItem("userId"),
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      }
    );

    const data = await response.json();
    setGoals(data.data);
  };

  return (
    <div className="container">
      {!isMobile ? (
        <Drawer user={localStorage.getItem("username")} />
      ) : (
        <LabelBottomNavigation />
      )}
      <GoalSelect
        goals={goals}
        selectedGoal={selectedGoal}
        setSelectedGoal={setSelectedGoal}
      />
      <React.Fragment>
        <GoalForm open={isModalOpen} setOpen={setIsModalOpen} />
      </React.Fragment>
      <IconButton
        onClick={() => {
          setIsModalOpen(true);
        }}
      >
        <AddCircleRoundedIcon />
      </IconButton>

      <div className="col-md-6">
        <div className="row">
          <div className="col-12">
            {selectedGoal ? (
              (console.log(selectedGoal),
              (<GoalProgress goal={selectedGoal.calories} progress={60} />))
            ) : (
              <p>Loading...</p>
            )}
          </div>
        </div>
        {/* <div className="row">
          <div className="col-12">
            <BarChartComponent />
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default Main;
