import React from "react";
import {
  BarChart,
  Bar,
  Rectangle,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const DoubleEndedBarChart = ({
  Data = [],
  borderColours = [],
  barName = [],
  xLabel = "label",
  yLabel = "label",
  KeyA = "KeyA",
  KeyB = "KeyB",
}) => {
  return (
    <ResponsiveContainer width="100%" aspect={3}>
      <BarChart
        width={500}
        height={300}
        data={Data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey={xLabel} />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar
          type="monotone"
          dataKey={KeyA}
          name={barName[0]}
          fill={borderColours[0]}
          stroke={borderColours[0]}
          activeBar={<Rectangle fill="gold" stroke="red" />}
        />
        <Bar
          type="monotone"
          dataKey={KeyB}
          name={barName[1]}
          fill={borderColours[1]}
          stroke={borderColours[1]}
          activeBar={<Rectangle fill="pink" stroke="blue" />}
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default DoubleEndedBarChart;
