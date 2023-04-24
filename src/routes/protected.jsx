import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import SideBar from '../components/layout/sidebar';
import TopNavigation from '../components/layout/top_nav';
import { useGlobalState } from "../main";

export default function Protected() {
    const [state, dispatch] = useGlobalState();
    return (
        <>
            <TopNavigation />
            <div className="container-fluid">
                <SideBar />
                <main className="content">
                    {state.token != null ? <Outlet /> : <Navigate to="/login"/> }
                </main>
            </div>
        </>
    );
}