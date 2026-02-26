import { useEffect, useState } from "react";

import { Select, SelectItem } from "@heroui/react";
import { selectClassNames } from "../../../../../utils/classNames";
import type { DataRucType } from "./CreateCliente";
import { departamentos } from "../../../../../data/ubigeos/departamentos";
import { provincias } from "../../../../../data/ubigeos/provincias";
import { distritos } from "../../../../../data/ubigeos/distritos";

interface Props {
  register: any;
  setIdDepartamento: (value: string | null) => void;
  setIdProvincia: (value: string | null) => void;
  setIdDistrito: (value: string | null) => void;
  dataRuc: DataRucType;
}

const UbigeoNuevoCliente = ({
  setIdDepartamento,
  setIdProvincia,
  setIdDistrito,
  dataRuc,
}: Props) => {
  const [selectDepartamento, setSelectDepartamento] = useState<string>("");
  const [selectProvincia, setSelectProvincia] = useState<string>("");
  const [selectDistrito, setSelectDistrito] = useState<string>("");

  const handleDepartamento = (e: React.ChangeEvent<HTMLSelectElement>) =>
    setSelectDepartamento(e.target.value);
  const handleProvincia = (e: React.ChangeEvent<HTMLSelectElement>) =>
    setSelectProvincia(e.target.value);
  const handleDistritos = (e: React.ChangeEvent<HTMLSelectElement>) =>
    setSelectDistrito(e.target.value);

  useEffect(() => {
    const departamentoSeleccionado = departamentos.find(
      (departamento) =>
        departamento.id === Number(selectDepartamento) ||
        departamento.Departamento === dataRuc.departamento,
    );
    const provinciaSeleccionada = provincias.find(
      (provincia) =>
        provincia.id === Number(selectProvincia) ||
        provincia.Provincia === dataRuc.provincia,
    );
    const distritoSeleccionado = distritos.find(
      (distrito) =>
        distrito.id === Number(selectDistrito) ||
        distrito.Distrito === dataRuc.distrito,
    );

    setIdDepartamento(departamentoSeleccionado?.id.toString() || null);
    setIdProvincia(provinciaSeleccionada?.id.toString() || null);
    setIdDistrito(distritoSeleccionado?.id.toString() || null);
  }, [selectDepartamento, selectProvincia, selectDistrito, dataRuc]);

  return (
    <div className="flex gap-4">
      <Select
        className="w-full"
        isRequired
        classNames={selectClassNames}
        labelPlacement="outside"
        label="Departamento"
        placeholder="..."
        variant="bordered"
        radius="sm"
        size="sm"
        selectedKeys={[selectDepartamento || ""]}
        onChange={handleDepartamento}
      >
        {departamentos.map((departamento) => (
          <SelectItem key={departamento.id}>
            {departamento.Departamento}
          </SelectItem>
        ))}
      </Select>

      <Select
        className="w-full"
        isRequired
        classNames={{
          ...selectClassNames,
        }}
        labelPlacement="outside"
        label="Provincia"
        placeholder="..."
        variant="bordered"
        radius="sm"
        size="sm"
        selectedKeys={[selectProvincia || ""]}
        onChange={handleProvincia}
      >
        {provincias.map((provincia) => (
          <SelectItem key={provincia.id}>{provincia.Provincia}</SelectItem>
        ))}
      </Select>

      <Select
        className="w-full"
        isRequired
        classNames={{
          ...selectClassNames,
        }}
        labelPlacement="outside"
        label="Distrito"
        placeholder="..."
        variant="bordered"
        radius="sm"
        size="sm"
        selectedKeys={[selectDistrito || ""]}
        onChange={handleDistritos}
      >
        {distritos.map((distrito) => (
          <SelectItem key={distrito.id}>{distrito.Distrito}</SelectItem>
        ))}
      </Select>
    </div>
  );
};

export default UbigeoNuevoCliente;
