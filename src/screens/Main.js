import React, { useState, useEffect } from "react";
import { useTheme } from "@mui/material/styles";
import Drawer from "../components/Drawer";
import GoalProgress from "../components/GoalProgress"
import LabelBottomNavigation from "../components/BottomMenu";
import { useSnackbar } from "notistack";

const Main = () => {

  const { enqueueSnackbar } = useSnackbar();

  const theme = useTheme();
  const [isMobile, setIsMobile] = useState(false);
  const [newGoal, setNewGoal] = useState({
    name: '',
    calories: '',
    userId: localStorage.getItem('userId'),
    startDate: '',
    endDate: ''
  });
  const [goals, setGoals] = useState([]);

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

  const handleAddGoal = () => {
    if (
      newGoal.name === "" ||
      newGoal.calories === "" ||
      newGoal.userId === "" ||
      newGoal.startDate === "" ||
      newGoal.endDate === ""
    ) {
      enqueueSnackbar("Please complete all the fields correctly.", { variant: "error" });
      return;
    } else {
      fetch("http://localhost:3001/api/goals", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        body: JSON.stringify(newGoal),
      }).then(function (response) {
        if (response.status === 200) {
          enqueueSnackbar("The goal was created successfully.", {
            variant: "success",
          });
          //closeModal();
        } else {
          enqueueSnackbar("An error occurred while creating the goal.", {
            variant: "error",
          });
        }
      });
    }
  };

  const handleGetGoals = async () => {

    const response = await fetch("http://localhost:3001/api/goals/" + localStorage.getItem('userId'), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    })

    const data = await response.json();
    setGoals(data.data)    
  };

  useEffect( () => {
    handleGetGoals();
  }, [])

  return (
    <div className="container">
      {!isMobile ? (
        <Drawer user={localStorage.getItem("username")} />
      ) : (
        <LabelBottomNavigation />
      )}
      <div className="row justify-content-center">
        <GoalProgress goal={100} progress={80}/>
      </div>
    </div>
  );
};

export default Main;
