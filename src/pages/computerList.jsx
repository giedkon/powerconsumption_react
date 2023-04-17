import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from 'react';
import axios from "axios";
import moment from "moment/moment";
import momentDurationFormatSetup from "moment-duration-format";
import AddComputerButton from "./components/AddComputerButton";
momentDurationFormatSetup(moment);

function getTimeStr(seconds) {
    var duration = moment.duration(seconds, 'seconds');
    return duration.format("d[d] h[h] m[m] s[s]");
}

export default function ComputerList() {
    const [isLoading, setLoading] = useState(true);
    const [isError, setError] = useState(false);
    const [computers, setComputers] = useState([]);

    function handleAddComputer(computer) {
        setComputers([...computers, computer]);
    }

    useEffect(() => {
        axios
            .get(import.meta.env.VITE_API_URL + 'computer')
            .then(function (response) {
                setLoading(false);
                setComputers(response.data)
            }).catch(function (error) {
                console.log(error);
                setLoading(false);
                setError(true);
            });
    }, [computers]);


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

    const consumptionRender = computers.map(function (computer, index) {
        let inactiveTime = getTimeStr(computer.inactivity);
        return (
            <tr key={computer.id}>
                <td>{computer.name}</td>
                <td>{inactiveTime}</td>
                <td>--</td>
                <td>
                    <Link to={'/computer/' + computer.id} className="button" >Details</Link>
                </td>
            </tr>
        );

    });


    return (
        <>
            <div className="row">
                <div className="col">
                    <h1>All computers</h1>
                </div>
                <div className="col text-end me-3">
                    <AddComputerButton 
                        size='lg' 
                        onAddComputer={handleAddComputer} 
                    />
                </div>
            </div>
            <div className="row">
                <div className="tables">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Computer Name</th>
                                <th>Inactivity </th>
                                <th>Total power consumption (last 5 min)</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {consumptionRender}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
};