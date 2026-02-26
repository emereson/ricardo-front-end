import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  Input,
  ModalFooter, // Agregué ModalFooter para mejor estructura
} from "@heroui/react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import axios from "axios";
import config from "../../../../../auth/auth.config";
import { handleAxiosError } from "../../../../../utils/errorHandler";
import { inputClassNames } from "../../../../../utils/classNames";
import Loading from "../../../../../components/Loading";
import DatosNuevoCliente from "./DatosNuevoCliente";
import UbigeoNuevoCliente from "./UbigeoNuevoCliente";

export interface DataRucType {
  nombre_o_razon_social: string;
  direccion: string;
  departamento: string;
  provincia: string;
  distrito: string;
}

interface Props {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void; // Corregido el tipo para Modal
  findClients: () => void;
}

const CreateCliente = ({ isOpen, onOpenChange, findClients }: Props) => {
  const { register, handleSubmit, reset } = useForm();
  const [loading, setLoading] = useState<boolean>(false);

  const [idDepartamento, setIdDepartamento] = useState<string | null>(null);
  const [idProvincia, setIdProvincia] = useState<string | null>(null);
  const [idDistrito, setIdDistrito] = useState<string | null>(null);
  const [numero, setNumero] = useState("");
  const [dataRuc, setDataRuc] = useState<DataRucType>({
    nombre_o_razon_social: "",
    direccion: "",
    provincia: "",
    departamento: "",
    distrito: "",
  });
  const [tipoDoc, setTipoDoc] = useState("DNI");
  const [nombre, setNombre] = useState<string>("");

  // 1. MOVIDO: El useEffect debe estar fuera de submit
  useEffect(() => {
    if (isOpen) {
      // Limpiar formulario cuando se abre el modal
      setIdDepartamento(null);
      setIdProvincia(null);
      setIdDistrito(null);
      setNumero("");
      setNombre("");
      reset();
      setDataRuc({
        nombre_o_razon_social: "",
        direccion: "",
        provincia: "",
        departamento: "",
        distrito: "",
      });
    }
  }, [isOpen, reset]); // Agregué reset a las dependencias

  const submit = (data: any) => {
    setLoading(true);
    const newData = {
      tipoDocIdentidad: tipoDoc,
      numeroDoc: numero,
      nombreApellidos: nombre,
      nombreComercial: dataRuc.nombre_o_razon_social,
      departamentoId: idDepartamento,
      provinciaId: idProvincia,
      distritoId: idDistrito,
      direccion: dataRuc?.direccion,
      telefono: data.telefono,
    };

    console.log(newData);

    const url = `${import.meta.env.VITE_URL_API}/clientes`;

    axios
      .post(url, newData, config)
      .then(() => {
        findClients();
        toast.success("El cliente se ha registrado correctamente");
        onOpenChange(false); // Cerrar modal pasando false
      })
      .catch((err) => {
        handleAxiosError(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // 2. MOVIDO: El return debe ser del componente, no de la función submit
  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      backdrop="blur"
      size="3xl"
      isDismissable={false} // Evita cierres accidentales mientras carga
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1 text-base">
              Nuevo Cliente
            </ModalHeader>
            <ModalBody>
              {loading && <Loading />}
              <div className="w-full flex flex-col gap-2">
                <h2 className="text-sm text-gray-500">
                  Ingrese los datos del nuevo cliente
                </h2>

                {/* Formulario */}
                <form
                  id="form-cliente" // ID para conectar con el botón del footer
                  className="flex flex-col gap-2"
                  onSubmit={handleSubmit(submit)}
                >
                  <DatosNuevoCliente
                    register={register}
                    numero={numero}
                    tipoDoc={tipoDoc}
                    setTipoDoc={setTipoDoc}
                    setNumero={setNumero}
                    dataRuc={dataRuc}
                    setDataRuc={setDataRuc}
                    nombre={nombre}
                    setNombre={setNombre}
                  />

                  <UbigeoNuevoCliente
                    register={register}
                    setIdDepartamento={setIdDepartamento}
                    setIdProvincia={setIdProvincia}
                    setIdDistrito={setIdDistrito}
                    dataRuc={dataRuc}
                  />

                  <div className="w-full flex gap-4 mt-2">
                    <Input
                      isRequired
                      className="w-full"
                      classNames={inputClassNames}
                      labelPlacement="outside"
                      type="text"
                      variant="bordered"
                      label="Dirección"
                      value={dataRuc?.direccion}
                      placeholder="Ingrese dirección..."
                      {...register("direccion", {
                        onChange: (e) =>
                          setDataRuc((prev) => ({
                            ...prev,
                            direccion: e.target.value,
                          })),
                      })}
                      radius="sm"
                      size="sm"
                    />
                  </div>
                </form>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Cancelar
              </Button>
              {/* El botón submit debe estar vinculado al formulario */}
              <Button
                color="primary"
                type="submit"
                form="form-cliente"
                isLoading={loading}
              >
                Guardar
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default CreateCliente;
