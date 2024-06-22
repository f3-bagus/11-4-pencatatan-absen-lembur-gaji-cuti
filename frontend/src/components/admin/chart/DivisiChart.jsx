import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { useColorMode } from "@chakra-ui/react";
import axios from "axios";
import { BASE_URL } from "../../../api/BASE_URL";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const DivisiChart = () => {
  const { colorMode } = useColorMode();
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [],
  });

  useEffect(() => {
    getDataDashboard();
  }, []);

  const getDataDashboard = async () => {
    await axios
      .get(`${BASE_URL}/api/admin/dashboard/data`)
      .then((res) => {
        const data = res.data.total_division;

        const labels = data.map((item) => item.division);
        const counts = data.map((item) => item.count);

        setChartData({
          labels,
          datasets: [
            {
              label: "Number of People",
              data: counts,
              backgroundColor: [
                "rgba(75, 192, 192, 0.6)",
                "rgba(255, 99, 132, 0.6)",
                "rgba(255, 206, 86, 0.6)",
                "rgba(54, 162, 235, 0.6)"
              ],
              borderColor: [
                "rgba(75, 192, 192, 1)",
                "rgba(255, 99, 132, 1)",
                "rgba(255, 206, 86, 1)",
                "rgba(54, 162, 235, 1)"
              ],
              borderWidth: 1,
            },
          ],
        });
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
        labels: {
          color: colorMode === "light" ? "gray" : "white",
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: colorMode === "light" ? "gray" : "white",
        },
        grid: {
          color:
            colorMode === "light"
              ? "rgba(0, 0, 0, 0.1)"
              : "rgba(255, 255, 255, 0.1)",
        },
      },
      y: {
        ticks: {
          color: colorMode === "light" ? "gray" : "white",
          beginAtZero: true,
          precision: 0,
        },
        grid: {
          color:
            colorMode === "light"
              ? "rgba(0, 0, 0, 0.1)"
              : "rgba(255, 255, 255, 0.1)",
        },
      },
    },
  };

  return <Bar data={chartData} options={options} />;
};

export default DivisiChart;
