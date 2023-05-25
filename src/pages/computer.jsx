import { useParams } from "react-router-dom";
import { useEffect, useState } from 'react';
import moment from "moment/moment";
import ComputerConsumptionChart from "./components/charts/ComputerConsumptionChart";
import EditComputerButton from "./components/EditComputerButton";
import useElectricityCost from "../hooks/useElectricityCost";

export default function Computer() {
    let { computerId } = useParams();

    const cost = useElectricityCost({interval: 'month', computerId: computerId});
    const [perPage, setPerPage] = useState(10);
    const [isLoading, setLoading] = useState(true);
    const [isError, setError] = useState(false);
    const [consumptions, setConsumptions] = useState([]);
    const [computerInfo, setComputerInfo] = useState({});
    const [moreExists, setMoreExists] = useState(true);
    const [prevCount, setPrevCount] = useState(0);
    const [chartRange, setChartRange] = useState("daily");

    function handleComputerUpdate(name) {
        setComputerInfo((prevInfo) => ({
            ...prevInfo,
            name: name
        }));
    }

    function getNextPage() {
        setPrevCount(prevCount + perPage);
    }
    function setChartRangeFunc(range) {
        setChartRange(range);
    }

    let axiosParams = {
        computerId: computerId,
        Count: 10,
        prevCount: prevCount
    };

    useEffect(() => {
        axios
            .get('computer/' + computerId)
            .then(function (response) {
                console.log(response.data);
                setComputerInfo(response.data);
            }).catch(function (error) {
                setLoading(false);
                setError(true);
            });
    }, []);

    useEffect(() => {
        axios
            .get('computer/' + computerId + '/power_consumption', { params: axiosParams })
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
        let time = moment(consumption.time).format('YYYY-MM-DD HH:mm:ss');
        return (
            <tr key={consumption.id}>
                <td>{time}</td>
                <td>{consumption.cpuPowerDraw.toFixed(8)} kWh</td>
                <td>{consumption.gpuPowerDraw.toFixed(8)} kWh</td>
            </tr>
        );

    });

    return (
        <>
            <div className="panel row">
                <div className="col-12 col-lg-4">
                    <div className="h-100 d-flex flex-column justify-content-center align-items-center">
                        <h1>{computerInfo.name} Power Consumptions</h1>
                    </div>
                </div>
                <div className="col-12 col-lg-4">
                    <div className="h-100 d-flex flex-column justify-content-center align-items-center">
                        <h3>Current month cost: {Math.ceil(cost * 100) / 100}€</h3>
                    </div>
                </div>
                <div className="col-12 col-lg-4">
                    <div className="h-100 d-flex flex-row justify-content-center align-items-center">
                        <a href={computerId + "/details"} className="btn btn-lg btn-primary m-1">More details</a>
                        <EditComputerButton
                            computerId={computerId}
                            size='lg'
                            handleComputerUpdate={handleComputerUpdate}
                        />
                    </div>
                </div>
            </div>
            {/*<div className="row">
                <a href={computerId + "/details"} className="btn btn-primary ms-3" style={{width: '8rem'}}>More details</a>
            </div>*/}
            <div className="panel row">
                <div className="tables">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Timestamp</th>
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
