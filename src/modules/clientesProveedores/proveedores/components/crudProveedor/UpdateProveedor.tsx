import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  Input,
  ModalFooter,
  Select,
  SelectItem,
  Checkbox,
  Accordion,
  AccordionItem,
} from "@heroui/react";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import axios from "axios";
import {
  User,
  Phone,
  MapPin,
  Landmark,
  Mail,
  Calendar,
  Hash,
  Building2,
  FileText,
  Save,
  Globe,
  CreditCard,
  Plus,
  Trash2,
  Upload,
} from "lucide-react";
import config from "../../../../../auth/auth.config";
import { handleAxiosError } from "../../../../../utils/errorHandler";
import {
  inputClassNames,
  selectClassNames,
} from "../../../../../utils/classNames";
import Loading from "../../../../../components/Loading";
import { departamentos2, paises } from "../../../../../data/ubigeos/paises";
import { municipios } from "../../../../../data/ubigeos/municipios";
import type { ProveedorType } from "../../../../../types/proveedor.type";
import { documentos } from "../../../../../data/documentos";
import { bancos } from "../../../../../data/bancos";
import { tiposCuentas } from "../../../../../data/tiposCuenta";

interface Props {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  findProveedores: () => void;
  selectProveedor: ProveedorType; // 🟢 Recibimos el proveedor a editar
}

interface CuentaBancariaFront {
  id?: number; // 🟢 Opcional para saber si es nueva o ya existía
  banco_cruenta_bancaria: string;
  nro_cruenta_bancaria: string;
  tipo_cuenta_bancaria: string;
  codigo_cuenta_bancaria: string;
  puc_cuenta_bancaria: string;
  cuenta_principal: boolean;
  archivo: File | null;
  link_archivo_adjunto?: string | null; // 🟢 Para mostrar el nombre si ya hay uno en el server
  estado_cuenta: "ACTIVO" | "DESACTIVADO";
}

