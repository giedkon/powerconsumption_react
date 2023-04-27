import { useEffect, useState } from 'react';
import moment from "moment";
import ComputerDashItem from "./components/dashboard/ComputerDashItem";
import LimitChart from './components/charts/LimitChart';
import axios from 'axios';

export default function Dashboard() {
    const [isLoading, setLoading] = useState(true);
    const [isError, setError] = useState(false);
    const [computers, setComputers] = useState([]);
    const [powerLimit, setPowerLimit] = useState({});
    const [powerUsage, setPowerUsage] = useState(0);

    useEffect(() => {
        axios
            .get(import.meta.env.VITE_API_URL + 'power_consumption/limit')
            .then(function (response) {
                setPowerLimit(response.data.at(-1));
            }).catch(function (error) {
                setError(true);
            })

        const powerParams = {
            groupBy: 'day',
            count: 1,
            minTime: moment().format("YYYY-MM-DD")
        }
        axios
            .get(import.meta.env.VITE_API_URL + 'computer/power_consumption', {params: powerParams})
            .then(function(response) {
                setPowerUsage(response.data.reduce((sum, a) => sum + a.cpuPowerDraw + a.gpuPowerDraw, 0))
            }).catch(function(error) {
                setError(true);
            });

        axios
            .get('computer')
            .then(function (response) {
                setLoading(false);
                setComputers(response.data)
            }).catch(function (error) {
                setLoading(false);
                setError(true);
            });
    }, []);

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

    const computersRender = computers.map((computer) =>
        <ComputerDashItem key={computer.id} computerId={computer.id} computerName={computer.name} />
    );

    return (
        <>
            <div className="row text-center mb-3">
                <h1>Dashboard</h1>
            </div>
            <div className="row mb-3">
                <div className="d-flex justify-content-center">
                    <LimitChart currentValue={powerUsage} maxValue={powerLimit.maxValue} title={'Power usage'} />
                </div>
            </div>
            <div className="row">
                <div className="d-flex justify-content-center">
                    {computersRender}
                </div>
            </div>
        </>
    );
}