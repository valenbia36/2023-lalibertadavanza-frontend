import React, { useState, useEffect } from "react";
import { useTheme } from "@mui/material/styles";
import Drawer from "../components/Drawer";
import GoalProgress from "../components/GoalProgress";
import LabelBottomNavigation from "../components/BottomMenu";
import { IconButton, Typography } from "@mui/material";
import GoalForm from "../components/GoalForm";
import AddCircleRoundedIcon from "@mui/icons-material/AddCircleRounded";
import GoalSelect from "../components/GoalSelect";

const Main = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState();
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

  return (
    <div className="container" style={{display: 'flex',flexDirection: 'column',alignItems: 'center',justifyContent: 'center'}}>
      {!isMobile ? (
        <Drawer user={localStorage.getItem("username")} />
      ) : (
        <LabelBottomNavigation />
      )}
      <GoalSelect
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
        <Typography variant="h5" fontWeight="bold" align='center' marginBottom='5%' style={{color:"black"}}>GOAL</Typography>
            {selectedGoal ? (
                <div>
                  <span style={{display: 'flex',flexDirection: 'column',alignItems: 'center',justifyContent: 'center', color:"black"}}>Start Date: {(selectedGoal.startDate).split("T")[0]} </span>
                  <GoalProgress goal={selectedGoal.calories} progress={60} />
                  <span style={{display: 'flex',flexDirection: 'column',alignItems: 'center',justifyContent: 'center', color:"black" }} >End Date: {(selectedGoal.endDate).split("T")[0]}</span>
                </div>
              )
             : (
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
