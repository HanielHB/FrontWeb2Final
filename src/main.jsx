import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';


import 'bootstrap/dist/css/bootstrap.min.css';
import FormUsuario from './pages/usuario/FormUsuario.jsx';
import Login from './pages/usuario/login.jsx';
import Dashboard from './pages/usuario/dashboard.jsx';
import FormCarretera from './pages/carretera/FormCarretera.jsx';
import ListaCarreteras from './pages/carretera/ListaCarreteras.jsx';
import FormMunicipio from './pages/municipio/FormMunicipio.jsx';
import ListaMunicipios from './pages/municipio/ListaMunicipios.jsx';
import FormIncidente from './pages/incidente/FormIncidente.jsx';
import ListaIncidentes from './pages/incidente/ListaIncidentes.jsx';
import ListaSolicitudes from './pages/solicitudes/ListaSolicitudes.jsx';
import ListaProcesada from './pages/solicitudes/ListaProcesada.jsx';
import FormSolicitud from './pages/solicitudes/FormSolicitud.jsx';
import MapaPublico from './pages/carretera/MapaPublico.jsx';
const router = createBrowserRouter([
  {
    path: "/",
    element: <MapaPublico />,
  },
  
  {
    path: "/login",
    element: <Login />
  },
  {
    path: "/dashboard",
    element: <Dashboard />
  },
  {
    path: "/usuarios/form/:id",
    element: <FormUsuario />
  },
  {
    path: "/usuarios/form",
    element: <FormUsuario />
  },
  {
    path: "/usuarios/password/:id",
    element: <FormUsuario />
  },

  {
    path: "/dashboard/carreteras/form",
    element: <FormCarretera />
  },
  {
    path: "/dashboard/carreteras/form/:id",
    element: <FormCarretera />
  },
  {
    path: "/dashboard/carreteras",
    element: <ListaCarreteras />
  },

  {
    path: "/dashboard/municipios/form",
    element: <FormMunicipio/>
  },
  {
    path: "/dashboard/municipios/form/:id",
    element: <FormMunicipio />
  },
  {
    path: "/dashboard/municipios",
    element: <ListaMunicipios />
  },


  {
    path: "/dashboard/incidentes/form",
    element: <FormIncidente />
  },
  {
    path: "/dashboard/incidentes/form/:id",
    element: <FormIncidente />
  },
  {
    path: "/dashboard/incidentes",
    element: <ListaIncidentes />
  },

  {
    path: "/dashboard/solicitudes",
    element: <ListaSolicitudes />
  },
  {
    path: "/solicitudes/procesadas",
    element: <ListaProcesada />
  },
  {
    path: "/dashboard/solicitudes/form",
    element: <FormSolicitud />
  },
  {
    path: "/dashboard/solicitudes/form/:id",
    element: <FormSolicitud />
  }









  



  
]);
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
