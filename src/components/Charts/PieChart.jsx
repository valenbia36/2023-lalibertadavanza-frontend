import React from "react";
import { PieChart } from "@mui/x-charts/PieChart";

export default function BasicPie({ data }) {
  return (
    <PieChart
      series={[
        {
          data: data,
          innerRadius: 30,
          outerRadius: 100,
          paddingAngle: 5,
          cornerRadius: 5,
          startAngle: 0,
          endAngle: 360,
        },
      ]}
      width={400}
      height={200}   
    />
  );
}
