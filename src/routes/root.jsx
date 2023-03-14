import React from "react";
import { useState } from "react";
import { Outlet } from "react-router-dom";
import SideBar from '../components/layout/sidebar';
import TopNavigation from '../components/layout/top_nav';


export default function Root() {
    return (
        <>
            <TopNavigation />
            <div className="container-fluid">
                <SideBar />
                <main className="content">
                    <Outlet />
                </main>
            </div>
        </>
    );
}