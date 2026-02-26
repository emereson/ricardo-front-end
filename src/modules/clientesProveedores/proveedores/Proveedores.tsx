import { Button, useDisclosure } from "@heroui/react";
import { FaUserPlus, FaUserTie } from "react-icons/fa";
import type { ProveedorType } from "../../../types/proveedor.type";
import { useEffect, useState } from "react";
import { API } from "../../../utils/api";
import axios from "axios";
import config from "../../../auth/auth.config";
import FiltrarProveedores from "./components/FiltrarProveedores";
import CreateProveedor from "./components/crudProveedor/CreateProveedor";
import TablaProveedores from "./components/TablaProveedores";

export interface DataFilterProveedor {
  cualquier_dato: string;
  estado: string;
  pais_id: string;
  departamento_id: string;
  muncipio_id: string;
}

const Proveedores = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [loading, setLoading] = useState(true);
  const [selectModal, setSelectModal] = useState<string>("");
  const [proveedores, setProveedores] = useState<ProveedorType[]>([]);
  const [selectProveedor, setSelectProveedor] = useState<ProveedorType | null>(
    null,
  );
  const [dataFiltros, setDataFiltros] = useState<DataFilterProveedor>({
    cualquier_dato: "",
    estado: "TODOS",
    pais_id: "TODOS", // Por defecto el país principal
    departamento_id: "",
    muncipio_id: "",
  });
  console.log(loading, selectModal, selectProveedor);

  const findProveedores = () => {
    setLoading(true);

    // 🟢 1. Limpiamos los filtros para no enviar datos vacíos a la API
    const filtrosLimpios = Object.fromEntries(
      Object.entries(dataFiltros).filter(
        ([_, value]) => value !== "" && value !== "TODOS",
      ),
    );

    // 🟢 2. Convertimos el objeto a query params (ej: ?estado=ACTIVO&pais_id=1)
    const queryParams = new URLSearchParams(filtrosLimpios as any).toString();

    // 🟢 3. Hacemos la petición con los filtros aplicados
    const url = `${API}/proveedores?${queryParams}`;

    axios
      .get(url, config)
      .then((res) => {
        setProveedores(res.data.proveedores || []);
      })
      .catch((err) => console.error("Error al traer proveedores:", err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    findProveedores();
  }, []);

  const handleCreate = () => {
    setSelectModal("create");
    onOpen();
  };

  console.log(proveedores);

  return (
    <main className="w-full min-h-screen flex flex-col px-4 pt-4 pb-10 gap-4 ">
      {/* CABECERA */}
      <section className="w-full flex justify-between items-center gap-4 bg-white p-3 rounded-xl shadow-sm border border-slate-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 flex items-center justify-center bg-emerald-50 text-emerald-600 rounded-xl shadow-inner">
            <FaUserTie className="text-2xl" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-800 tracking-tight">
              Proveedores
            </h1>
            <p className="text-xs text-slate-500 font-medium">
              Gestión y búsqueda de directorio
            </p>
          </div>
        </div>
        <Button
          className="bg-emerald-600 text-xs text-white font-bold shadow-sm shadow-emerald-600/30 hover:-translate-y-0.5 transition-all"
          onPress={handleCreate}
          startContent={<FaUserPlus className="text-lg" />}
          radius="sm"
        >
          Nuevo Proveedor
        </Button>
      </section>

      {/* ZONA DE FILTROS */}
      <FiltrarProveedores
        dataFiltros={dataFiltros}
        setDataFiltros={setDataFiltros}
        findProveedores={findProveedores}
      />

      <TablaProveedores
        proveedores={proveedores}
        onOpen={onOpen}
        setSelectModal={setSelectModal}
        setSelectProveedor={setSelectProveedor}
      />

      {/* AQUÍ IRÍA TU TABLA DE PROVEEDORES...
       */}
      <CreateProveedor
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        findProveedores={findProveedores}
      />
    </main>
  );
};

export default Proveedores;
