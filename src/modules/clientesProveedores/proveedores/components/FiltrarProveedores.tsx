import { Button, Input, Select, SelectItem } from "@heroui/react";
import { FaSearch, FaFilter } from "react-icons/fa";
import {
  inputClassNames,
  selectClassNames,
} from "../../../../utils/classNames";
import type { DataFilterProveedor } from "../Proveedores";
import { departamentos2, paises } from "../../../../data/ubigeos/paises";
import { municipios } from "../../../../data/ubigeos/municipios";

interface FiltrarProveedoresProps {
  dataFiltros: DataFilterProveedor;
  setDataFiltros: (value: DataFilterProveedor) => void;
  findProveedores: () => void;
}

const FiltrarProveedores = ({
  dataFiltros,
  setDataFiltros,
  findProveedores,
}: FiltrarProveedoresProps) => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    findProveedores();
  };

  // 1. Encontrar los objetos seleccionados para los filtros en cascada
  const findPais = paises.find(
    (p) => String(p.id) === String(dataFiltros.pais_id),
  );
  const findDepartamento = departamentos2.find(
    (d) => String(d.id) === String(dataFiltros.departamento_id),
  );

  // 2. Filtrar opciones dependientes
  const departamentosFiltrados = departamentos2.filter(
    (d) => String(d.departamento_codigo_pais) === String(findPais?.pais_codigo),
  );

  const municipiosFiltrados = municipios.filter(
    (m) =>
      String(m.municipios_codigo_departamantos) ===
      String(findDepartamento?.departamento_codigo),
  );

  // 3. Manejadores para limpiar en cascada
  const handlePaisChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setDataFiltros({
      ...dataFiltros,
      pais_id: e.target.value,
      departamento_id: "TODOS", // Resetear departamento al cambiar país
      muncipio_id: "TODOS", // Resetear municipio al cambiar país
    });
  };

  const handleDepartamentoChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    setDataFiltros({
      ...dataFiltros,
      departamento_id: e.target.value,
      muncipio_id: "TODOS", // Resetear municipio al cambiar departamento
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col md:flex-row gap-2 items-end flex-wrap"
    >
      {/* 🟢 BÚSQUEDA PRINCIPAL */}
      <div className="flex-1 w-full min-w-70">
        <Input
          classNames={inputClassNames}
          value={dataFiltros.cualquier_dato}
          onChange={(e) =>
            setDataFiltros({ ...dataFiltros, cualquier_dato: e.target.value })
          }
          labelPlacement="outside"
          placeholder="Ej. Juan Pérez, 12345678, correo..."
          type="text"
          variant="bordered"
          label="Buscar por Nombre, Razón Social, Doc, Email..."
          size="sm"
          startContent={<FaSearch className="text-slate-400" />}
        />
      </div>

      {/* 🟢 FILTRO: ESTADO */}
      <div className="w-full md:w-36">
        <Select
          label="Estado"
          labelPlacement="outside"
          variant="bordered"
          selectedKeys={dataFiltros.estado ? [dataFiltros.estado] : ["TODOS"]}
          onChange={(e) =>
            setDataFiltros({ ...dataFiltros, estado: e.target.value })
          }
          classNames={selectClassNames}
          size="sm"
        >
          <SelectItem key="TODOS" textValue="TODOS">
            <p className="text-xs">TODOS</p>
          </SelectItem>
          <SelectItem key="ACTIVO" textValue="ACTIVOS">
            <p className="text-xs">ACTIVOS</p>
          </SelectItem>
          <SelectItem key="INACTIVO" textValue="INACTIVOS">
            <p className="text-xs">INACTIVOS</p>
          </SelectItem>
        </Select>
      </div>

      {/* 🟢 FILTRO: PAÍS */}
      <div className="w-full md:w-40">
        <Select
          label="País"
          labelPlacement="outside"
          variant="bordered"
          selectedKeys={dataFiltros.pais_id ? [dataFiltros.pais_id] : ["TODOS"]}
          onChange={handlePaisChange}
          size="sm"
          classNames={selectClassNames}
        >
          <SelectItem key="TODOS" textValue="TODOS">
            <p className="text-xs">TODOS</p>
          </SelectItem>
          {
            paises.map((p) => (
              <SelectItem
                key={String(p.id)}
                textValue={p.pais_nombre.toUpperCase()}
              >
                <p className="text-xs uppercase">{p.pais_nombre}</p>
              </SelectItem>
            )) as any
          }
        </Select>
      </div>

      {/* 🟢 FILTRO: DEPARTAMENTO */}
      <div className="w-full md:w-48">
        <Select
          label="Departamentos"
          labelPlacement="outside"
          variant="bordered"
          selectedKeys={
            dataFiltros.departamento_id
              ? [dataFiltros.departamento_id]
              : ["TODOS"]
          }
          onChange={handleDepartamentoChange}
          size="sm"
          classNames={selectClassNames}
          isDisabled={!findPais || dataFiltros.pais_id === "TODOS"}
        >
          <SelectItem key="TODOS" textValue="TODOS">
            <p className="text-xs">TODOS</p>
          </SelectItem>
          {
            departamentosFiltrados.map((d) => (
              <SelectItem
                key={String(d.id)}
                textValue={d.departamantos_nombre.toUpperCase()}
              >
                <p className="text-xs uppercase">{d.departamantos_nombre}</p>
              </SelectItem>
            )) as any
          }
        </Select>
      </div>

      {/* 🟢 FILTRO: MUNICIPIO */}
      <div className="w-full md:w-48">
        <Select
          label="Municipio"
          labelPlacement="outside"
          variant="bordered"
          selectedKeys={
            dataFiltros.muncipio_id ? [dataFiltros.muncipio_id] : ["TODOS"]
          }
          onChange={(e) =>
            setDataFiltros({ ...dataFiltros, muncipio_id: e.target.value })
          }
          size="sm"
          classNames={selectClassNames}
          isDisabled={
            !findDepartamento || dataFiltros.departamento_id === "TODOS"
          }
        >
          <SelectItem key="TODOS" textValue="TODOS">
            <p className="text-xs">TODOS</p>
          </SelectItem>
          {
            municipiosFiltrados.map((m) => (
              <SelectItem
                key={String(m.id)}
                textValue={m.municipios_nombre.toUpperCase()}
              >
                <p className="text-xs uppercase">{m.municipios_nombre}</p>
              </SelectItem>
            )) as any
          }
        </Select>
      </div>

      {/* 🟢 BOTÓN DE FILTRAR */}
      <Button
        type="submit"
        className="bg-emerald-600 text-white font-bold shadow-md shadow-emerald-600/20 w-full md:w-auto h-12 md:h-10 mt-2 md:mt-0"
        startContent={<FaFilter />}
        radius="md"
      >
        Filtrar
      </Button>
    </form>
  );
};

export default FiltrarProveedores;
