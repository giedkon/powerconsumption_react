import { useParams } from "react-router-dom";
import { useEffect, useRef, useState } from 'react';
import axios from "axios";
import moment from "moment/moment";
import Chart from "chart.js/auto";

function GaugeChart({ currentValue, maxValue }) {
  const gaugechartRef = useRef(null);

  useEffect(() => {
    const innertext = {
      id: 'innertext',
      beforeDraw(chart, args, options) {
        const { ctx, chartArea: { top, right, bottom, left, width, height } } = chart;
        ctx.save();
        ctx.fillStyle = '#FF1A68';
        ctx.font = '20px arial';
        ctx.textAlign = 'center';
        ctx.fillText(Math.round(currentValue * 100) / 100 + 'kWh', left + width / 2, top + height / 2 + 10);
      }

    }

    const chartConfig = {
      type: 'doughnut',
      data: {
        datasets: [{
          data: [currentValue, maxValue - currentValue],
          backgroundColor: [
            'rgba(255, 26, 104, 0.2)',
            'rgba(102, 102, 102, 0.2)'
          ],
          borderColor: [
            'rgba(255, 26, 104, 1)',
            'rgba(102, 102, 102, 0.2)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        circumference: 250,
        rotation: 235,
        cutout: '90%',
        aspectRatio: 2,
        plugins: {
          tooltip: {
            filter: (a) => { return null }
          }
        }
      },
      plugins: [innertext]
    };

    const gaugeChart = new Chart(gaugechartRef.current, chartConfig);
    return () => {
      gaugeChart.destroy();
    };
  }, [currentValue, maxValue]);

  return (

    <div style={{ width: '400px', height: '225px', border: "2px solid rgba(255, 26, 104, 0.2)", borderRadius: "10px", margin: 10 }}>
      <div style={{ height: '90%' }}>
        <canvas ref={gaugechartRef} />
      </div>
      <div style={{ display: 'flex' }}>
        <div style={{ width: '50%', height: '10%', display: "flex", justifyContent: "center", alignItems: "center" }}>0kWh</div>
        <div style={{ width: '50%', height: '10%', display: "flex", justifyContent: "center", alignItems: "center" }}>200kWh</div>
      </div>
    </div>

  );
}





function BarChart() {
  const barchartRef = useRef(null);

  useEffect(() => {
    /*
    'rgba(255, 206, 86, 0.2)',
    'rgba(75, 192, 192, 0.2)',
    'rgba(153, 102, 255, 0.2)',
    'rgba(255, 159, 64, 0.2)',
    'rgba(0, 0, 0, 0.2)'
    
    
    
    'rgba(255, 206, 86, 1)',
    'rgba(75, 192, 192, 1)',
    'rgba(153, 102, 255, 1)',
    'rgba(255, 159, 64, 1)',
    'rgba(0, 0, 0, 1)'*/
    // config 
    const barconfig = {
      type: 'bar',
      data: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [{
          data: [70, 16, 80, 46, 20, 55, 11],
          backgroundColor: ['rgba(255, 26, 104, 0.2)',],
          borderColor: ['rgba(255, 26, 104, 1)',],
          borderWidth: 1
        },
        {
          data: [18, 12, 84, 9, 62, 33, 44],
          backgroundColor: ['rgba(54, 162, 235, 0.2)',],
          borderColor: ['rgba(54, 162, 235, 1)',],
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    };


    const gaugeChart = new Chart(barchartRef.current, barconfig);
    return () => {
      gaugeChart.destroy();
    };
  },);

  return (

    <div style={{ width: '800px', height: '450px', border: "2px solid rgba(255, 26, 104, 0.2)", borderRadius: "10px", margin: 10 }}>
      <div>
        <canvas ref={barchartRef} />
      </div>
    </div>

  );
}





export default function Diagrams() {
  let { computerId } = useParams();

  const [perPage, setPerPage] = useState(10);
  const [isLoading, setLoading] = useState(true);
  const [isError, setError] = useState(false);
  const [consumptions, setConsumptions] = useState([]);
  const [moreExists, setMoreExists] = useState(true);
  const [prevCount, setPrevCount] = useState(0);


  const [powerDrawSum, setPowerDrawSum] = useState(0);
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(
          "https://localhost:7145/api/computer/1/power_consumption?Count=24&GroupBy=hour&MinTime=2023-03-15T00:00:00&MaxTime=2023-03-15T23:59:59"
        );
        const data = await response.json();
        const sum = data.reduce((acc, curr) => acc + curr.cpuPowerDraw + curr.gpuPowerDraw, 0);
        setPowerDrawSum(sum);
      } catch (error) {
        console.error(error);
      }
    }

    fetchData();
  }, []);


  return (
    <div className="diagram" style={{ display: 'flex' }}>
      <GaugeChart currentValue={powerDrawSum} maxValue={200} />
      <BarChart />
    </div>
  );
}
