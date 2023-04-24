import React from "react";
import { Outlet } from "react-router-dom";
import { useGlobalState } from "../main";


export default function Root() {
    const [state, dispatch] = useGlobalState();
    // dispatch({ token: localStorage.getItem('token') });
    return (
        <>
            <Outlet />
        </>
    );
}