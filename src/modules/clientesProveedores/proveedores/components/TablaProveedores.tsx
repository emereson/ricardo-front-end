import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  useDisclosure,
  Chip,
  Tooltip,
} from "@heroui/react";
import { useState } from "react";
import {
  Landmark,
  Edit,
  CheckCircle2,
  XCircle,
  Building2,
  User,
  MapPin,
} from "lucide-react";
import type { ProveedorType } from "../../../../types/proveedor.type";
import ModalBancosProveedor from "./ModalBancosProveedor";
import { formatDate } from "../../../../utils/formatDate";

interface Props {
  proveedores: ProveedorType[];
  onOpen: () => void;
  setSelectModal: (modal: string) => void;
  setSelectProveedor: (proveedor: ProveedorType) => void;
}

const TablaProveedores = ({
  proveedores,
  onOpen,
  setSelectModal,
  setSelectProveedor,
}: Props) => {
  const { isOpen, onOpen: onOpenBancos, onOpenChange } = useDisclosure();
  const [proveedorSeleccionado, setProveedorSeleccionado] =
    useState<ProveedorType | null>(null);

  const handleVerBancos = (proveedor: ProveedorType) => {
    setProveedorSeleccionado(proveedor);
    onOpenBancos();
  };

  return (
    <div className="w-full bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden relative">
      <Table
        aria-label="Tabla de proveedores detallada"
        color="default"
        isStriped
        classNames={{
          // Forzamos el scroll horizontal para que las columnas respiren
          base: "w-full overflow-x-auto",
          table: "min-w-[1800px]", // Ancho mínimo extenso para acomodar tantas columnas
          wrapper: "p-0 rounded-none shadow-none",
          th: "bg-slate-900 text-white text-[11px] font-bold uppercase tracking-wider py-3 whitespace-nowrap",
          td: "py-3 text-slate-700 text-xs",
        }}
        radius="none"
      >
        <TableHeader>
          <TableColumn className="w-10 text-center">Nº</TableColumn>
          <TableColumn className="min-w-30">NOMBRE Y APELLIDOS</TableColumn>
          <TableColumn className="min-w-32.5">
            TIPO DOC <br />
            NÚMERO DOC.
          </TableColumn>
          <TableColumn className="min-w-50">
            PROVEEDOR / RAZÓN SOCIAL
          </TableColumn>
          <TableColumn className="min-w-37.5">FECHA NAC/REG</TableColumn>
          <TableColumn className="min-w-35">TELÉFONO</TableColumn>
          <TableColumn className="min-w-45">CORREO</TableColumn>
          <TableColumn className="min-w-40">UBICACIÓN (DEPTO/MUNI)</TableColumn>
          <TableColumn className="min-w-50">DIRECCIÓN</TableColumn>
          <TableColumn className="min-w-45">RETENCIONES</TableColumn>
          <TableColumn className="text-center min-w-25">ESTADO</TableColumn>
          <TableColumn className="text-center min-w-30">BANCOS</TableColumn>
          <TableColumn className="text-center sticky right-0 bg-slate-900 z-10 w-20">
            ACCIONES
          </TableColumn>
        </TableHeader>
        <TableBody
          emptyContent={
            <div className="p-4 text-slate-500 text-sm">
              No hay proveedores registrados.
            </div>
          }
        >
          {proveedores?.map((item, index) => (
            <TableRow
              key={item.id}
              className="hover:bg-slate-50 transition-colors"
            >
              {/* 1. NÚMERO */}
              <TableCell className="text-center font-bold text-slate-400">
                {index + 1}
              </TableCell>

              {/* 2. TIPO DOC */}
              <TableCell className=" text-slate-600 text-[11px] font-semibold">
                {item.apellidos_proveedor} {item.nombre_proveedor}
              </TableCell>

              {/* 3. NUMERO DOC */}
              <TableCell>
                <span className="text-[10px] text-nowrap">
                  {item.tipo_documento_identidad}
                </span>
                <span className="font-mono font-medium text-slate-800">
                  <br />
                  {item.numero_doc}
                </span>
              </TableCell>

              {/* 4. PROVEEDOR / RAZÓN SOCIAL */}
              <TableCell>
                <div className="flex items-center gap-2">
                  {item.razon_social ? (
                    <>
                      <Building2
                        size={14}
                        className="text-slate-400 shrink-0"
                      />
                      <span className="font-bold text-slate-800 uppercase truncate max-w-45">
                        {item.razon_social}
                      </span>
                    </>
                  ) : (
                    <>
                      <User size={14} className="text-slate-400 shrink-0" />
                      <span className="font-bold text-slate-800 uppercase truncate max-w-45">
                        {item.nombre_proveedor} {item.apellidos_proveedor}
                      </span>
                    </>
                  )}
                </div>
              </TableCell>

              {/* 5. FECHA NAC/CREACIÓN */}
              <TableCell>
                {item.nacimiento_proveedor ? (
                  <span className="text-slate-600">
                    {formatDate(item.nacimiento_proveedor)}
                  </span>
                ) : (
                  <span className="text-slate-300 italic">-</span>
                )}
              </TableCell>

              {/* 6. TELÉFONO */}
              <TableCell>
                {item.telefono_proveedor ? (
                  <span className="text-slate-700">
                    <span className="text-slate-400 text-[10px]">
                      ({item.indicativo_pais})
                    </span>{" "}
                    {item.telefono_proveedor}
                  </span>
                ) : (
                  <span className="text-slate-300 italic">-</span>
                )}
              </TableCell>

              {/* 7. CORREO */}
              <TableCell>
                {item.corre_proveedor ? (
                  <span className="text-slate-600 ">
                    {item.corre_proveedor}
                  </span>
                ) : (
                  <span className="text-slate-300 italic">-</span>
                )}
              </TableCell>

              {/* 8. UBICACIÓN */}
              <TableCell>
                <span className="flex gap-2 ">
                  {item.pais_proveedor} - {item.departamento_proveedor} -{" "}
                  {item.muncipio_proveedor}
                </span>
              </TableCell>

              {/* 9. DIRECCIÓN */}
              <TableCell>
                <Tooltip
                  content={item.direccion}
                  placement="top"
                  classNames={{ content: "max-w-xs text-xs" }}
                >
                  <div className="flex items-center gap-1.5 max-w-45">
                    <MapPin size={12} className="text-slate-400 shrink-0" />
                    <span className="truncate text-slate-600">
                      {item.direccion || (
                        <span className="text-slate-300 italic">-</span>
                      )}
                    </span>
                  </div>
                </Tooltip>
              </TableCell>

              {/* 10. RETENCIONES / INFO TRIBUTARIA */}
              <TableCell>
                <div className="flex flex-wrap gap-1 w-full">
                  {item.clasificacion_tributaria && (
                    <span className="w-full text-[10px] font-bold text-slate-500 mb-1 truncate">
                      {item.clasificacion_tributaria}
                    </span>
                  )}
                  {item.gran_contribuyente && (
                    <Chip
                      size="sm"
                      className="h-4 text-[9px] px-1 bg-amber-100 text-amber-700"
                    >
                      Gran Contribuyente
                    </Chip>
                  )}
                  {item.regimen_simple && (
                    <Chip
                      size="sm"
                      className="h-4 text-[9px] px-1 bg-blue-100 text-blue-700"
                    >
                      Reg. Simple
                    </Chip>
                  )}
                  {item.autorretiene_renta && (
                    <Chip
                      size="sm"
                      className="h-4 text-[9px] px-1 bg-emerald-100 text-emerald-700"
                    >
                      Aut. Renta
                    </Chip>
                  )}
                  {item.autorretiene_iva && (
                    <Chip
                      size="sm"
                      className="h-4 text-[9px] px-1 bg-emerald-100 text-emerald-700"
                    >
                      Aut. IVA
                    </Chip>
                  )}
                  {item.autorretiene_ica && (
                    <Chip
                      size="sm"
                      className="h-4 text-[9px] px-1 bg-emerald-100 text-emerald-700"
                    >
                      Aut. ICA
                    </Chip>
                  )}
                  {item.exento_gmf && (
                    <Chip
                      size="sm"
                      className="h-4 text-[9px] px-1 bg-purple-100 text-purple-700"
                    >
                      Exento GMF
                    </Chip>
                  )}

                  {!item.gran_contribuyente &&
                    !item.regimen_simple &&
                    !item.autorretiene_renta &&
                    !item.autorretiene_iva &&
                    !item.autorretiene_ica &&
                    !item.exento_gmf && (
                      <span className="text-[10px] text-slate-400 italic">
                        Ninguna
                      </span>
                    )}
                </div>
              </TableCell>

              {/* 11. ESTADO */}
              <TableCell className="text-center">
                <Chip
                  size="sm"
                  color={item.estado === "ACTIVO" ? "success" : "danger"}
                  variant="flat"
                  className="font-bold text-[10px] tracking-wider"
                  startContent={
                    item.estado === "ACTIVO" ? (
                      <CheckCircle2 size={12} />
                    ) : (
                      <XCircle size={12} />
                    )
                  }
                >
                  {item.estado}
                </Chip>
              </TableCell>

              {/* 12. BANCOS */}
              <TableCell className="text-center">
                <Button
                  size="sm"
                  variant="flat"
                  className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-bold h-7 text-[10px]"
                  onPress={() => handleVerBancos(item)}
                  startContent={<Landmark size={12} />}
                >
                  Bancos ({item.bancos_proveedor?.length || 0})
                </Button>
              </TableCell>

              {/* 13. ACCIONES (Pegada a la derecha con sombra para efecto flotante) */}
              <TableCell className="text-center sticky right-0 bg-white border-l border-slate-200 shadow-[-4px_0_10px_-5px_rgba(0,0,0,0.1)] z-10">
                <Button
                  isIconOnly
                  size="sm"
                  className="bg-slate-100 text-slate-600 hover:bg-slate-900 hover:text-white transition-colors shadow-sm"
                  onPress={() => {
                    setSelectProveedor(item);
                    setSelectModal("update");
                    onOpen();
                  }}
                >
                  <Edit size={14} />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <ModalBancosProveedor
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        proveedor={proveedorSeleccionado}
      />
    </div>
  );
};

export default TablaProveedores;
