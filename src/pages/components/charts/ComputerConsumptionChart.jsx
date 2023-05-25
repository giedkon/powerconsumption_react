import { useParams } from "react-router-dom";
import { useEffect, useRef, useState } from 'react';
import axios from "axios";
import moment from "moment/moment";
import Chart from "chart.js/auto";
import { collect } from "collect.js";


function BarChart(props) {
    const barchartRef = useRef(null);
    let preDataCPU = [];
    let preDataGPU = [];
    let preLabels = [];
    switch (props.range) {
        case 'day':
            preDataCPU = new Array(24).fill(0);
            preDataGPU = new Array(24).fill(0);
            collect(props.data).each(function (item) {
                let index = parseInt(moment(item.time).format('HH'));
                preDataCPU[index] = item.cpuPowerDraw;
                preDataGPU[index] = item.gpuPowerDraw;
            });
            preLabels = ['00', '01', '02', '03', '04', '05', '06', '07', '08',
                '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23'];
            break;
        case 'week':
            preDataCPU = new Array(7).fill(0);
            preDataGPU = new Array(7).fill(0);
            for (let i = 0; i < 7; i++) {
                preLabels.unshift(moment().subtract(i, 'days').format('MM-DD'));
            }
            collect(props.data).each(function (item) {
                let index = preLabels.indexOf(moment(item.time).format('MM-DD'));

                preDataCPU[index] = item.cpuPowerDraw;
                preDataGPU[index] = item.gpuPowerDraw;
            });
        case 'month':
            preDataCPU = new Array(30).fill(0);
            preDataGPU = new Array(30).fill(0);
            for (let i = 0; i < 30; i++) {
                preLabels.unshift(moment().subtract(i, 'days').format('DD'));
            }
            collect(props.data).each(function (item) {
                let index = preLabels.indexOf(moment(item.time).format('DD'));

                preDataCPU[index] = item.cpuPowerDraw;
                preDataGPU[index] = item.gpuPowerDraw;
            });
        case 'year':
            preDataCPU = new Array(12).fill(0);
            preDataGPU = new Array(12).fill(0);
            for (let i = 0; i < 12; i++) {
                preLabels.unshift(moment().subtract(i, 'month').format('MM'));
            }
            collect(props.data).each(function (item) {
                let index = preLabels.indexOf(moment(item.time).format('MM'));

                preDataCPU[index] = item.cpuPowerDraw;
                preDataGPU[index] = item.gpuPowerDraw;
            })
    }

    useEffect(() => {
        const barconfig = {
            type: 'bar',
            data: {
                labels: preLabels,
                datasets: [{
                    label: 'CPU Usage',
                    data: preDataCPU,
                    backgroundColor: ['rgba(255, 26, 104, 0.2)',],
                    borderColor: ['rgba(255, 26, 104, 1)',],
                    borderWidth: 1
                }, {
                    label: 'GPU Usage',
                    data: preDataGPU,
                    backgroundColor: ['rgba(104, 26, 255, 0.2)',],
                    borderColor: ['rgba(104, 26, 255, 1)',],
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

        <div style={{ width: '100%', height: '100%', border: "2px solid rgba(255, 26, 104, 0.2)", borderRadius: "10px", margin: 10 }}>
            <div className="limit-chart-canvas-container d-flex justify-content-center align-items-center">
                <canvas ref={barchartRef} />
            </div>
        </div>

    );
}

export default function ComputerConsumptionChart({ range, data }) {
    let today = moment().endOf('day').format('YYYY-MM-DDTHH:mm:ss');
    let previous = moment().startOf('day').format('YYYY-MM-DDTHH:mm:ss');
    let count = 24;
    let group_by = 'hour';

    switch (range) {
        case 'week':
            previous = moment().subtract('1', 'week').format('YYYY-MM-DDTHH:mm:ss');
            count = 7;
            group_by = 'day';
            break;
        case 'month':
            previous = moment().subtract('1', 'month').format('YYYY-MM-DDTHH:mm:ss');
            count = 30;
            group_by = 'day';
            break;
        case 'year':
            previous = moment().subtract('1', 'year').format('YYYY-MM-DDTHH:mm:ss');
            count = 12;
            group_by = 'month';
            break;
    }

    return (
        <div className="chart">
            <div className="row">
                <div className="col-12 py-2 text-center">
                    {range == 'day' ? `${moment(today).format('YYYY-MM-DD')}` : `${moment(previous).format('YYYY-MM-DD')} - ${moment(today).format('YYYY-MM-DD')}`}
                </div>
            </div>

            <BarChart range={range} data={data} />
        </div>
    );
}