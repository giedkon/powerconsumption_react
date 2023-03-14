import React from "react";
import { useGlobalState } from "../../main";

export default function TopNavigation() {
    const [state, dispatch] = useGlobalState();
    return (
        <header className="header">
            <button onClick={() => dispatch({ open: !state.open })} className="menu-icon-btn" data-menu-icon-btn>
                <svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false" className="menu-icon">
                    <g>
                        <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"></path>
                    </g>
                </svg>
            </button>
        </header>
    );
}