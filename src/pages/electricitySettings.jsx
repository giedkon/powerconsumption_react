import { useState, useEffect } from 'react';
import Moment from 'moment';
import axios from 'axios';
import '../assets/css/index.css';

export default function ElectricitySettings() {
    const [activeButton, setActiveButton] = useState(1);
    const [firstTimeFrom, setFirstTimeFrom] = useState('');
    const [firstTimeTo, setFirstTimeTo] = useState(''); 
    const [secondTimeFrom, setSecondTimeFrom] = useState('');
    const [secondTimeTo, setSecondTimeTo] = useState(''); 
    const [firstPrice, setFirstPrice] = useState(0);
    const [secondPrice, setSecondPrice] = useState(0);
    const [formError, setFormError] = useState('');
    const [settingsIds, setSettingsIds] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    function getSettings() {
        axios
            .get('electricity_cost')
            .then((response) => {
                if (response.data.length == 2) {
                    setActiveButton(2);
                    setFirstTimeFrom(response.data[0].from);
                    setFirstTimeTo(response.data[0].to);
                    setSecondTimeFrom(response.data[1].from);
                    setSecondTimeTo(response.data[1].to);
                    setFirstPrice(response.data[0].price);
                    setSecondPrice(response.data[1].price);
                    setSettingsIds([response.data[0].id, response.data[1].id]);
                } else if (response.data.length == 1) {
                    setActiveButton(1);
                    setFirstPrice(response.data[0].price);
                    setSettingsIds([response.data[0].id]);
                }

                setIsLoading(false);
            })
            .catch((err) => {
                console.log(err);
            });
    }

    useEffect(() => {
        setIsLoading(true);
        getSettings();        
    }, []);

    if (isLoading) {
        return <div className="loading"></div>;
    }

    function onZoneClick(e) {
        const id = e.target.id;
        setActiveButton(id);
        setFormError('');
    }

    function OneTimeZone() {
        return (
            <form onSubmit={onOneZoneFormSubmit}>
                <label htmlFor="priceInput" className='form-label'>Price (Eur/kWh)</label>
                <div className="d-flex justify-content-center mb-3">
                    <input 
                        type="number" 
                        className='form-control w-25 text-center' 
                        id='priceInput'
                        placeholder='0'
                        value={firstPrice}
                        min={0}
                        step={.01}
                        onChange={(e) => setFirstPrice(e.target.value)}
                    />
                </div>
                <button type='submit' className='btn btn-primary'>{firstPrice != 0 && secondPrice == 0 ? "Update" : "Save"}</button>
            </form>
        );
    }

    function TwoTimeZone() {
        return (
            <form onSubmit={onTwoZoneSubmit}>
                <div className="d-flex justify-content-center mb-3">
                    <div className="input-group w-75">
                        <span className="input-group-text">Time from - to</span>
                        <input 
                            type="time" 
                            className="form-control"
                            value={firstTimeFrom}
                            onChange={(e) => setFirstTimeFrom(e.target.value)} 
                        />
                        <input 
                            type="time" 
                            className="form-control"
                            value={firstTimeTo}
                            onChange={(e) => setFirstTimeTo(e.target.value)} 
                        />
                    </div>
                </div>
                <label htmlFor="priceInput" className='form-label'>Price (Eur/kWh)</label>
                <div className="d-flex justify-content-center mb-3">
                    <input 
                        type="number" 
                        className='form-control w-25 text-center' 
                        id='priceInput' 
                        placeholder='0'
                        value={firstPrice}
                        min={0}
                        step={.01}
                        onChange={(e) => setFirstPrice(e.target.value)}
                    />
                </div>
                <hr className='mb-4'></hr>
                <div className="d-flex justify-content-center mb-3">
                    <div className="input-group w-75">
                        <span className="input-group-text">Time from - to</span>
                        <input 
                            type="time" 
                            className="form-control"
                            value={secondTimeFrom}
                            onChange={(e) => setSecondTimeFrom(e.target.value)} 
                        />
                                                <input 
                            type="time" 
                            className="form-control"
                            value={secondTimeTo}
                            onChange={(e) => setSecondTimeTo(e.target.value)} 
                        />
                    </div>
                </div>
                <label htmlFor="priceInput" className='form-label'>Price (Eur/kWh)</label>
                <div className="d-flex justify-content-center mb-3">
                    <input 
                        type="number" 
                        className='form-control w-25 text-center' 
                        id='priceInput' 
                        placeholder='0'
                        value={secondPrice}
                        min={0}
                        step={.01}
                        onChange={(e) => setSecondPrice(e.target.value)}
                    />
                </div>
                <button type='submit' className='btn btn-primary'>{firstPrice != 0 && secondPrice != 0 ? "Update" : "Save"}</button>
            </form>
        )
    }

    function onOneZoneFormSubmit(e) {
        e.preventDefault();
        setFormError('');

        if (settingsIds.length === 1) {
            axios
                .put(`electricity_cost/collection/(${settingsIds[0]})`,
                [{
                    'From': '00:00',
                    'To': '23:59',
                    'Price': firstPrice
                }])
                .then((response) => {
                    setFormError('Updated successfully!');
                    console.log(response);
                })
                .catch((err) => {
                    console.log(err);
                });
        } else {
            axios
                .delete(`electricity_cost/collection/(${settingsIds[0]},${settingsIds[1]})`)
                .then((response) => {
                    console.log(response);
                })
                .catch((err) => {
                    console.log(err);
                });

            axios
                .post('electricity_cost/collection',             
                [{
                    'From': '00:00',
                    'To': '23:59',
                    'Price': firstPrice
                }])
                .then((response) => {
                    setFormError('Saved successfully!');
                    console.log(response);
                })
                .catch((err) => {
                    console.log(err);
                });
        }
    }

    function onTwoZoneSubmit(e) {
        e.preventDefault();
        setFormError('');
        
        if (settingsIds.length > 1) {
            if (isDay()) {
                axios
                    .put(`electricity_cost/collection/(${settingsIds[0]},${settingsIds[1]})`,
                    [
                        {
                            'From': firstTimeFrom,
                            'To': firstTimeTo,
                            'Price': firstPrice
                        },
                        {
                            'From': secondTimeFrom,
                            'To': secondTimeTo,
                            'Price': secondPrice
                        }
                    ])
                    .then((response) => {
                        setFormError('Updated successfully!');
                        console.log(response);
                    })
                    .catch((err) => {
                        console.log(err);
                    });
            } else {
                setFormError("Intervals need to add up to 24 hours!");
            }
        } else {
            if (isDay()) {
                axios
                    .delete(`electricity_cost/collection/(${settingsIds[0]})`)
                    .then((response) => {
                        console.log(response);
                    })
                    .catch((err) => {
                        console.log(err);
                    });

                axios
                    .post('electricity_cost/collection',             
                    [
                        {
                            'From': firstTimeFrom,
                            'To': firstTimeTo,
                            'Price': firstPrice
                        },
                        {
                            'From': secondTimeFrom,
                            'To': secondTimeTo,
                            'Price': secondPrice
                        }
                    ])
                    .then((response) => {
                        setFormError('Saved successfully!');
                        console.log(response);
                    })
                    .catch((err) => {
                        console.log(err);
                    });
            } else {
                setFormError("Intervals need to add up to 24 hours!");
            }
        }
    }

    function isDay() {
        const firstIntervalStart = Moment(firstTimeFrom, "hh:mm");
        const firstIntervalEnd = Moment(firstTimeTo, "hh:mm");
        const secondIntervalStart = Moment(secondTimeFrom, "hh:mm");
        const secondIntervalEnd = Moment(secondTimeTo, "hh:mm");

        const firstIntervalDuration = (firstIntervalEnd.minutes() - firstIntervalStart.minutes());
        const secondIntervalDuration = (secondIntervalEnd.minutes() - secondIntervalStart.minutes());

        const totalDuration = firstIntervalDuration + secondIntervalDuration;

        if (totalDuration === 0) {
            return true;
        }

        return false;
    }

    return (
        <div className="container">
            <div className="row">
                <h1 className="display-4 text-center mt-5">Electricity plan settings</h1>
            </div>
            <div className="row">
                <div className="d-flex justify-content-center">
                    <div className="col-6">
                        <div className="card text-center w-100">
                            <div className="card-header">
                                <ul className="nav nav-pills card-header-pills justify-content-center">
                                    <li className="nav-item">
                                        <a 
                                            id='1' 
                                            className={activeButton == 1 ? "nav-link active" : "nav-link"} 
                                            href="#"
                                            onClick={onZoneClick}>
                                            One time zone
                                        </a>
                                    </li>
                                    <li className="nav-item">
                                        <a 
                                            id='2' 
                                            className={activeButton == 2 ? "nav-link active" : "nav-link"} 
                                            href="#"
                                            onClick={onZoneClick}>
                                            Two time zones
                                        </a>
                                    </li>
                                </ul>
                            </div>
                            <div className="card-body mt-2">
                                <p className={formError.length != 0 ? 'text-danger d-block' : 'text-danger d-none'}>
                                    {formError}
                                </p>
                                {
                                    activeButton == 1
                                        ? <OneTimeZone />
                                        : <TwoTimeZone />
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}