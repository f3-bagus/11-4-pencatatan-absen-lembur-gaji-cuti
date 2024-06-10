import React from 'react';
import { Line } from 'react-chartjs-2';
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

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const LemburChart = () => {
  const data = {
    labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    datasets: [
      {
        label: 'IT',
        data: [2, 4, 3, 5, 7, 3, 1],
        fill: false,
        backgroundColor: '#C6F6D5',
        borderColor: '#38A169',
        tension: 0.1,
      },
      {
        label: 'Accounting',
        data: [4, 2, 1, 5, 6, 3, 5],
        fill: false,
        backgroundColor: '#BEE3F8',
        borderColor: '#3182CE',
        tension: 0.1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
    },
  };

  return <Line data={data} options={options} />;
};

export default LemburChart;
