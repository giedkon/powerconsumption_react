import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from 'react';
import axios from "axios";
import moment from "moment/moment";
import momentDurationFormatSetup from "moment-duration-format";
import AddComputerButton from "./components/AddComputerButton";
import EditComputerButton from "./components/EditComputerButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faCircleInfo, faTrash } from "@fortawesome/free-solid-svg-icons";
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

    function deleteComputer(id) {
        if (confirm("Are you sure?") == true) {
            axios
                .delete(import.meta.env.VITE_API_URL + 'computer/' + id)
                .then(function (response) {
                    setComputers((prevComputers) => {
                        return prevComputers.filter(comp => comp.id !== id);
                    });
                })
                .catch(function (error) {
                    console.log(error);
                });
        }
    }

    useEffect(() => {
        axios
            .get(import.meta.env.VITE_API_URL + 'computer')
            .then(function (response) {
                setLoading(false);
                setComputers(response.data)
            })
            .catch(function (error) {
                console.log(error);
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

    const consumptionRender = computers.map(function (computer, index) {
        let inactiveTime = getTimeStr(computer.inactivity);
        return (
            <tr key={computer.id}>
                <td>{computer.name}</td>
                <td>{inactiveTime}</td>
                <td>--</td>
                <td>
                    <div className="computer-list-buttons">
                        <Link to={'/computer/' + computer.id} className="button" >
                            <FontAwesomeIcon className="text-black" icon={faCircleInfo} />
                            <span className='computer-list-button-text'>Details</span>
                        </Link>
                        <Link className="button-red" onClick={() => deleteComputer(computer.id)}>
                            <FontAwesomeIcon className="text-black" icon={faTrash} />
                            <span className='computer-list-button-text'>Delete</span>
                        </Link>
                    </div>
                </td>
            </tr>
        );

    });


    return (
        <>
            <div className="panel row">
                <div className="col-12 col-md-6 text-md-start text-center">
                    <h1>All computers</h1>
                </div>
                <div className="col-12 col-md-6 text-md-end text-center">
                    <AddComputerButton
                        size='lg'
                        onAddComputer={handleAddComputer}
                    />
                    <a href="/allComputers" className="btn btn-lg btn-primary m-1">
                        All computer details
                    </a>
                </div>
            </div>
            <div className="panel row">
                <div className="tables">
                    <table className="w-100 table table-responsive">
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