import React from 'react'
import ReactDOM from 'react-dom/client'

// CSS
import './assets/css/index.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import Root from './routes/root';
import ErrorPage from './error_pages/404';
import Dashboard from './pages/dashboard';
import Computers from './pages/computers';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <Dashboard />,
      },
      {
        path: "computers",
        element: <Computers />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
      <RouterProvider router={router} />
  </React.StrictMode>,
)
