import React, { useState, useEffect } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { useColorMode, Stack } from "@chakra-ui/react";
import axios from "axios";

ChartJS.register(ArcElement, Tooltip, Legend);

const AbsenChart = () => {
  const { colorMode } = useColorMode();
  const [labels, setLabels] = useState([]);
  const [datasets, setDatasets] = useState([]);

  const getDataDashboard = () => {
    axios
      .get("http://localhost:5000/api/employee/dashboard/data")
      .then((res) => {
        setDatasets(res.data.data_attendance.data.datasets[0].data);
        setLabels(res.data.data_attendance.data.labels);
        console.log(res.data.data_salary);
      })
      .catch((err) => {
        console.log(err.message);
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
          "#9AE6B4",
          "#FBD38D",
          "#FEB2B2",
          "#D6BCFA",
          "#E2E8F0",
          "#90CDF4",
        ],
        borderColor: [
          "#38A169",
          "#DD6B20",
          "#E53E3E",
          "#805AD5",
          "#718096",
          "#3182CE",
        ],
        borderWidth: 3,
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