const UpdateProveedor = ({
  isOpen,
  onOpenChange,
  findProveedores,
  selectProveedor,
}: Props) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProveedorType>();

  const [loading, setLoading] = useState<boolean>(false);
  const [selectedKeys, setSelectedKeys] = useState<any>(new Set(["1"]));

  const [paisId, setPaisId] = useState<string>("");
  const [deptoId, setDeptoId] = useState<string>("");
  const [muniId, setMuniId] = useState<string>("");

  const [cuentasBancarias, setCuentasBancarias] = useState<
    CuentaBancariaFront[]
  >([]);

  // 🟢 EFECTO PARA CARGAR LOS DATOS AL ABRIR EL MODAL
  useEffect(() => {
    if (isOpen && selectProveedor) {
      // 1. Cargamos datos principales al form de react-hook-form
      reset(selectProveedor);

      // 2. Cargamos los estados de ubicación
      setPaisId(String(selectProveedor.pais_id));
      setDeptoId(String(selectProveedor.departamento_id));
      setMuniId(String(selectProveedor.muncipio_id));

      // 3. Transformamos y cargamos las cuentas bancarias
      if (selectProveedor.bancos_proveedor) {
        const cuentasCargadas: CuentaBancariaFront[] =
          selectProveedor.bancos_proveedor.map((c) => ({
            id: c.id,
            banco_cruenta_bancaria: c.banco_cruenta_bancaria,
            nro_cruenta_bancaria: c.nro_cruenta_bancaria,
            tipo_cuenta_bancaria: c.tipo_cuenta_bancaria,
            codigo_cuenta_bancaria: c.codigo_cuenta_bancaria || "",
            puc_cuenta_bancaria: c.puc_cuenta_bancaria || "",
            cuenta_principal: c.cuenta_principal,
            estado_cuenta: c.estado_cuenta,
            link_archivo_adjunto: c.link_archivo_adjunto,
            archivo: null, // Si el usuario sube uno nuevo, se llenará
          }));
        setCuentasBancarias(cuentasCargadas);
      } else {
        setCuentasBancarias([]);
      }
    }
  }, [isOpen, selectProveedor, reset]);

  // Cierra y limpia
  useEffect(() => {
    if (!isOpen) {
      reset();
      setSelectedKeys(new Set(["1"]));
      setPaisId("");
      setDeptoId("");
      setMuniId("");
      setCuentasBancarias([]);
    }
  }, [isOpen, reset]);

  const findPais = paises.find((p) => String(p.id) === paisId);
  const findDepartamento = departamentos2.find((d) => String(d.id) === deptoId);

  const departamentosFiltrados = departamentos2.filter(
    (d) => String(d.departamento_codigo_pais) === String(findPais?.pais_codigo),
  );

  const municipiosFiltrados = municipios.filter(
    (m) =>
      String(m.municipios_codigo_departamantos) ===
      String(findDepartamento?.departamento_codigo),
  );

  const handlePaisChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPaisId(e.target.value);
    setDeptoId("");
    setMuniId("");
  };

  const handleDepartamentoChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    setDeptoId(e.target.value);
    setMuniId("");
  };

  const handleMunicipioChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setMuniId(e.target.value);
  };

  const addCuentaBancaria = () => {
    setCuentasBancarias([
      ...cuentasBancarias,
      {
        banco_cruenta_bancaria: "",
        nro_cruenta_bancaria: "",
        tipo_cuenta_bancaria: "",
        codigo_cuenta_bancaria: "",
        puc_cuenta_bancaria: "",
        cuenta_principal: cuentasBancarias.length === 0,
        archivo: null,
        estado_cuenta: "ACTIVO",
      },
    ]);
  };

  const removeCuentaBancaria = (index: number) => {
    const newCuentas = [...cuentasBancarias];
    newCuentas.splice(index, 1);
    setCuentasBancarias(newCuentas);
  };

  const handleCuentaChange = (
    index: number,
    field: keyof CuentaBancariaFront,
    value: any,
  ) => {
    const newCuentas = [...cuentasBancarias];
    if (field === "cuenta_principal" && value === true) {
      newCuentas.forEach((c) => (c.cuenta_principal = false));
    }
    // @ts-ignore
    newCuentas[index][field] = value;
    setCuentasBancarias(newCuentas);
  };

  const handleFileChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files ? e.target.files[0] : null;
    handleCuentaChange(index, "archivo", file);
  };

  const onError = () => {
    setSelectedKeys("all");
    toast.error("Por favor, revise los campos marcados en rojo.");
  };

  const submit = (data: ProveedorType) => {
    if (!selectProveedor) return;

    if (!paisId || !deptoId || !muniId) {
      toast.error("Debe seleccionar País, Departamento y Municipio.");
      setSelectedKeys("all");
      return;
    }

    const selectedPaisInfo = paises.find((p) => String(p.id) === paisId);
    const selectedDeptoInfo = departamentos2.find(
      (d) => String(d.id) === deptoId,
    );
    const selectedMuniInfo = municipios.find((m) => String(m.id) === muniId);

    const formData = new FormData();

    const newData = {
      ...data,
      pais_id: Number(paisId),
      pais_proveedor: selectedPaisInfo?.pais_nombre || "",
      departamento_id: Number(deptoId),
      departamento_proveedor: selectedDeptoInfo?.departamantos_nombre || "",
      muncipio_id: Number(muniId),
      muncipio_proveedor: selectedMuniInfo?.municipios_nombre || "",
      cuentasBancarias: cuentasBancarias.map(({ archivo, ...rest }) => rest), // Enviamos sin el object File físico
    };

    formData.append("data", JSON.stringify(newData));

    cuentasBancarias.forEach((cuenta, index) => {
      if (cuenta.archivo) {
        formData.append(`archivos_bancarios_${index}`, cuenta.archivo);
      }
    });

    setLoading(true);
    // 🟢 Cambiamos a PATCH / PUT y agregamos el ID a la URL
    const url = `${import.meta.env.VITE_URL_API}/proveedores/${selectProveedor.id}`;

    axios
      .patch(url, formData, config)
      .then(() => {
        findProveedores();
        toast.success("El proveedor se ha actualizado correctamente");
        onOpenChange(false);
      })
      .catch((err) => handleAxiosError(err))
      .finally(() => setLoading(false));
  };

  const itemClasses = {
    base: "mb-1 px-0 bg-white border border-slate-200 rounded-xl shadow-sm transition-all duration-200",
    title: "font-normal",
    trigger:
      "px-4 py-3 rounded-xl hover:bg-slate-50 transition-colors flex items-center cursor-pointer",
    content: "px-6 pb-6 pt-0",
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      backdrop="blur"
      size="5xl"
      placement="center"
      classNames={{ wrapper: "overflow-hidden" }}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="px-4 py-3 flex flex-col gap-1 text-lg font-bold bg-slate-900 text-white border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Building2 className="text-amber-400" size={22} />
                Editar Proveedor
              </div>
              <p className="text-xs font-normal text-slate-400">
                Modifique los campos a continuación para actualizar la
                información.
              </p>
            </ModalHeader>

            <ModalBody className="py-4 px-4 bg-slate-50/50 overflow-y-auto min-h-[70vh] max-h-[70vh]">
              {loading && <Loading />}

              <form
                id="form-update-proveedor"
                className="flex flex-col"
                noValidate
                onSubmit={handleSubmit(submit, onError)}
              >
                <Accordion
                  variant="splitted"
                  selectedKeys={selectedKeys}
                  onSelectionChange={setSelectedKeys}
                  itemClasses={itemClasses}
                >
                  {/* --- SECCIÓN 1 --- */}
                  <AccordionItem
                    key="1"
                    aria-label="Identificación del Proveedor"
                    title={
                      <div className="flex items-center gap-3 px-0">
                        <div className="p-2 bg-amber-100/50 text-amber-600 rounded-lg">
                          <User size={18} />
                        </div>
                        <span className="text-sm font-bold text-slate-800 uppercase tracking-wider">
                          1. Identificación
                        </span>
                      </div>
                    }
                  >
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-2 items-start">
                      <Select
                        label="Tipo de Documento"
                        labelPlacement="outside"
                        placeholder="Seleccione..."
                        variant="bordered"
                        size="sm"
                        startContent={
                          <FileText className="text-slate-400" size={16} />
                        }
                        classNames={selectClassNames}
                        {...register("tipo_documento_identidad", {
                          required: "Requerido",
                        })}
                        isInvalid={!!errors.tipo_documento_identidad}
                        errorMessage={
                          errors.tipo_documento_identidad?.message as string
                        }
                      >
                        {documentos.map((item) => (
                          <SelectItem
                            key={item.documento_nombre}
                            textValue={item.documento_nombre}
                          >
                            {item.documento_nombre}
                          </SelectItem>
                        ))}
                      </Select>

                      <Input
                        label="N° Documento"
                        labelPlacement="outside"
                        placeholder="Ej. 20123456789"
                        type="text"
                        variant="bordered"
                        size="sm"
                        startContent={
                          <Hash className="text-slate-400" size={16} />
                        }
                        classNames={inputClassNames}
                        {...register("numero_doc", { required: "Requerido" })}
                        isInvalid={!!errors.numero_doc}
                        errorMessage={errors.numero_doc?.message as string}
                      />

                      <Input
                        label="Cód. Identidad (BD)"
                        labelPlacement="outside"
                        placeholder="Ej. 1"
                        type="number"
                        variant="bordered"
                        size="sm"
                        classNames={inputClassNames}
                        {...register("codigo_documento_identidad", {
                          required: "Requerido",
                          valueAsNumber: true,
                        })}
                        isInvalid={!!errors.codigo_documento_identidad}
                        errorMessage={
                          errors.codigo_documento_identidad?.message as string
                        }
                      />

                      <Input
                        label="Razón Social"
                        labelPlacement="outside"
                        placeholder="Razón Social del proveedor"
                        type="text"
                        variant="bordered"
                        size="sm"
                        startContent={
                          <Building2 className="text-slate-400" size={16} />
                        }
                        classNames={inputClassNames}
                        className="md:col-span-3"
                        {...register("razon_social", { required: "Requerido" })}
                        isInvalid={!!errors.razon_social}
                        errorMessage={errors.razon_social?.message as string}
                      />

                      <Input
                        label="Nombres"
                        labelPlacement="outside"
                        placeholder="Nombres (si aplica)"
                        type="text"
                        variant="bordered"
                        size="sm"
                        classNames={inputClassNames}
                        {...register("nombre_proveedor", {
                          required: "Requerido",
                        })}
                        isInvalid={!!errors.nombre_proveedor}
                        errorMessage={
                          errors.nombre_proveedor?.message as string
                        }
                      />

                      <Input
                        label="Apellidos"
                        labelPlacement="outside"
                        placeholder="Apellidos (si aplica)"
                        type="text"
                        variant="bordered"
                        size="sm"
                        classNames={inputClassNames}
                        className="md:col-span-2"
                        {...register("apellidos_proveedor", {
                          required: "Requerido",
                        })}
                        isInvalid={!!errors.apellidos_proveedor}
                        errorMessage={
                          errors.apellidos_proveedor?.message as string
                        }
                      />
                    </div>
                  </AccordionItem>

                  {/* --- SECCIÓN 2 --- */}
                  <AccordionItem
                    key="2"
                    aria-label="Contacto y Generales"
                    title={
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-amber-100/50 text-amber-600 rounded-lg">
                          <Phone size={18} />
                        </div>
                        <span className="text-sm font-bold text-slate-800 uppercase tracking-wider">
                          2. Contacto y Generales
                        </span>
                      </div>
                    }
                  >
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-2 items-start">
                      <Input
                        label="Teléfono"
                        labelPlacement="outside"
                        placeholder="Ej. 987654321"
                        type="text"
                        variant="bordered"
                        size="sm"
                        startContent={
                          <Phone className="text-slate-400" size={16} />
                        }
                        classNames={inputClassNames}
                        {...register("telefono_proveedor", {
                          required: "Requerido",
                        })}
                        isInvalid={!!errors.telefono_proveedor}
                        errorMessage={
                          errors.telefono_proveedor?.message as string
                        }
                      />

                      <Input
                        label="Correo Electrónico"
                        labelPlacement="outside"
                        placeholder="ejemplo@correo.com"
                        type="email"
                        variant="bordered"
                        size="sm"
                        startContent={
                          <Mail className="text-slate-400" size={16} />
                        }
                        classNames={inputClassNames}
                        className="md:col-span-2"
                        {...register("corre_proveedor", {
                          required: "Requerido",
                        })}
                        isInvalid={!!errors.corre_proveedor}
                        errorMessage={errors.corre_proveedor?.message as string}
                      />

                      <Input
                        label="Fecha de Nac. / Creación"
                        labelPlacement="outside"
                        type="date"
                        variant="bordered"
                        size="sm"
                        startContent={
                          <Calendar className="text-slate-400" size={16} />
                        }
                        classNames={inputClassNames}
                        {...register("nacimiento_proveedor", {
                          required: "Requerido",
                        })}
                        isInvalid={!!errors.nacimiento_proveedor}
                        errorMessage={
                          errors.nacimiento_proveedor?.message as string
                        }
                      />

                      <Input
                        label="Dirección Fiscal"
                        labelPlacement="outside"
                        placeholder="Av. Principal 123..."
                        type="text"
                        variant="bordered"
                        size="sm"
                        startContent={
                          <MapPin className="text-slate-400" size={16} />
                        }
                        classNames={inputClassNames}
                        className="md:col-span-2"
                        {...register("direccion", { required: "Requerido" })}
                        isInvalid={!!errors.direccion}
                        errorMessage={errors.direccion?.message as string}
                      />
                    </div>
                  </AccordionItem>

                  {/* --- SECCIÓN 3 --- */}
                  <AccordionItem
                    key="3"
                    aria-label="Ubicación Geográfica"
                    title={
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-amber-100/50 text-amber-600 rounded-lg">
                          <Globe size={18} />
                        </div>
                        <span className="text-sm font-bold text-slate-800 uppercase tracking-wider">
                          3. Ubicación Geográfica
                        </span>
                      </div>
                    }
                  >
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-5 pt-2 items-start">
                      <Input
                        label="Indicativo País"
                        labelPlacement="outside"
                        placeholder="Ej. +51"
                        type="text"
                        variant="bordered"
                        size="sm"
                        classNames={inputClassNames}
                        {...register("indicativo_pais", {
                          required: "Requerido",
                        })}
                        isInvalid={!!errors.indicativo_pais}
                        errorMessage={errors.indicativo_pais?.message as string}
                      />

                      <Select
                        label="País"
                        labelPlacement="outside"
                        placeholder="Seleccione..."
                        variant="bordered"
                        size="sm"
                        selectedKeys={paisId ? [paisId] : []}
                        onChange={handlePaisChange}
                        classNames={selectClassNames}
                        isInvalid={paisId === ""}
                        errorMessage={paisId === "" ? "Requerido" : undefined}
                      >
                        {
                          paises.map((p) => (
                            <SelectItem
                              key={String(p.id)}
                              textValue={p.pais_nombre.toUpperCase()}
                            >
                              <p className="text-xs uppercase">
                                {p.pais_nombre}
                              </p>
                            </SelectItem>
                          )) as any
                        }
                      </Select>

                      <Select
                        label="Departamento"
                        labelPlacement="outside"
                        placeholder="Seleccione..."
                        variant="bordered"
                        size="sm"
                        selectedKeys={deptoId ? [deptoId] : []}
                        onChange={handleDepartamentoChange}
                        isDisabled={!findPais}
                        classNames={selectClassNames}
                        isInvalid={deptoId === ""}
                        errorMessage={deptoId === "" ? "Requerido" : undefined}
                      >
                        {
                          departamentosFiltrados.map((d) => (
                            <SelectItem
                              key={String(d.id)}
                              textValue={d.departamantos_nombre.toUpperCase()}
                            >
                              <p className="text-xs uppercase">
                                {d.departamantos_nombre}
                              </p>
                            </SelectItem>
                          )) as any
                        }
                      </Select>

                      <Select
                        label="Municipio"
                        labelPlacement="outside"
                        placeholder="Seleccione..."
                        variant="bordered"
                        size="sm"
                        selectedKeys={muniId ? [muniId] : []}
                        onChange={handleMunicipioChange}
                        isDisabled={!findDepartamento}
                        classNames={selectClassNames}
                        isInvalid={muniId === ""}
                        errorMessage={muniId === "" ? "Requerido" : undefined}
                      >
                        {
                          municipiosFiltrados.map((m) => (
                            <SelectItem
                              key={String(m.id)}
                              textValue={m.municipios_nombre.toUpperCase()}
                            >
                              <p className="text-xs uppercase">
                                {m.municipios_nombre}
                              </p>
                            </SelectItem>
                          )) as any
                        }
                      </Select>
                    </div>
                  </AccordionItem>

                  {/* --- SECCIÓN 4 --- */}
                  <AccordionItem
                    key="4"
                    aria-label="Información Tributaria y Estado"
                    title={
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-amber-100/50 text-amber-600 rounded-lg">
                          <Landmark size={18} />
                        </div>
                        <span className="text-sm font-bold text-slate-800 uppercase tracking-wider">
                          4. Tributaria y Estado
                        </span>
                      </div>
                    }
                  >
                    <div className="pt-2">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6 items-start">
                        <Select
                          label="Clasif. Tributaria"
                          labelPlacement="outside"
                          placeholder="Seleccione..."
                          variant="bordered"
                          size="sm"
                          startContent={
                            <Landmark className="text-slate-400" size={16} />
                          }
                          classNames={selectClassNames}
                          {...register("clasificacion_tributaria", {
                            required: "Requerido",
                          })}
                          isInvalid={!!errors.clasificacion_tributaria}
                          errorMessage={
                            errors.clasificacion_tributaria?.message as string
                          }
                        >
                          <SelectItem
                            key="Responsable de IVA"
                            textValue="Responsable de IVA"
                          >
                            Responsable de IVA
                          </SelectItem>
                          <SelectItem
                            key="No Responsable de IVA"
                            textValue="No Responsable de IVA"
                          >
                            No Responsable de IVA
                          </SelectItem>
                        </Select>

                        {/* 🟢 Select de Estado Visible para la Edición */}
                        <Select
                          label="Estado"
                          labelPlacement="outside"
                          placeholder="Seleccione..."
                          variant="bordered"
                          size="sm"
                          classNames={selectClassNames}
                          {...register("estado", { required: "Requerido" })}
                          isInvalid={!!errors.estado}
                          errorMessage={errors.estado?.message as string}
                        >
                          <SelectItem key="ACTIVO" textValue="Activo">
                            ACTIVO
                          </SelectItem>
                          <SelectItem key="DESACTIVADO" textValue="Desactivado">
                            DESACTIVADO
                          </SelectItem>
                        </Select>
                      </div>

                      <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 shadow-inner">
                        <p className="text-xs font-bold text-slate-500 mb-4 uppercase tracking-wider border-b border-slate-200 pb-2">
                          Opciones de Retención e Impuestos
                        </p>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-4">
                          <Checkbox
                            size="sm"
                            color="success"
                            {...register("autorretiene_renta")}
                          >
                            <span className="text-slate-700 font-medium">
                              Autorretiene Renta
                            </span>
                          </Checkbox>
                          <Checkbox
                            size="sm"
                            color="success"
                            {...register("autorretiene_iva")}
                          >
                            <span className="text-slate-700 font-medium">
                              Autorretiene IVA
                            </span>
                          </Checkbox>
                          <Checkbox
                            size="sm"
                            color="success"
                            {...register("autorretiene_ica")}
                          >
                            <span className="text-slate-700 font-medium">
                              Autorretiene ICA
                            </span>
                          </Checkbox>
                          <Checkbox
                            size="sm"
                            color="success"
                            {...register("gran_contribuyente")}
                          >
                            <span className="text-slate-700 font-medium">
                              Gran Contribuyente
                            </span>
                          </Checkbox>
                          <Checkbox
                            size="sm"
                            color="success"
                            {...register("regimen_simple")}
                          >
                            <span className="text-slate-700 font-medium">
                              Régimen Simple
                            </span>
                          </Checkbox>
                          <Checkbox
                            size="sm"
                            color="success"
                            {...register("exento_gmf")}
                          >
                            <span className="text-slate-700 font-medium">
                              Exento GMF
                            </span>
                          </Checkbox>
                        </div>
                      </div>
                    </div>
                  </AccordionItem>

                  {/* --- SECCIÓN 5: CUENTAS --- */}
                  <AccordionItem
                    key="5"
                    aria-label="Cuentas Bancarias"
                    title={
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-amber-100/50 text-amber-600 rounded-lg">
                          <CreditCard size={18} />
                        </div>
                        <span className="text-sm font-bold text-slate-800 uppercase tracking-wider">
                          5. Cuentas Bancarias
                        </span>
                      </div>
                    }
                  >
                    <div className="pt-2">
                      <div className="flex justify-between items-center mb-4 border-b border-slate-200 pb-2">
                        <p className="text-sm text-slate-500">
                          Añada o modifique las cuentas bancarias asociadas al
                          proveedor.
                        </p>
                        <Button
                          size="sm"
                          className="bg-amber-100 text-amber-700 font-bold"
                          startContent={<Plus size={16} />}
                          onPress={addCuentaBancaria}
                        >
                          Añadir Cuenta
                        </Button>
                      </div>

                      {cuentasBancarias.length === 0 ? (
                        <div className="text-center py-8 bg-slate-50 rounded-lg border border-dashed border-slate-300">
                          <CreditCard
                            className="mx-auto text-slate-300 mb-2"
                            size={32}
                          />
                          <p className="text-slate-500 text-sm">
                            No hay cuentas bancarias registradas.
                          </p>
                        </div>
                      ) : (
                        <div className="flex flex-col gap-4">
                          {cuentasBancarias.map((cuenta, index) => (
                            <div
                              key={index}
                              className="bg-slate-50 p-4 rounded-xl border border-slate-200 relative"
                            >
                              <Button
                                isIconOnly
                                size="sm"
                                color="danger"
                                variant="flat"
                                className="absolute top-2 right-2 z-10"
                                onPress={() => removeCuentaBancaria(index)}
                              >
                                <Trash2 size={16} />
                              </Button>

                              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                                Cuenta Bancaria #{index + 1}
                                {cuenta.id ? (
                                  <span className="text-emerald-500 ml-2">
                                    (Guardada)
                                  </span>
                                ) : (
                                  <span className="text-amber-500 ml-2">
                                    (Nueva)
                                  </span>
                                )}
                              </p>

                              <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-4">
                                <Select
                                  label="Banco"
                                  labelPlacement="outside"
                                  placeholder="Seleccione..."
                                  variant="bordered"
                                  size="sm"
                                  classNames={selectClassNames}
                                  selectedKeys={
                                    cuenta.banco_cruenta_bancaria
                                      ? [cuenta.banco_cruenta_bancaria]
                                      : []
                                  }
                                  onChange={(e) =>
                                    handleCuentaChange(
                                      index,
                                      "banco_cruenta_bancaria",
                                      e.target.value,
                                    )
                                  }
                                >
                                  {bancos.map((item) => (
                                    <SelectItem
                                      key={item.banco_nombre}
                                      textValue={item.banco_nombre}
                                    >
                                      {item.banco_nombre}
                                    </SelectItem>
                                  ))}
                                </Select>

                                <Input
                                  label="Nro. Cuenta"
                                  labelPlacement="outside"
                                  placeholder="Ej. 191-12345678-0-12"
                                  variant="bordered"
                                  size="sm"
                                  classNames={inputClassNames}
                                  value={cuenta.nro_cruenta_bancaria}
                                  onChange={(e) =>
                                    handleCuentaChange(
                                      index,
                                      "nro_cruenta_bancaria",
                                      e.target.value,
                                    )
                                  }
                                />

                                <Select
                                  label="Tipo de Cuenta"
                                  labelPlacement="outside"
                                  placeholder="Seleccione..."
                                  variant="bordered"
                                  size="sm"
                                  classNames={selectClassNames}
                                  selectedKeys={
                                    cuenta.tipo_cuenta_bancaria
                                      ? [cuenta.tipo_cuenta_bancaria]
                                      : []
                                  }
                                  onChange={(e) =>
                                    handleCuentaChange(
                                      index,
                                      "tipo_cuenta_bancaria",
                                      e.target.value,
                                    )
                                  }
                                >
                                  {tiposCuentas.map((item) => (
                                    <SelectItem
                                      key={item.tipo_cuenta_nombre}
                                      textValue={item.tipo_cuenta_nombre}
                                    >
                                      {item.tipo_cuenta_nombre}
                                    </SelectItem>
                                  ))}
                                </Select>

                                <Input
                                  label="Código Cuenta (CCI)"
                                  labelPlacement="outside"
                                  placeholder="Opcional..."
                                  variant="bordered"
                                  size="sm"
                                  classNames={inputClassNames}
                                  value={cuenta.codigo_cuenta_bancaria}
                                  onChange={(e) =>
                                    handleCuentaChange(
                                      index,
                                      "codigo_cuenta_bancaria",
                                      e.target.value,
                                    )
                                  }
                                />

                                <Input
                                  label="PUC Cuenta"
                                  labelPlacement="outside"
                                  placeholder="Opcional..."
                                  variant="bordered"
                                  size="sm"
                                  classNames={inputClassNames}
                                  value={cuenta.puc_cuenta_bancaria}
                                  onChange={(e) =>
                                    handleCuentaChange(
                                      index,
                                      "puc_cuenta_bancaria",
                                      e.target.value,
                                    )
                                  }
                                />

                                <div className="flex flex-col">
                                  <label className="block text-xs font-medium text-slate-700 mb-1">
                                    Archivo Adjunto (Constancia)
                                  </label>
                                  <label className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-300 rounded-lg cursor-pointer hover:bg-slate-50 w-full transition-colors h-10 overflow-hidden">
                                    <Upload
                                      size={16}
                                      className="text-slate-400 shrink-0"
                                    />
                                    <span className="text-xs text-slate-600 truncate">
                                      {cuenta.archivo
                                        ? cuenta.archivo.name
                                        : cuenta.link_archivo_adjunto
                                          ? "Actualizar archivo..."
                                          : "Subir archivo..."}
                                    </span>
                                    <input
                                      type="file"
                                      className="hidden"
                                      accept=".pdf,.jpg,.jpeg,.png"
                                      onChange={(e) =>
                                        handleFileChange(index, e)
                                      }
                                    />
                                  </label>
                                  {cuenta.link_archivo_adjunto &&
                                    !cuenta.archivo && (
                                      <a
                                        href={`${import.meta.env.VITE_URL_API_IMAGE}/${cuenta.link_archivo_adjunto}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="text-[10px] text-blue-500 hover:underline mt-1"
                                      >
                                        Ver archivo actual
                                      </a>
                                    )}
                                </div>

                                <div className="flex items-center pt-5">
                                  <Checkbox
                                    color="success"
                                    size="sm"
                                    isSelected={cuenta.cuenta_principal}
                                    onValueChange={(checked) =>
                                      handleCuentaChange(
                                        index,
                                        "cuenta_principal",
                                        checked,
                                      )
                                    }
                                  >
                                    <span className="text-slate-700 font-medium">
                                      Cuenta Principal
                                    </span>
                                  </Checkbox>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </AccordionItem>
                </Accordion>
              </form>
            </ModalBody>

            <ModalFooter className="bg-white border-t border-slate-200 py-4">
              <Button
                color="danger"
                variant="light"
                onPress={onClose}
                className="font-medium"
              >
                Cancelar
              </Button>
              <Button
                className="bg-slate-900 text-white font-bold shadow-md shadow-slate-600/30 px-6"
                type="submit"
                form="form-update-proveedor"
                isLoading={loading}
                startContent={!loading && <Save size={18} />}
              >
                Actualizar Proveedor
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default UpdateProveedor;
