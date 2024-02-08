import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

interface DataPoint {
  time: string;
  value: number;
};

interface LineGraphProps {
  data: DataPoint[];
};

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const LineGraph = ({ data }: LineGraphProps) => {
  const labels = data.map((item) => item.time);
  const values = data.map((item) => item.value);

  const chartData = {
    labels: labels,
    datasets: [
      {
        label: 'Values',
        data: values,
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Time',
      },
    },
  };

  return <Line data={chartData} options={options} />;
};

export default LineGraph;
