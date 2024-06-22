import React, { useState, useEffect } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { useColorMode, Stack } from "@chakra-ui/react";
import axios from "axios";
import { BASE_URL } from "../../../api/BASE_URL";

ChartJS.register(ArcElement, Tooltip, Legend);

const AbsenChart = () => {
  const { colorMode } = useColorMode();
  const [labels, setLabels] = useState([]);
  const [datasets, setDatasets] = useState([]);

  const getDataDashboard = () => {
    axios
      .get(`${BASE_URL}/api/employee/dashboard/data`)
      .then((res) => {
        setDatasets(res.data.data_attendance.data.datasets[0].data);
        setLabels(res.data.data_attendance.data.labels);
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
        label: "# of total",
        data: datasets,
        backgroundColor: [
          "rgba(75, 192, 192, 0.6)",
          "rgba(255, 206, 86, 0.6)",
          "rgba(255, 99, 132, 0.6)",
          "rgba(54, 162, 235, 0.6)", // Blue
          "rgba(153, 102, 255, 0.6)", // Purple
          "rgba(201, 203, 207, 0.6)", // Grey
        ],
        borderColor: [
          "rgba(75, 192, 192, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)", // Blue
          "rgba(153, 102, 255, 1)", // Purple
          "rgba(201, 203, 207, 1)", // Grey
        ],
        borderWidth: 3,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "left",
        labels: {
          color: colorMode === "light" ? "gray" : "white",
        },
      },
      tooltip: {
        backgroundColor: colorMode === "light" ? "white" : "gray",
        titleColor: colorMode === "light" ? "black" : "white",
        bodyColor: colorMode === "light" ? "black" : "white",
      },
    },
  };

  return (
    <Stack h="250" align="center">
      <Pie data={data} options={options} />
    </Stack>
  );
};

export default AbsenChart;
