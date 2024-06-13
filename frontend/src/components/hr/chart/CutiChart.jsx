import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const CutiChart = () => {
  const data = {
    labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    datasets: [
      {
        label: 'IT',
        data: [2, 4, 3, 5, 7, 3, 1],
        backgroundColor: '#C6F6D5',
        borderColor: '#38A169',
        borderWidth: 1,
      },
      {
        label: 'Accounting',
        data: [4, 2, 1, 5, 6, 3, 5],
        backgroundColor: '#BEE3F8',
        borderColor: '#3182CE',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top'
      },
    },
  };

  return <Bar data={data} options={options} />;
};

export default CutiChart;
