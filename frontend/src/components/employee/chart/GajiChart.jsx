import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
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
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const GajiChart = () => {
  const { colorMode } = useColorMode();
  const [labels, setLabels] = useState([]);
  const [basicSalary, setBasicSalary] = useState([]);
  const [totalSalary, setTotalSalary] = useState([]);
  const [overtime, setOvertime] = useState([]);
  const [deduction, setDeduction] = useState([]);

  const getDataDashboard = () => {
    axios
      .get(
        `${BASE_URL}/api/employee/dashboard/data`
      )
      .then((res) => {
        setLabels(res.data.data_salary.labels);
        setBasicSalary(res.data.data_salary.datasets[0].data);
        setTotalSalary(res.data.data_salary.datasets[1].data);
        setOvertime(res.data.data_salary.datasets[2].data);
        setDeduction(res.data.data_salary.datasets[3].data);
      })
      .catch((err) => {
        console.error(err.message);
      });
  };

  useEffect(() => {
    getDataDashboard();
  }, []);

  const data = {
    labels: labels,
    datasets: [
      {
        label: "Basic Salary",
        data: basicSalary,
        fill: false,
        backgroundColor: "rgba(54, 162, 235, 0.6)",
        borderColor: "rgba(54, 162, 235, 1)",
        tension: 0.1,
      },
      {
        label: "Overtime Salary",
        data: overtime,
        fill: false,
        backgroundColor: "rgba(153, 102, 255, 0.6)",
        borderColor: "rgba(153, 102, 255, 1)",
        tension: 0.1,
      },
      {
        label: "Total Deduction",
        data: deduction,
        fill: false,
        backgroundColor: "rgba(255, 99, 132, 0.6)",
        borderColor: "rgba(255, 99, 132, 1)",
        tension: 0.1,
      },
      {
        label: "Total Salary",
        data: totalSalary,
        fill: false,
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        tension: 0.1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
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

  return <Line data={data} options={options} />;
};

export default GajiChart;
