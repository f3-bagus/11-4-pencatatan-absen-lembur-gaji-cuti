import React, { useState, useEffect } from "react";
import { PolarArea } from "react-chartjs-2";
import {
  Chart as ChartJS,
  RadialLinearScale,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { useColorMode, Stack } from "@chakra-ui/react";

ChartJS.register(RadialLinearScale, ArcElement, Tooltip, Legend);

const TypeChart = () => {
  const { colorMode } = useColorMode();
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [],
  });

  useEffect(() => {
    getDataDashboard();
  }, []);

  const getDataDashboard = () => {
    // Using dummy data
    const data = [
      { division: "Permanent", count: 10 },
      { division: "Contract", count: 15 },
      { division: "Intern", count: 8 },
    ];

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
          ],
          borderColor: [
            "rgba(75, 192, 192, 1)",
            "rgba(255, 99, 132, 1)",
            "rgba(255, 206, 86, 1)",
          ],
          borderWidth: 1,
        },
      ],
    });
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      r: {
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

  return (
    <Stack h="250" align="center">
      <PolarArea data={chartData} options={options} />
    </Stack>
  );
};

export default TypeChart;
