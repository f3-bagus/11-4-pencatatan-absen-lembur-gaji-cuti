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
    labels: [
      'January', 'February', 'March', 'April', 'May', 'June', 
      'July', 'August', 'September', 'October', 'November', 'December'
    ],
    datasets: [
      {
        label: 'IT',
        data: [10, 12, 8, 15, 18, 14, 12, 16, 20, 25, 22, 18],
        backgroundColor: '#C6F6D5',
        borderColor: '#38A169',
        borderWidth: 3,
      },
      {
        label: 'Accounting',
        data: [12, 15, 10, 18, 20, 16, 14, 19, 22, 28, 25, 21],
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
