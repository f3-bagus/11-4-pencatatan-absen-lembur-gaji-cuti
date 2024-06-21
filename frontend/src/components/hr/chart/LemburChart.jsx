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
  const [labels, setLabels] = useState([]);
  const [marketing, setMarketing] = useState([]);
  const [it, setIt] = useState([]);
  const [sales, setSales] = useState([]);

  const getDataDashboard = () => {
    axios
      .get("https://api-msib-6-pencatatan-absen-lembur-gaji-cuti-04.educalab.id/api/hr/dashboard/data")
      .then((res) => {
        const data = res.data;
        console.log(data.data_overtime);
        //setIt(data.data_overtime.datasets[0].data);
        setMarketing(data.data_overtime.datasets[0].data);
        setSales(data.data_overtime.datasets[1].data);
        setLabels(data.data_overtime.labels)
      })
      .catch((err) => {
        //console.error(err);
      });
  };

  useEffect(() => {
    getDataDashboard();
  }, []);

  const data = {
    labels: labels,
    datasets: [
      // {
      //   label: "IT",
      //   data: it,
      //   fill: false,
      //   backgroundColor: "rgba(75, 192, 192, 0.6)",
      //   borderColor: "rgba(75, 192, 192, 1)",
      //   tension: 0.1,
      // },
      {
        label: "Sales",
        data: sales,
        fill: false,
        backgroundColor: "rgba(255, 99, 132, 0.6)",
        borderColor: "rgba(255, 99, 132, 1)",
        tension: 0.1,
      },
      {
        label: "Marketing",
        data: marketing,
        fill: false,
        backgroundColor: "rgba(255, 206, 86, 0.6)",
        borderColor: "rgba(255, 206, 86, 1)",
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

export default LemburChart;
