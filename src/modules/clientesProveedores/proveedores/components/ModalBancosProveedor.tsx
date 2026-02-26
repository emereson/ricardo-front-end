import {
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Chip,
} from "@heroui/react";
import { Landmark, CreditCard, FileText } from "lucide-react";
import type {
  ProveedorType,
  CuentaBancariaProveedor,
} from "../../../../types/proveedor.type";

interface ModalBancosProps {
  isOpen: boolean;
  onOpenChange: () => void;
  proveedor: ProveedorType | null;
}

const ModalBancosProveedor = ({
  isOpen,
  onOpenChange,
  proveedor,
}: ModalBancosProps) => {
  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      size="3xl"
      backdrop="blur"
    >
      <ModalContent>
        {() => (
          <>
            <ModalHeader className="flex flex-col gap-1 bg-slate-900 text-white border-b border-slate-800 py-4">
              <div className="flex items-center gap-2">
                <Landmark className="text-emerald-400" size={20} />
                <span>Cuentas Bancarias del Proveedor</span>
              </div>
              <p className="text-xs font-normal text-slate-400 mt-1 uppercase">
                {proveedor?.razon_social ||
                  `${proveedor?.nombre_proveedor} ${proveedor?.apellidos_proveedor}`}
              </p>
            </ModalHeader>
            <ModalBody className="bg-slate-50/50 p-6">
              {!proveedor?.bancos_proveedor ||
              proveedor.bancos_proveedor.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 opacity-60">
                  <CreditCard size={40} className="text-slate-400 mb-3" />
                  <p className="text-slate-500 font-medium">
                    Este proveedor no tiene cuentas bancarias registradas.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {proveedor.bancos_proveedor.map(
                    (cuenta: CuentaBancariaProveedor) => (
                      <div
                        key={cuenta.id}
                        className={`p-4 rounded-xl border relative overflow-hidden transition-all ${
                          cuenta.cuenta_principal
                            ? "bg-emerald-50 border-emerald-200 shadow-sm"
                            : "bg-white border-slate-200"
                        }`}
                      >
                        {/* Etiqueta de Cuenta Principal */}
                        {cuenta.cuenta_principal && (
                          <div className="absolute top-0 right-0 bg-emerald-500 text-white text-[9px] font-bold px-2 py-1 rounded-bl-lg tracking-wider uppercase">
                            Principal
                          </div>
                        )}

                        <div className="flex items-start gap-3 mb-4">
                          <div
                            className={`p-2 rounded-lg ${
                              cuenta.cuenta_principal
                                ? "bg-emerald-100 text-emerald-700"
                                : "bg-slate-100 text-slate-600"
                            }`}
                          >
                            <Landmark size={20} />
                          </div>
                          <div>
                            <h4 className="font-bold text-slate-800 uppercase text-sm leading-tight">
                              {cuenta.banco_cruenta_bancaria}
                            </h4>
                            <p className="text-xs text-slate-500 font-medium mt-0.5">
                              {cuenta.tipo_cuenta_bancaria}
                            </p>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <div>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">
                              Nro. de Cuenta
                            </p>
                            <p className="font-mono text-sm text-slate-800 font-medium bg-white/70 py-1.5 px-3 rounded-md border border-slate-200 w-full break-all">
                              {cuenta.nro_cruenta_bancaria}
                            </p>
                          </div>

                          {cuenta.codigo_cuenta_bancaria && (
                            <div>
                              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">
                                CCI
                              </p>
                              <p className="font-mono text-xs text-slate-700 bg-white/70 py-1.5 px-3 rounded-md border border-slate-200 w-full break-all">
                                {cuenta.codigo_cuenta_bancaria}
                              </p>
                            </div>
                          )}
                        </div>

                        <div className="mt-5 pt-3 border-t border-slate-200/60 flex items-center justify-between">
                          <Chip
                            size="sm"
                            variant="dot"
                            color={
                              cuenta.estado_cuenta === "ACTIVO"
                                ? "success"
                                : "default"
                            }
                            className="border-none px-0 gap-1 text-[10px] font-bold"
                          >
                            {cuenta.estado_cuenta}
                          </Chip>

                          {cuenta.link_archivo_adjunto && (
                            <Button
                              size="sm"
                              variant="light"
                              color="primary"
                              className="h-7 text-[10px] font-bold"
                              startContent={<FileText size={12} />}
                              onPress={() =>
                                window.open(
                                  `${import.meta.env.VITE_URL_IMAGE}/${cuenta.link_archivo_adjunto}`,
                                  "_blank",
                                )
                              }
                            >
                              Ver Constancia
                            </Button>
                          )}
                        </div>
                      </div>
                    ),
                  )}
                </div>
              )}
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default ModalBancosProveedor;
