import { useEffect, useState } from 'react';
import moment from "moment";
import ComputerDashItem from "./components/dashboard/ComputerDashItem";
import LimitChart from './components/charts/LimitChart';
import axios from 'axios';
import useElectricityCost from '../hooks/useElectricityCost';

export default function Dashboard() {
    const [isLoading, setLoading] = useState(true);
    const [isError, setError] = useState(false);
    const [computers, setComputers] = useState([]);
    const [powerLimit, setPowerLimit] = useState({});
    const [maxEnergyPriceLimit, setMaxEnergyPriceLimit] = useState({});
    const [powerUsage, setPowerUsage] = useState(0);
    const cost = useElectricityCost({interval: 'month'});

    useEffect(() => {
        axios
            .get(import.meta.env.VITE_API_URL + 'power_consumption/limit')
            .then(function (response) {
                setPowerLimit(response.data.at(-1));
            }).catch(function (error) {
                setError(true);
            })

        axios
            .get(import.meta.env.VITE_API_URL + 'electricity_cost/limit')
            .then(function (response) {
                setMaxEnergyPriceLimit(response.data.at(-1));
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
                console.log(response.data)
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
            <div className="panel row mb-3">
                <div className="d-flex justify-content-center">
                    <LimitChart currentValue={Math.ceil(cost * 1000) / 1000} maxValue={powerLimit.maxValue} title={'Power usage'} prefix={'kWh'} />
                    <LimitChart currentValue={Math.ceil(cost * 100) / 100} maxValue={maxEnergyPriceLimit.maxValue} title={'Expenses'} prefix={'Eur'} />
                </div>
            </div>
            <div className="panel row">
                <div className="computer-list-dashboard d-flex flex-wrap justify-content-center">
                    {computersRender}
                </div>
            </div>
        </>
    );
}