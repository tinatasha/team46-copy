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

const SingleEndedBarChart = ({
  Data = [],
  borderColours = [],
  barName = [],
  xLabel = "label",
  yLabel = "label",
  KeyA = "KeyA",
}) => {
  return (
    <div className="chart-view-management">
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
          <XAxis dataKey={"region"} />
          <YAxis />
          <Tooltip />
          <Legend wrapperStyle={{ color: "#d11f1fff" }} />
          <Bar
            type="monotone"
            dataKey={KeyA}
            name={barName[0]}
            fill={borderColours[0]}
            stroke={borderColours[0]}
            activeBar={<Rectangle fill="gold" stroke="red" />}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SingleEndedBarChart;
