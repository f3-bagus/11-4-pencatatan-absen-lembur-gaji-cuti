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
import { useColorMode } from '@chakra-ui/react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const CutiChart = () => {
  const { colorMode } = useColorMode();

  const data = {
    labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    datasets: [
      {
        label: 'IT',
        data: [2, 4, 3, 5, 7, 3, 1],
        backgroundColor: '#C6F6D5',
        borderColor: '#38A169',
        borderWidth: 3,
      },
      {
        label: 'Accounting',
        data: [4, 2, 1, 5, 6, 3, 5],
        backgroundColor: '#BEE3F8',
        borderColor: '#3182CE',
        borderWidth: 3,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: colorMode === 'light' ? 'gray' : 'white'
        }
      },
    },
    scales: {
      x: {
        ticks: {
          color: colorMode === 'light' ? 'gray' : 'white'
        },
        grid: {
          color: colorMode === 'light' ? 'rgba(0, 0, 0, 0.1)' : 'rgba(255, 255, 255, 0.1)'
        }
      },
      y: {
        ticks: {
          color: colorMode === 'light' ? 'gray' : 'white'
        },
        grid: {
          color: colorMode === 'light' ? 'rgba(0, 0, 0, 0.1)' : 'rgba(255, 255, 255, 0.1)'
        }
      }
    }
  };

  return <Bar data={data} options={options} />;
};

export default CutiChart;
