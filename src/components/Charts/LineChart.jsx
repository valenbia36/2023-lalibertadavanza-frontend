import React, { useState, useEffect } from "react";
import { LineChart } from "@mui/x-charts/LineChart";
import { Paper } from "@mui/material";

export default function BasicLineChart() {
  const [data, setData] = useState();

  useEffect(() => {}, []);
  return (
    <div>
      <LineChart
        xAxis={[{ data: [1, 2, 3, 5, 8, 10] }]}
        series={[
          {
            data: [2, 5.5, 2, 8.5, 1.5, 5],
          },
        ]}
        width={200}
        height={300}
      />
    </div>
  );
}
