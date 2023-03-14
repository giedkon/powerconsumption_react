import { useState, useEffect } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import { useGlobalState } from "../../main";


export default function SideBar() {
    const [state, dispatch] = useGlobalState();
    const location = useLocation();
    return (
        <>
            <aside className={`sidebar ${state.open ? 'open' : ''}`}>
                <div className="top-sidebar">
                    <a href="#" className=" project-logo"><img /></a>
                    <div className="hidden-sidebar your-project"></div>
                    <div className="hidden-sidebar  project-name"></div>
                </div>
                <div className="middle-sidebar">
                    <ul className="sidebar-list">
                        <li className={`sidebar-list-item ${location.pathname == '/' ? 'active' : ''}`}>
                            <Link to="/" className="sidebar-link">
                                <svg className="sidebar-icon" viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false">
                                    <g>
                                        <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"></path>
                                    </g>
                                </svg>
                                <div className="hidden-sidebar">Dashboard</div>
                            </Link>
                        </li>
                        <li className={`sidebar-list-item ${location.pathname == '/computers' ? 'active' : ''}`}>
                            <Link to="/computers" className="sidebar-link">
                                <svg className="sidebar-icon" viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false">
                                    <g>
                                        <path d="M1 2h22v12H1V2zm1 1v10h20V3H2zm4 15h10v1H6v-1zm6-4v4h-1v-4h1z" />
                                    </g>
                                </svg>
                                <div className="hidden-sidebar">Computers</div>
                            </Link>
                        </li>
                        <li className={`sidebar-list-item ${location.pathname == '/diagrams' ? 'active' : ''}`}>
                            <a href="/diagrams" className="sidebar-link">
                                <svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false" className="sidebar-icon">
                                    <g>
                                        <path
                                            d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z">
                                        </path>
                                    </g>
                                </svg>
                                <div className="hidden-sidebar">Diagrams</div>
                            </a>
                        </li>


                    </ul>
                </div>
                <div className="bottom-sidebar">
                    <ul className="sidebar-list">
                        <li className="sidebar-list-item">
                            <a href="#" className="sidebar-link">
                                <svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false" className="sidebar-icon">
                                    <g>
                                        <path
                                            d="M19.43 12.98c.04-.32.07-.64.07-.98s-.03-.66-.07-.98l2.11-1.65c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.3-.61-.22l-2.49 1c-.52-.4-1.08-.73-1.69-.98l-.38-2.65C14.46 2.18 14.25 2 14 2h-4c-.25 0-.46.18-.49.42l-.38 2.65c-.61.25-1.17.59-1.69.98l-2.49-1c-.23-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64l2.11 1.65c-.04.32-.07.65-.07.98s.03.66.07.98l-2.11 1.65c-.19.15-.24.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1c.52.4 1.08.73 1.69.98l.38 2.65c.03.24.24.42.49.42h4c.25 0 .46-.18.49-.42l.38-2.65c.61-.25 1.17-.59 1.69-.98l2.49 1c.23.09.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.65zM12 15.5c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5z">
                                        </path>
                                    </g>
                                </svg>
                                <div className="hidden-sidebar">Settings</div>
                            </a>
                        </li>

                    </ul>
                </div>
            </aside>
        </>
    );
};