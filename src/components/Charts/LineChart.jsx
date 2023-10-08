import React from "react";
import { LineChart } from "@mui/x-charts/LineChart";

export default function BasicLineChart(data) {
  
  const datesNumeric = (data.data).map(item => parseInt(item.date, 10));
  const caloriasArray = (data.data).map(item => item.calorias);

  const xAxisConfig = {
    max: 31, // Aquí puedes establecer el valor máximo deseado en el eje X
  };

  return (
    <div style={{ marginTop: '-25%' }}>
      <LineChart
        xAxis={[{ data: datesNumeric, ...xAxisConfig }]}
        series={[
          {
            data: caloriasArray,
          },
        ]}
        width={320}
        height={450}
      />
    </div>
  );
}
