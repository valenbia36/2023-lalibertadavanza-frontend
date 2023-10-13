import React, { useState, useEffect } from "react";
import { useTheme } from "@mui/material/styles";
import Drawer from "../components/Drawer";
import MealList from "../components/MealList";
import FoodList from "../components/FoodList";
import LabelBottomNavigation from "../components/BottomMenu";

const Meals = () => {
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
    <div className="container">
      {!isMobile ? (
        <Drawer user={localStorage.getItem("username")} />
      ) : (
        <LabelBottomNavigation />
      )}
      <div className="row justify-content-center">
        <div className="col-lg-10">
          <div className="row justify-content-center">
            <div className="col-lg-4 col-md-6">
              <FoodList />
            </div>
            <div className="col-lg-8 col-md-6">
              <MealList />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Meals;