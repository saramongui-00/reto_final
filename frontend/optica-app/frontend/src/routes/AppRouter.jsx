import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import User from "../pages/User";
import Users from "../pages/Users";
import Patient from "../pages/Patient";
import NuevaCita from "../pages/NuevaCita";
import AgendaCitas from "../pages/AgendaCitas";
import AppointmentsMenu from "../pages/AppointmentsMenu"; // 👈 Importar
import PrivateRoute from "../components/PrivateRoute";
import History from "../pages/History";

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        
        <Route path="/user" element={
          <PrivateRoute>
            <User />
          </PrivateRoute>
        } />
        
        <Route path="/patient" element={
          <PrivateRoute rolesPermitidos={["OPTOMETRA", "SECRETARIO"]}>
            <Patient />
          </PrivateRoute>
        } />
        
        <Route path="/dashboard" element={
          <PrivateRoute rolesPermitidos={["OPTOMETRA"]}>
            <User />
          </PrivateRoute>
        } />
        
        <Route path="/users" element={
          <PrivateRoute rolesPermitidos={["OPTOMETRA"]}>
            <Users />
          </PrivateRoute>
        } />

        {/* 👈 Ruta para el menú principal de citas */}
        <Route path="/appointments" element={
          <PrivateRoute rolesPermitidos={["OPTOMETRA", "SECRETARIO"]}>
            <AppointmentsMenu />
          </PrivateRoute>
        } />

        <Route path="/citas/nueva" element={
          <PrivateRoute rolesPermitidos={["OPTOMETRA","SECRETARIO"]}>
            <NuevaCita />
          </PrivateRoute>
        } />

        <Route path="/citas/agenda" element={
          <PrivateRoute rolesPermitidos={["OPTOMETRA","SECRETARIO"]}>
            <AgendaCitas />
          </PrivateRoute>
        } />

        <Route path="/history" element={
          <PrivateRoute rolesPermitidos={["OPTOMETRA"]}>
            <History />
          </PrivateRoute>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;