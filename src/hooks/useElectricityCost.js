import { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment";

export default function useElectricityCost({ interval, computerId }) {
    const [cost, setCost] = useState(0);

    useEffect(() => {
        const currentTime = moment().endOf('day').format('YYYY-MM-DDTHH:mm');
        let endTime = moment().format('YYYY-MM-DDTHH:mm');

        switch (interval) {
            case 'day':
                endTime = moment().startOf('day').format('YYYY-MM-DDTHH:mm');
                break;
            case 'month':
                endTime = moment().startOf('month').format('YYYY-MM-DDTHH:mm');
            default:
                break;
        }

        console.log(endTime, currentTime);

        if (computerId == undefined) {
            axios
                .get(`electricity_cost/price?From=${endTime}&To=${currentTime}`)
                .then((response) => {
                    console.log(response.data);
                    setCost(response.data);
                })
                .catch((err) => {
                    console.log(err);
                });
        } else {
            axios
                .get(`electricity_cost/price?From=${endTime}&To=${currentTime}&ComputerId=${computerId}`)
                .then((response) => {
                    console.log(response.data);
                    setCost(response.data);
                })
                .catch((err) => {
                    console.log(err);
                });
        }

    }, []);

    return cost;
}