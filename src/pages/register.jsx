import { Navigate, Link, redirect, useParams } from "react-router-dom";
import { useEffect, useState } from 'react';
import { useGlobalState } from "../main";
import axios from "axios";

export default function Register() {
    const [state, dispatch] = useGlobalState();
    const [isLoading, setLoading] = useState(false);
    const [isError, setError] = useState(false);
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [roles, setRoles] = useState(['user']);
    const [created, setCreated] = useState(false);

    function parseValidation(validationArray) {
        let errorMessage = '';
        for (const [key, value] of Object.entries(validationArray)) {
            for (const [key2, value2] of Object.entries(value)) {
                errorMessage += value2 + '\n';
            }
        }
        return errorMessage;
    }

    if (state.token) {
        return <Navigate to='/' />
    }

    if (isLoading) {
        return <div className="loading"></div>;
    }

    function register() {
        setLoading(true);
        axios
            .post(import.meta.env.VITE_API_URL + 'Authentication', {
                userName: userName,
                password: password,
                email: email,
                roles: roles
            })
            .then(function (response) {
                setLoading(false);
                setCreated(true);
            }).catch(function (error) {
                setLoading(false);
                setError(error);
                console.log(error.response);
                if (error.response.status == 422) {
                    setError('Please enter your credentials');
                } else if (error.response.status == 401) {
                    setError('Invalid credentials');
                } else if (error.response.status == 400) {
                    setError(parseValidation(error.response.data));
                } else {
                    setError(error.message);
                }
            });

    }

    if(created) {
        return <Navigate to='/login' created={true} />;
    }

    let error;
    if (isError) {
        error = (
            <div className="auth-alert alert alert-danger alert-dismissible"><pre>{typeof isError == 'string' ? isError : ''}</pre></div>
        );
    }

    return (
        <>
            <form>
                {error ? error : ''}
                <h1 className="site-title">{import.meta.env.VITE_SITE_NAME}</h1>
                <input value={userName} onChange={e => setUserName(e.target.value)} placeholder='Vartotojo vardas' className="form-control p-2 mb-2" name='name' type='text' />
                <input value={email} onChange={e => setEmail(e.target.value)} placeholder='Vartotojo el. paštas' className="form-control mb-2 p-2" name='email' type='email' />
                <input value={password} onChange={e => setPassword(e.target.value)} placeholder='Slaptažodis' className="form-control p-2" name='password' type='password' />
                <div className="d-flex justify-content-end">
                    <button type='submit' onClick={register} className="btn btn-primary w-100 mt-2 px-4">Register</button>
                </div>
                <div className="d-flex justify-content-end">
                    <Link to={'/login'} className="btn mt-2 px-4">Login</Link>
                    {/* <button onClick={login} className="btn mt-2 px-4 text-secondary">Forgot password</button> */}
                </div>
            </form>
        </>
    );
}
