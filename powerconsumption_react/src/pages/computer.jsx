import { useParams } from "react-router-dom";
import { useEffect, useState } from 'react';
import axios from "axios";
import moment from "moment/moment";

export default function Computer() {
    let { computerId } = useParams();

    const [isLoading, setLoading] = useState(true);
    const [isError, setError] = useState(false);
    const [consumptions, setConsumptions] = useState([]);
    const [pagination, setPagination] = useState([]);
    const [cursor, setCursor] = useState([]);

    function getNextPage() {
        if (pagination.nextCursor != null) {
            setCursor(pagination.nextCursor);
        }
    }

    let axiosParams = {
        computerId: computerId,
        Count: 10,
        Cursor: cursor
    };

    useEffect(() => {
        axios
            .get(import.meta.env.VITE_API_URL + 'computer/' + computerId + '/power_consumption', { params: axiosParams })
            .then(function (response) {
                let newConsumptions = consumptions.concat(response.data.data);

                setLoading(false);
                setConsumptions(newConsumptions)
                setPagination(response.data.pagination)
            }).catch(function (error) {
                setLoading(false);
                setError(true);
            });
    }, [cursor]);


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

    const consumptionRender = consumptions.map(function (consumption, index) {
        let time = moment(consumption.time).format('YYYY-MM-DD HH:MM');
        return (
            <tr key={consumption.id}>
                <td>{time}</td>
                <td>{consumption.inactivity}</td>
                <td>{consumption.cpuPowerDraw} kWh</td>
                <td>{consumption.gpuPowerDraw} kWh</td>
            </tr>
        );

    });


    return (
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
            <button className="btn btn-primary w-100" onClick={getNextPage}>Load More</button>
        </div>
    );
}
