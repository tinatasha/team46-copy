import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const CustomAreaChart = ({
  xLabels,
  dataCollections,
  options,
  borderColors,
}) => {
  {
    /**Aspect ration 1:3 100% width to 33% height */
  }
  return (
    <div className="chart-view-management">
      <ResponsiveContainer width="100%" aspect={3}>
        <AreaChart
          width={500}
          height={400}
          data={dataCollections}
          margin={{
            top: 10,
            right: 30,
            left: 0,
            bottom: 0,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Area
            type="monotone"
            dataKey="curryear"
            stroke="#8884d8"
            fill="#8884d8"
          />
          <Area
            type="monotone"
            dataKey="prevyear"
            stroke="#FFD700"
            fill="#FFD700"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
export default CustomAreaChart;
