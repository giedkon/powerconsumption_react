import { useEffect, useState } from 'react';
import axios from "axios";
import { useParams } from "react-router-dom";
import moment from "moment/moment";
import ComputerConsumptionChart from "./components/charts/ComputerConsumptionChart";

export default function ComputerDetails() {

    function setChartRangeFunc(range) {
        switch (range) {
            case 'day':
                setChartParam((prevParam) => ({
                    ...prevParam,
                    previous: moment().startOf('day').format('YYYY-MM-DDTHH:mm:ss'),
                    count: 24,
                    group_by: 'hour'
                }));
                break;
            case 'week':
                setChartParam((prevParam) => ({
                    ...prevParam,
                    previous: moment().subtract('1', 'week').format('YYYY-MM-DDTHH:mm:ss'),
                    count: 7,
                    group_by: 'day',
                }));
                break;
            case 'month':
                setChartParam((prevParam) => ({
                    ...prevParam,
                    previous: moment().subtract('1', 'month').format('YYYY-MM-DDTHH:mm:ss'),
                    count: 30,
                    group_by: 'day',
                }));
                break;
            case 'year':
                setChartParam((prevParam) => ({
                    ...prevParam,
                    previous: moment().subtract('1', 'year').format('YYYY-MM-DDTHH:mm:ss'),
                    count: 12,
                    group_by: 'month'
                }));
        }

        setChartRange(range);
    }

    const { computerId } = useParams();
    const [computerInfo, setComputerInfo] = useState({});
    const [chartRange, setChartRange] = useState("day");
    const [chartParam, setChartParam] = useState({
            count: 24,
            group_by: 'hour',
            today: moment().endOf('day').format('YYYY-MM-DDTHH:mm:ss'),
            previous: moment().startOf('day').format('YYYY-MM-DDTHH:mm:ss')
        });
    const [isLoading, setLoading] = useState(true);
    const [isError, setError] = useState(false);
    const [data, setData] = useState([]);

    if (computerId != null) {
        useEffect(() => {
            axios
                .get(import.meta.env.VITE_API_URL + 'computer/' + computerId)
                .then(function (response) {
                    //console.log(response.data);
                    setComputerInfo(response.data);
                }).catch(function (error) {
                    setLoading(false);
                    setError(true);
                });
        }, []);
    }

    useEffect(() => {
        const axiosParams = {
            computerId: computerId,
            Count: chartParam.count,
            groupBy: chartParam.group_by,
            minTime: chartParam.previous,
            maxTime: chartParam.today
        };

        const endpoint = computerId == null ? 'computer/power_consumption' : 'computer/' + computerId + '/power_consumption';

        axios
            .get(import.meta.env.VITE_API_URL + endpoint, { params: axiosParams })
            .then(function (response) {
                setLoading(false);
                setData(response.data);
                //console.log(response.data);
            }).catch(function (error) {
                setLoading(false);
                setError(true);
            });
    }, [chartRange]);

    if (isLoading) {
        return <div className="loading"></div>;
    }

    if (isError) {
        return (
            <div className="container-fluid">
                <div className="alert alert-danger w-100">API ERROR</div>
            </div>
        );
    }

    const consumptionRender = data.map(function (val, index) {
        let time = moment(val.time).format('YYYY-MM-DD HH:mm');

        if (chartRange != 'hour' || chartRange != 'day') {
            time =  moment(val.time).format('YYYY-MM-DD');
        }

        return (
            <tr key={val.id}>
                <td>{time}</td>
                <td>{val.inactivity.toFixed(5) || '--'}</td>
                <td>{val.cpuPowerDraw} kWh</td>
                <td>{val.gpuPowerDraw} kWh</td>
            </tr>
        );

    });

    const RenderTable = () => {
        return (
            <>
                <div>
                    <h1>{computerId != null ? computerInfo.name : 'All computer'} details</h1>
                </div>
                <div className="tables">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Timestamp</th>
                                <th>Inactivity (seconds)</th>
                                <th>CPU Consumption (kWh)</th>
                                <th>GPU Consumption (kWh)</th>
                            </tr>
                        </thead>
                        <tbody id="data">
                            {consumptionRender}
                        </tbody>
                    </table>
                </div>
            </>
        )
    }

    const NoResultError = () => {
        return (
            <div className='d-flex justify-content-center mt-5'>
                <h1>There is no {computerId != null ? computerInfo.name : ''} data for the selected timespan!</h1>
            </div>
        )
    }

    return (
        <div className='row'>
            <div className="col">
                {data.length != 0 ? <RenderTable /> : <NoResultError />}
            </div>
            <div className="col-md-5 col-12 mx-5 mt-3">
                <div className="d-flex flex-row justify-content-center">
                        <button 
                            className={chartRange == 'day' ? 'btn btn-primary mx-1' : 'btn btn-info mx-1'} 
                            onClick={() => setChartRangeFunc('day')}>
                                Day
                        </button>
                        <button 
                            className={chartRange == 'week' ? 'btn btn-primary mx-1' : 'btn btn-info mx-1'}
                            onClick={() => setChartRangeFunc('week')}>
                                Week
                        </button>
                        <button 
                            className={chartRange == 'month' ? 'btn btn-primary mx-1' : 'btn btn-info mx-1'}  
                            onClick={() => setChartRangeFunc('month')}>
                                Month
                        </button>
                        <button 
                            className={chartRange == 'year' ? 'btn btn-primary mx-1' : 'btn btn-info mx-1'}  
                            onClick={() => setChartRangeFunc('year')}>
                                Year
                        </button>
                </div>
                <ComputerConsumptionChart range={chartRange} data={data}/>
            </div>
        </div>
    )
}