import React from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Legend, Tooltip } from "recharts";

export default function LineChartWithCustomFontSize(data) {
  const caloriasArray = data.data.map((item) => item.calorias);

  const totalCalorias = caloriasArray.reduce((acc, curr) => acc + curr, 0);
  const promedioCalorias = totalCalorias / caloriasArray.length;

  const dataWithAverage = data.data.map((item) => ({
    date: item.date,
    calorias: item.calorias,
    promedio: promedioCalorias,
  }));

  const CustomTooltip = ({ active, payload, label }) => {
    if (active) {
      const filteredPayload = payload.filter((entry) => entry.dataKey !== "promedio");
  
      return (
        <div className="custom-tooltip" style={{ background: 'white', border: '1px solid #ccc', padding: '5px' }}>
          <p>Date: {label}</p>
          {filteredPayload.map((entry) => (
            <p key={entry.dataKey}>
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
  
    return null;
  };

  return (
    <div style={{ fontSize: 12 }}>
      <LineChart
        width={320}
        height={450}
        data={dataWithAverage}
        margin={{ top: 10, right: 30, left: 20, bottom: 30 }}
      >
      <Tooltip content={<CustomTooltip />} />
        <Legend
          verticalAlign="bottom"
          iconSize={25}
          layout="vertical"
          margin={{ top: 1000 }}
        />
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="date"
          label={{
            value: "Date",
            position: "bottom",
            fontSize: 14,
            fontWeight: "bold",
          }}
        />
        <YAxis
          label={{
            value: "Calories",
            angle: -90,
            position: "insideLeft",
            fontSize: 14,
            fontWeight: "bold",
          }}
        />
        <Legend verticalAlign="top" width={100} />
        <Line
          type="monotone"
          dataKey="calorias"
          name="Calories"
          stroke="#936639"
          strokeWidth={2}
          dot={false}
        />
        <Line
          type="monotone"
          dataKey="promedio"
          name={`Calories average (${promedioCalorias.toFixed(2)})`}
          stroke="#6a994e"
          dot={false}
          strokeWidth={2}
          strokeDasharray="3 3"
        />
      </LineChart>
    </div>
  );
}
