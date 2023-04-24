import React from "react";
import { Outlet } from "react-router-dom";

export default function Auth() {
    return (
        <>
            <div className="auth-container">
                <div className="container">
                    <div className="row">
                        <div className="offset-3 col-6 p-4 auth-card">
                            <Outlet />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}