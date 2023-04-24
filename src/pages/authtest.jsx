import { Navigate, Link, redirect, useParams } from "react-router-dom";
import { useEffect, useState } from 'react';
import { useGlobalState } from "../main";

export default function AuthTest() {
    const [state, dispatch] = useGlobalState();
    const [isLoading, setLoading] = useState(false);
    const [isError, setError] = useState(false);
    const [message, setMessage] = useState('');

    if (isLoading) {
        return <div className="loading"></div>;
    }

    axios
        .get('Authentication/computer/computerid1/test')
        .then(function (response) {
            setLoading(false);
            setMessage('auth test successful')
        }).catch(function (error) {
            setLoading(false);
            setMessage('auth test unsuccessful')
        });

    return (
        <>
            {message};
        </>
    );
}
