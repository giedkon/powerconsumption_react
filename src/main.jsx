import React from 'react'
import ReactDOM from 'react-dom/client'
import { useState } from 'react';

// CSS
import './assets/css/index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap';

import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import Root from './routes/root';
import ErrorPage from './error_pages/404';
import Dashboard from './pages/dashboard';
import Computer from './pages/computer';
import ComputerList from './pages/computerList';
import ComputerDetails from './pages/computerDetails';
import Diagrams from './pages/diagrams';
import Setings from './pages/settings';
import Login from './pages/login';
import AuthTest from './pages/authtest';
import Register from './pages/register';
import Protected from './routes/protected';
import Auth from './routes/auth';
import AllComputers from './pages/allComputers';

import axios from 'axios';


const savedToken = localStorage.getItem('token') || null;
const defaultGlobalState = {
  open: false,
  token: savedToken || null,
  userName: localStorage.getItem('username') || null,
};

window.axios = axios;
axios.defaults.baseURL = import.meta.env.VITE_API_URL;
axios.defaults.headers.common = {'Authorization': `bearer ${savedToken}`}


const globalStateContext = React.createContext(defaultGlobalState);
const dispatchStateContext = React.createContext(undefined);

const GlobalStateProvider = ({ children }) => {
  const [state, dispatch] = React.useReducer(
    (state, newValue) => ({ ...state, ...newValue }),
    defaultGlobalState
  );
  return (
    <globalStateContext.Provider value={state}>
      <dispatchStateContext.Provider value={dispatch}>
        {children}
      </dispatchStateContext.Provider>
    </globalStateContext.Provider>
  );
};

export const useGlobalState = () => [
  React.useContext(globalStateContext),
  React.useContext(dispatchStateContext)
];

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        element: <Protected />,
        children: [
          {
            path: "/",
            element: <Dashboard />,
          },
          {
            path: "/computers",
            element: <ComputerList />,
          },
          {
            path: "computer/:computerId",
            element: <Computer />,
          },
          {
            path: "computer/:computerId/details",
            element: <ComputerDetails />
          },
          {
            path: "/diagrams",
            element: <Diagrams />,
          },
          {
            path: "/settings",
            element: <Setings />,
          },
          {
            path: "/authTest",
            element: <AuthTest />,
          },
          {
            path: "/allcomputers",
            element: <AllComputers/>,
          }
        ]
      },
      {
        element: <Auth />,
        children: [
          {
            path: "/login",
            element: <Login />,
          },
          {
            path: "/register",
            element: <Register />,
          }
        ]
      }
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <GlobalStateProvider>
      <RouterProvider router={router} />
    </GlobalStateProvider>
  </React.StrictMode>,
)