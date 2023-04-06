import { useParams } from "react-router-dom";
import { useEffect, useRef, useState } from 'react';
import axios from "axios";
import moment from "moment/moment";
import Chart from "chart.js/auto";
import { collect } from "collect.js";


function BarChart(props) {
    const barchartRef = useRef(null);
    console.log(props);
    let preDataCPU = [];
    let preDataGPU = [];
    let preLabels = [];
    switch (props.range) {
        case 'daily':
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
        case 'weekly':
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
        case 'monthly':
            preDataCPU = new Array(30).fill(0);
            preDataGPU = new Array(30).fill(0);
            for (let i = 0; i < 30; i++) {
                preLabels.unshift(moment().subtract(i, 'days').format('MM-DD'));
            }
            collect(props.data).each(function (item) {
                let index = preLabels.indexOf(moment(item.time).format('MM-DD'));

                preDataCPU[index] = item.cpuPowerDraw;
                preDataGPU[index] = item.gpuPowerDraw;
            });
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
            <div>
                <canvas ref={barchartRef} />
            </div>
        </div>

    );
}

export default function ComputerConsumptionChart({ computerId, range }) {
    let today = moment().endOf('day').format('YYYY-MM-DDTHH:mm:ss');
    let previous = moment().startOf('day').format('YYYY-MM-DDTHH:mm:ss');
    let count = 24;
    let group_by = 'hour';
    // console.log(range);

    switch (range) {
        case 'weekly':
            previous = moment().subtract('1', 'week').format('YYYY-MM-DDTHH:mm:ss');
            count = 7;
            group_by = 'day';
            break;
        case 'monthly':
            previous = moment().subtract('1', 'month').format('YYYY-MM-DDTHH:mm:ss');
            count = 30; // lol
            group_by = 'day';
            break;
    }

    let axiosParams = {
        computerId: computerId,
        Count: count,
        group_by: group_by,
        minTime: previous,
        maxTime: today
    };

    const [isLoading, setLoading] = useState(true);
    const [isError, setError] = useState(false);
    const [data, setData] = useState([]);

    useEffect(() => {
        axios
            .get(import.meta.env.VITE_API_URL + 'computer/' + computerId + '/power_consumption', { params: axiosParams })
            .then(function (response) {
                setLoading(false);
                setData(response.data);
            }).catch(function (error) {
                setLoading(false);
                setError(true);
            });
    }, [range]);

    // console.log(data);

    if (isLoading) {
        return <div className="loading">Loading...</div>;
    }

    if (isError) {
        return (
            <div className="container-fluid">
                <div className="alert alert-danger w-100">API ERROR</div>
            </div>
        );
    }

    return (
        <div className="chart">
            <div className="row">
                <div className="col-12 py-2 text-center">
                    {range == 'daily' ? `${moment(today).format('YYYY-MM-DD')}` : `${moment(previous).format('YYYY-MM-DD')} - ${moment(today).format('YYYY-MM-DD')}`}
                </div>
            </div>

            <BarChart range={range} data={data} />
        </div>
    );
}