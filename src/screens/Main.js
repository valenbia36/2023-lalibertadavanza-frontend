import React, { useState, useEffect } from "react";
import { useTheme } from "@mui/material/styles";
import Drawer from "../components/Drawer";
import GoalProgress from "../components/GoalProgress";
import LabelBottomNavigation from "../components/BottomMenu";
import { IconButton, Typography, Grid } from "@mui/material";
import GoalForm from "../components/Forms/GoalForm";
import AddCircleRoundedIcon from "@mui/icons-material/AddCircleRounded";
import GoalSelect from "../components/GoalSelect";
import getApiUrl from '../helpers/apiConfig';

const apiUrl = getApiUrl();

const Main = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState();
  const [progress, setProgress] = useState();
  const theme = useTheme();
  const [isMobile, setIsMobile] = useState(false);


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
        apiUrl + "/api/meals/user/" + localStorage.getItem("userId")+"/startDate/"+selectedGoal.startDate+"/endDate/"+selectedGoal.endDate,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
  
      const data = await response.json();
      setProgress(data.totalCalorias)
    };

  useEffect(() => {
    if (selectedGoal) {getCaloriesForGoal()} 
  }, [selectedGoal]);

  return (
    <div className="container" style={{display: 'flex',flexDirection: 'column',alignItems: 'center',justifyContent: 'center'}}>
      {!isMobile ? (
        <Drawer user={localStorage.getItem("username")} />
      ) : (
        <LabelBottomNavigation />
      )}
      <Typography variant="h5" fontWeight="bold" align='center' marginBottom='1%' style={{color:"black"}}>GOAL:</Typography>
      <Grid container alignItems="center"  style={{width: "100%", maxWidth: 400,}}     >
            <Grid item xs={11}>
              <GoalSelect
                selectedGoal={selectedGoal}
                setSelectedGoal={setSelectedGoal}/>
            </Grid>
            <Grid item xs={1}>
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
            </Grid>
        </Grid>
      <div className="col-md-6">
        <div className="row">
        <div className="col-12">
            {selectedGoal ? (
                <div>
                  <span style={{display: 'flex',flexDirection: 'column',alignItems: 'center',justifyContent: 'center', color:"black"}}>Start Date: {(selectedGoal.startDate).split("T")[0]} </span>
                  <GoalProgress goal={selectedGoal.calories} progress={progress} />
                  <span style={{display: 'flex',flexDirection: 'column',alignItems: 'center',justifyContent: 'center', color:"black" }} >End Date: {(selectedGoal.endDate).split("T")[0]}</span>
                </div>
              )
             : (
              <p>Loading...</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Main;
