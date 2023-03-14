
import axios from "axios";
import { Chart } from "react-google-charts";

export default function ComputerDashItem() {
    console.log(import.meta.env.VITE_API_URL)
    axios
        .get(import.meta.env.VITE_API_URL + 'computers', { crossDomain: true })
        .then(function (response) {
            console.log(response);
        });

    return (
        <div className="card">
            <a href="Computer.html" className="card-link">
                <div className="card-body">
                    <svg className="card-svg" viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false">
                        <g>
                            <path d="M1 2h22v12H1V2zm1 1v10h20V3H2zm4 15h10v1H6v-1zm6-4v4h-1v-4h1z" />
                        </g>
                    </svg>
                    <h5 className="card-title">Computer 1</h5>
                </div>
            </a>
        </div>
    );
}