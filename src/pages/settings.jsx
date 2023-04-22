import { useEffect, useState } from 'react';
import axios from 'axios';

export default function Settings() {
  
  const [theme, setTheme] = useState('light');
  const [notifications, setNotifications] = useState(true);

  const [energyPrice, setEnergyPrice] = useState(0);
  const [maxEnergy, setMaxEnergy] = useState(0);

  const [prevEnergyPrice, setPrevEnergyPrice] = useState(0);
  const [prevMaxEnergy, setPrevMaxEnergy] = useState(0);

  //Electricity cost limit GET
  useEffect(() => {
    axios
      .get(import.meta.env.VITE_API_URL + 'electricity_cost/limit')
      .then(function (response) {
        setEnergyPrice(response.data[response.data.length - 1].maxValue);
        setPrevEnergyPrice(response.data[0]);
        /*
        console.log(response.data[response.data.length - 1].maxValue);
        console.log(response.data[0].id);
        */
      })
      .catch(function (error) {
        console.log(error);
      });
  }, []);
  //---------------------------
  //Power Consumption limit GET
  useEffect(() => {
    axios
      .get(import.meta.env.VITE_API_URL + 'power_consumption/limit')
      .then(function (response) {
        setMaxEnergy(response.data[response.data.length - 1].maxValue);
        setPrevMaxEnergy(response.data[0]);
        /* 
        console.log(response.data[response.data.length - 1].maxValue);
        console.log(response.data[0].id);
        */
      })
      .catch(function (error) {
        console.log(error);
      });
  }, []);
  //---------------------------

  const handleMaxEnergyChange = (event) => {
    setMaxEnergy(event.target.value);
  };

  const handleEnergyPriceChange = (event) => {
    setEnergyPrice(event.target.value);
  };

  const handleThemeChange = (event) => {
    setTheme(event.target.value);
  };

  const handleNotificationsChange = (event) => {
    setNotifications(event.target.checked);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    //Electricity cost limit POST
    axios.post(import.meta.env.VITE_API_URL + 'electricity_cost/limit', {
      maxValue: energyPrice
        })
        .catch(function (error) {
          console.log(error);
        });
    /*//Electricity cost limit DELETE
    axios.delete(import.meta.env.VITE_API_URL + 'electricity_cost/limit?limitId='+prevEnergyPrice.id, {
        })
        .catch(function (error) {
          console.log(error);
        });*/
    //---------------------------
    

    //Power Consumption limit POST
    axios.post(import.meta.env.VITE_API_URL + 'power_consumption/limit', {
      maxValue: maxEnergy
      })
      .catch(function (error) {
        console.log(error);
      });
    /*//Power Consumption limit DELETE
    axios.delete(import.meta.env.VITE_API_URL + 'power_consumption/limit?limitId='+prevMaxEnergy.id, {
      })
      .catch(function (error) {
        console.log(error);
      });*/
    //---------------------------
    
    // Save settings to backend or do something else
  };

  return (
    <div className="d-flex justify-content-center">
      <div className="rounded bg-light p-4">
        <h2>Settings</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Maximum Energy kWh:</label>
            <input
              className="form-control"
              type="number"
              value={maxEnergy}
              onChange={handleMaxEnergyChange}
            />
          </div>
          <div className="form-group">
            <label>Energy price:</label>
            <input
              className="form-control"
              type="number"
              value={energyPrice}
              onChange={handleEnergyPriceChange}
            />
          </div>
          <div className="form-group">
            <label>Theme:</label>
            <select
              className="form-control"
              value={theme}
              onChange={handleThemeChange}
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
          </div>
          <div className="form-check">
            <input
              className="form-check-input"
              type="checkbox"
              checked={notifications}
              onChange={handleNotificationsChange}
            />
            <label className="form-check-label">Notifications</label>
          </div>
          <button className="btn btn-primary mt-3" type="submit">
            Save
          </button>
        </form>
      </div>
    </div>
  );
}
