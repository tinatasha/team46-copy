import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Title,
  defaults,
} from "chart.js";
import { Line } from "react-chartjs-2";

defaults.maintainAspectRatio = false;
defaults.responsive = true;
defaults.font.family = "Arial";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Title
);

const LineGraph = ({ xLabels, dataCollections, options, borderColors }) => {
  return (
    <div className="chart-container" style={{ minHeight: "375px" }}>
      <Line
        data={{
          labels: xLabels,
          datasets: dataCollections.map((currArray, i) => ({
            label: currArray.label,
            data: currArray.Data.map((item) => item.dataPoint),
            borderColor: borderColors[i],
            backgroundColor: "white",
          })),
        }}
        options={options}
      />
    </div>
  );
};
export default LineGraph;
