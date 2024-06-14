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
import { useColorMode } from '@chakra-ui/react';

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
  const { colorMode } = useColorMode();

  const data = {
    labels: [
      'January', 'February', 'March', 'April', 'May', 'June', 
      'July', 'August', 'September', 'October', 'November', 'December'
    ],
    datasets: [
      {
        label: 'IT',
        data: [20, 15, 25, 30, 10, 45, 35, 20, 25, 40, 30, 20],
        fill: false,
        backgroundColor: '#C6F6D5',
        borderColor: '#38A169',
        tension: 0.1,
      },
      {
        label: 'Accounting',
        data: [15, 25, 20, 35, 40, 20, 25, 30, 35, 25, 15, 10],
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

  return <Line data={data} options={options} />;
};

export default LemburChart;
