import Chart from "chart.js/auto";
import { useEffect, useRef, useState } from 'react';

export default function LimitChart(props) {
    const gaugechartRef = useRef(null);
    const { currentValue, maxValue, title ,prefix } = props;

    useEffect(() => {
        const innertext = {
          id: 'innertext',
          beforeDraw(chart, args, options) {
            const { ctx, chartArea: { top, right, bottom, left, width, height } } = chart;
            ctx.save();
            ctx.fillStyle = '#FF1A68';
            ctx.font = '20px arial';
            ctx.textAlign = 'center';
            ctx.fillText(Math.round(currentValue * 100) / 100 + prefix, left + width / 2, top + height / 2 + 10);
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
            backgroundColor: 'rgba(255, 255, 255, 1)',
            circumference: 250,
            rotation: 235,
            cutout: '90%',
            aspectRatio: 2,
            plugins: {
              tooltip: {
                filter: (a) => { return null }
              },
              title: {
                display: true,
                text: title
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
            <div style={{ width: '50%', height: '10%', display: "flex", justifyContent: "center", alignItems: "center" }}>{currentValue + prefix}</div>
            <div style={{ width: '50%', height: '10%', display: "flex", justifyContent: "center", alignItems: "center" }}>{maxValue + prefix}</div>
            </div>
        </div>
    );
}