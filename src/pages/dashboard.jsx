import { useEffect, useState } from 'react';

import ComputerDashItem from "./components/dashboard/ComputerDashItem";

export default function Dashboard() {
    const [isLoading, setLoading] = useState(true);
    const [isError, setError] = useState(false);
    const [computers, setComputers] = useState([]);

    useEffect(() => {
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
        return <div className="loading">Loading...</div>;
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
            <div className="row">
                <div className="d-flex justify-content-center">
                    {computersRender}
                </div>
            </div>
        </>
    );
}