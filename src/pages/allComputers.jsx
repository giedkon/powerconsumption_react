import { useParams } from "react-router-dom";
import { useEffect, useState } from 'react';
import moment from "moment/moment";
import ComputerConsumptionChart from "./components/charts/ComputerConsumptionChart";
import useElectricityCost from "../hooks/useElectricityCost";

export default function Computer() {
    let { computerId } = useParams();

    const cost = useElectricityCost({interval: 'month'});
    const [perPage, setPerPage] = useState(10);
    const [isLoading, setLoading] = useState(true);
    const [isError, setError] = useState(false);
    const [consumptions, setConsumptions] = useState([]);
    const [computerInfo, setComputerInfo] = useState({});
    const [moreExists, setMoreExists] = useState(true);
    const [prevCount, setPrevCount] = useState(0);
    const [chartRange, setChartRange] = useState("daily");

    function getNextPage() {
        setPrevCount(prevCount + perPage);
    }
    function setChartRangeFunc(range) {
        setChartRange(range);
    }

    let axiosParams = {
        Count: 10,
        prevCount: prevCount
    };

    useEffect(() => {
        axios
            .get('computer/power_consumption', { params: axiosParams })
            .then(function (response) {
                let newConsumptions = consumptions.concat(response.data);
                setLoading(false);
                setConsumptions(newConsumptions);
                if (response.data.length == 0) {
                    setMoreExists(false)
                }

            }).catch(function (error) {
                setLoading(false);
                setError(true);
            });
    }, [prevCount]);


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
    const consumptionRender = consumptions.map(function (consumption, index) {
        let time = moment(consumption.time).format('YYYY-MM-DD HH:mm');
        return (
            <tr key={consumption.id}>
                <td>{time}</td>
                <td>{consumption.inactivity || '--'}</td>
                <td>{consumption.cpuPowerDraw} kWh</td>
                <td>{consumption.gpuPowerDraw} kWh</td>
            </tr>
        );

    });

    return (
        <>
            <div className="row">
                <div className="col-6">
                    <h1>All computer power Consumptions</h1>
                </div>
                <div className="col d-flex flex-row-reverse align-items-center">
                    <h3>Current month cost: {cost}€</h3>
                </div>
                <div className="col-2 text-end me-3">
                    <a href={"computers/details"} className="btn btn-lg btn-primary">More details</a>
                </div>
            </div>
            {/*<div className="row">
                <a href={computerId + "/details"} className="btn btn-primary ms-3" style={{width: '8rem'}}>More details</a>
            </div>*/}
            <div className="row">
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
                    {moreExists ? <button className="btn btn-primary w-100" onClick={getNextPage}>Load More</button> : <div className='alert alert-info'>No more items</div>}
                </div>
            </div>
        </>
    );
}
