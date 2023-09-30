import * as React from "react";
import Drawer from "../components/Drawer";
import MyResponsivePie from "../components/Charts/PieChart";
import { Grid, Paper } from "@mui/material";

const Statistics = () => {
  return (
    <div>
      <Drawer user={localStorage.getItem("username")} />
      <div style={{ width: "500px", height: "500px" }}>
        <MyResponsivePie />
      </div>
    </div>
  );
};

export default Statistics;
