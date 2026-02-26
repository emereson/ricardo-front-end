import { Button, Select, Input, SelectItem } from "@heroui/react";
import { useState } from "react";
import { IoSearchOutline } from "react-icons/io5";
import axios from "axios";
import type { DataRucType } from "./CreateCliente";
import {
  inputClassNames,
  selectClassNames,
} from "../../../../../utils/classNames";
import { onInputNumber } from "../../../../../utils/onInputs";

interface Props {
  register: any; // Idealmente usa UseFormRegister<T> de react-hook-form
  numero: string;
  setNumero: (value: string) => void;
  dataRuc: DataRucType;
  setDataRuc: (value: DataRucType) => void;
  tipoDoc: string;
  setTipoDoc: (value: string) => void;
  nombre: string;
  setNombre: (value: string) => void;
}

const DatosNuevoCliente = ({
  register,
  numero,
  setNumero,
  dataRuc,
  setDataRuc,
  tipoDoc,
  setTipoDoc,
  nombre,
  setNombre,
}: Props) => {
  const [errorFind, setErrorFind] = useState<string>("");
  const [loading, setLoading] = useState(false); // Estado para feedback visual

  const handleTipoDocChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTipoDoc(e.target.value);
    // Limpiar errores o datos al cambiar tipo de doc es buena práctica
    setErrorFind("");
    setNumero("");
    setDataRuc({
      nombre_o_razon_social: "",
      direccion: "",
      provincia: "",
      departamento: "",
      distrito: "",
    });
    setNombre("");
  };

  const handleNumeroChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Validar que solo sean números si es DNI o RUC
    const value = e.target.value;
    if ((tipoDoc === "DNI" || tipoDoc === "RUC") && !/^\d*$/.test(value))
      return;
    setNumero(value);
  };

  const findDni = async () => {
    if (numero.length !== 8) {
      setErrorFind("El DNI debe tener 8 dígitos");
      return;
    }
    setLoading(true);
    try {
      // Ajusta la URL según tu backend real
      const url = `${import.meta.env.VITE_URL_API}/apiPeru/dni?dni=${numero}`;
      const res = await axios.get(url);

      // Asumiendo que la respuesta exitosa trae data
      if (res.data?.data) {
        setNombre(res.data.data.nombre_completo);
        setDataRuc({
          nombre_o_razon_social: "",
          direccion: "",
          provincia: "",
          departamento: "",
          distrito: "",
        });
        setErrorFind("");
      }
    } catch (error) {
      setErrorFind("No se encontró el DNI");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const findRuc = async () => {
    if (numero.length !== 11) {
      setErrorFind("El RUC debe tener 11 dígitos");
      return;
    }
    setLoading(true);
    try {
      // Ajusta la URL según tu backend real
      const url = `${import.meta.env.VITE_URL_API}/apiPeru/ruc?ruc=${numero}`;
      const res = await axios.get(url);

      if (res.data?.data) {
        // Asegúrate de que res.data.data tenga la estructura { nombre_o_razon_social, direccion, ... }
        setDataRuc(res.data.data);
        setNombre(""); // Limpiar nombre de DNI si había
        setErrorFind("");
      }
    } catch (error) {
      setErrorFind("No se encontró el RUC");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ CORRECCIÓN PRINCIPAL AQUÍ
  const handleRazonSocialChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDataRuc({
      ...dataRuc, // Mantiene la dirección y otros campos
      nombre_o_razon_social: e.target.value,
    });
  };

  const handleBuscar = () => {
    if (tipoDoc === "DNI") findDni();
    if (tipoDoc === "RUC") findRuc();
  };

  return (
    <>
      <div className="flex gap-4">
        <Select
          className="w-full"
          isRequired
          classNames={selectClassNames}
          labelPlacement="outside"
          label="Tipo Doc. Identidad"
          placeholder="Seleccione..."
          variant="bordered"
          {...register("tipoDocumento")}
          radius="sm"
          size="sm"
          selectedKeys={tipoDoc ? [tipoDoc] : []} // Select de HeroUI usa arrays para selectedKeys
          onChange={handleTipoDocChange}
        >
          {["Doc.trib.no.dom.sin.ruc", "DNI", "CE", "RUC", "Pasaporte"].map(
            (item) => (
              <SelectItem key={item} textValue={item}>
                {item}
              </SelectItem>
            ),
          )}
        </Select>

        <div className="relative w-full flex items-end gap-1">
          {errorFind && (
            <span className="absolute -top-5 left-0 text-[10px] text-red-500 font-medium">
              {errorFind}
            </span>
          )}

          <Input
            isRequired
            classNames={inputClassNames}
            labelPlacement="outside"
            type="text" // 'text' para controlar mejor el input, usa onInputNumber si es solo visual
            variant="bordered"
            label="Número"
            placeholder="Ingrese número..."
            value={numero}
            {...register("numero", { required: true })}
            onChange={handleNumeroChange} // Usar onChange es más estándar en React que onInput
            radius="sm"
            size="sm"
            maxLength={tipoDoc === "DNI" ? 8 : tipoDoc === "RUC" ? 11 : 20}
          />

          {(tipoDoc === "DNI" || tipoDoc === "RUC") && (
            <Button
              className="font-semibold text-xs bg-slate-900 text-white min-w-24"
              radius="sm"
              color="primary"
              isLoading={loading}
              startContent={!loading && <IoSearchOutline className="text-lg" />}
              onPress={handleBuscar}
            >
              {tipoDoc === "DNI" ? "RENIEC" : "SUNAT"}
            </Button>
          )}
        </div>
      </div>

      <div className="w-full flex gap-4 mt-4">
        {tipoDoc !== "RUC" ? (
          <Input
            isRequired
            className="w-full"
            classNames={inputClassNames}
            labelPlacement="outside"
            type="text"
            variant="bordered"
            label="Nombre y apellidos"
            placeholder="Ingrese nombre..."
            {...register("nombre")}
            radius="sm"
            size="sm"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />
        ) : (
          <Input
            isRequired
            className="w-full"
            classNames={inputClassNames}
            labelPlacement="outside"
            type="text"
            variant="bordered"
            label="Razón Social"
            placeholder="Ingrese razón social..."
            {...register("nombreComercial")}
            radius="sm"
            size="sm"
            value={dataRuc.nombre_o_razon_social} // Usa el estado controlado
            onChange={handleRazonSocialChange} // ✅ Usa la función corregida
          />
        )}

        <Input
          className="w-1/3"
          classNames={inputClassNames}
          labelPlacement="outside"
          type="tel" // 'tel' ayuda en móviles a mostrar teclado numérico
          variant="bordered"
          label="Teléfono"
          placeholder="Ej: 999..."
          {...register("telefono")}
          radius="sm"
          size="sm"
          maxLength={9}
          onInput={onInputNumber}
        />
      </div>
    </>
  );
};

export default DatosNuevoCliente;
