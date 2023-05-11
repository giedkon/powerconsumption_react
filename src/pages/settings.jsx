import { useEffect, useState } from 'react';
import axios from 'axios';

export default function Settings() {
  
  const [theme, setTheme] = useState('light');
  const [notifications, setNotifications] = useState(true);

  const [saved, setSaved] = useState(-1);//0==false 1==true -1=hidden

  const [energyPrice, setEnergyPrice] = useState(0);
  const [maxEnergy, setMaxEnergy] = useState(0);

  const [energyPriceID, setEnergyPriceID] = useState();
  const [maxEnergyID, setMaxEnergyID] = useState();

  //Electricity cost limit GET
  useEffect(() => {
    axios
      .get(import.meta.env.VITE_API_URL + 'electricity_cost/limit')
      .then(function (response) {
        setEnergyPrice(response.data[response.data.length - 1].maxValue);
        setEnergyPriceID(response.data[response.data.length - 1].id);
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
        setMaxEnergyID(response.data[response.data.length - 1].id);
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

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaved(1)
    try{
          //Electricity cost limit POST if PUT >= 404
          await axios
          .put(import.meta.env.VITE_API_URL + 'power_consumption/limit/'+ energyPriceID, {maxValue: energyPrice})
          .catch(function(error) {
            if(error.response.status >= 404){
              axios
                .post(import.meta.env.VITE_API_URL + 'electricity_cost/limit', {maxValue: energyPrice})
                .catch(function(error) {
                setSaved(0)
                console.log(error)
                });
              
            }else{
              setSaved(0)
              console.log(error);
            }
          
          });

          //Power Consumption limit POST if PUT >= 404
          await axios
          .put(import.meta.env.VITE_API_URL + 'power_consumption/limit/'+ maxEnergyID, {maxValue: maxEnergy})
          .catch(function(error) {
            if(error.response.status >=404){
              axios
                .post(import.meta.env.VITE_API_URL + 'power_consumption/limit', {maxValue: energyPrice})
                .catch(function(error) {
                  setSaved(0)
                  console.log(error);
                });
              
            }else
            {
              setSaved(0)
              console.log(error);
            }
          });

          if(saved != 0){
            
          }
          

    }catch{
      setSaved(0);
      console.log(error);
    }
    
    setTimeout(() => {setSaved(-1);}, 3000);
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
            <label>Maximum Energy price:</label>
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
          <a className="btn btn-success ms-2 mt-3" type="submit" href='/settings/electricity'>
            Electricity plan settings
          </a>
          {saved == 1 && (
          <div className="mt-3" style={{ backgroundColor: 'green' ,borderRadius: "10px"}}>
            <p className="text-white text-center">Settings saved successfully</p>
          </div>
          )}
          {saved == 0 && (
          <div className="mt-3" style={{ backgroundColor: 'red' ,borderRadius: "10px"}}>
            <p className="text-white text-center">Failed to save settings</p>
          </div>
          )}
        </form>
      </div>
    </div>
  );
}
