import React from "react";
import { LineChart } from "@mui/x-charts/LineChart";

export default function BasicLineChart(data) {
  const datesNumeric = (data.data).map(item => parseInt(item.date, 10));
  console.log(datesNumeric)
  const caloriasArray = (data.data).map(item => item.calorias);
  console.log(caloriasArray);
  return (
    <div>
      <LineChart
        xAxis={[{ data: datesNumeric}]}
        series={[
          {
            data: caloriasArray,
          },
        ]}
        width={450}
        height={500}
      />
    </div>
  );
}
