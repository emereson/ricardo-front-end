import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import "./App.css";
import { Toaster } from "sonner";
import Login from "./pages/login/Login";
import GuestGuard from "./auth/GuestGuard";
import { PrivateGuard } from "./auth/PrivateGuard";

import Header from "./components/Header";
import Menu from "./components/menu/Menu";
import User from "./modules/users/User";
import NuevaCotizacion from "./modules/ventas/nuevaCotizacion/NuevaCotizacion";
import Analisis from "./modules/dashboard/analisis/Analisis";
import Cotizaciones from "./modules/ventas/cotizaciones/Cotizaciones";
import ComprobantesCotizacion from "./modules/ventas/comprobantesCotizacion/ComprobantesCotizacion";
import Proveedores from "./modules/clientesProveedores/proveedores/Proveedores";

function PrivateLayout() {
  return (
    <div className="w-screen h-screen bg-slate-900 flex overflow-hidden">
      <Menu />

      <div className="relative flex-1 h-screen p-5 px-4 overflow-x-hidden overflow-y-auto ">
        <div className="fixed w-full  top-0 left-0 h-5 bg-slate-900 z-30"></div>
        <div className="relative w-full min-h-full  bg-slate-50 rounded-2xl flex flex-col   shadow-2xl">
          <div className="sticky top-0  z-40 bg-slate-900">
            <Header />
          </div>
          <Outlet />
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Toaster position="bottom-right" richColors />

      <Routes>
        {/* Rutas públicas */}
        <Route element={<GuestGuard />}>
          <Route path="/log-in" element={<Login />} />
        </Route>

        {/* Rutas privadas */}
        <Route element={<PrivateGuard />}>
          <Route element={<PrivateLayout />}>
            {/* dashboard */}
            <Route index element={<Analisis />} />
            <Route path="dashboard/flujo-caja" element={<Analisis />} />

            {/* dashboard */}
            {/* ventas */}
            <Route path="ventas/nueva" element={<NuevaCotizacion />} />
            <Route path="ventas/cotizaciones" element={<Cotizaciones />} />
            <Route
              path="ventas/facturas"
              element={<ComprobantesCotizacion />}
            />

            {/* ventas */}
            <Route path="users" element={<User />} />

            {/* gestion externa */}
            <Route path="proveedores" element={<Proveedores />} />
            {/* gestion externa */}
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
