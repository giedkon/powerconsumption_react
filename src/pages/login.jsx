import { Navigate, Link, redirect, useParams } from "react-router-dom";
import { useEffect, useState } from 'react';
import { useGlobalState } from "../main";

export default function Login(props) {
    const [state, dispatch] = useGlobalState();
    const [isLoading, setLoading] = useState(false);
    const [isError, setError] = useState(false);
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');

    if (state.token) {
        return <Navigate to='/' />
    }

    if (isLoading) {
        return <div className="loading"></div>;
    }

    function login() {
        setLoading(true);
        axios
            .post('Authentication/login', {
                userName: userName,
                password: password
            })
            .then(function (response) {
                setLoading(false);
                dispatch({ token: response.data.token });
                dispatch({ userName: userName });
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('username', userName);
            }).catch(function (error) {
                setLoading(false);
                setError(error);
                if (error.response.status == 422) {
                    setError('Please enter your credentials');
                } else if (error.response.status == 401) {
                    setError('Invalid credentials');
                } else {
                    setError(error.message);
                }
            });

    }

    let error;
    if (isError) {
        error = (
            <div className="auth-alert alert alert-danger">{typeof isError == 'string' ? isError : ''}</div>
        );
    }

    return (
        <>
            <form>
                {error ? error : ''}
                <h1 className="site-title">Login</h1>
                <input value={userName} onChange={e => setUserName(e.target.value)} placeholder='Vartotojo vardas' className="form-control p-2 mb-2" name='name' type='text' />
                <input value={password} onChange={e => setPassword(e.target.value)} placeholder='Slaptažodis' className="form-control p-2" name='password' type='password' />
                <div className="d-flex justify-content-end">
                    <button type='submit' onClick={login} className="btn btn-primary w-100 mt-2 px-4">Login</button>
                </div>
                <div className="d-flex justify-content-end">
                    <Link to={'/register'} className="btn mt-2 px-4">Register</Link>
                    {/* <Link to={'/register'} className="btn btn-disabled mt-2 px-4">Register</Link> */}
                </div>
            </form>
        </>
    );
}
