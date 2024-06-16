import React from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { useColorMode, Stack } from "@chakra-ui/react";

ChartJS.register(ArcElement, Tooltip, Legend);

const AbsenChart = () => {
  const { colorMode } = useColorMode();

  const data = {
    labels: ["present", "leave", "sick", "permit"],
    datasets: [
      {
        label: "# of total",
        data: [12, 19, 3, 5],
        backgroundColor: ["#FEB2B2", "#FBD38D", "#9AE6B4", "#D6BCFA"],
        borderColor: ["#E53E3E", "#DD6B20", "#38A169", "#805AD5"],
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
      <Pie data={data} options={options}/>
    </Stack>
  );
};

export default AbsenChart;
