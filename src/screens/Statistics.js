import React, { useState, useEffect } from "react";
import Drawer from "../components/Drawer";

import {Grid } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import LabelBottomNavigation from "../components/BottomMenu";
import PieChartContainer from "../components/Charts/PieChartContainer";
import LineChartContainer from "../components/Charts/LineChartContainer";

const Statistics = () => {
  
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
    <Grid>
      {!isMobile ? (
        <Drawer user={localStorage.getItem("username")} />
      ) : (
        <LabelBottomNavigation />
      )}
      <PieChartContainer/>
      <LineChartContainer/>
    </Grid>
  );
};

export default Statistics;
