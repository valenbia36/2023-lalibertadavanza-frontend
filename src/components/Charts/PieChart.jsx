import React from "react";
import { PieChart } from "@mui/x-charts/PieChart";

export default function BasicPie({ data }) {
  return (
    <PieChart
      series={[
        {
          data: data,
          innerRadius: 50,
          outerRadius: 80,
          paddingAngle: 5,
          cornerRadius: 5,
          startAngle: 0,
          endAngle: 360,
          
        },
      ]}
      width={310}
      height={250}
      slotProps={{
        legend: {
          direction: 'column',
          position: { vertical: 'middle', horizontal: 'right' },
          labelStyle: {
            fontSize: 14, width: '80px'
          },
          itemMarkWidth: 10,
          itemMarkHeight: 10,
        },

      }}
    />
  );
}
