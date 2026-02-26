import React from "react";
// Iconos Importados
import {
  FaShoppingCart,
  FaBoxOpen,
  FaHandshake,
  FaUserTie,
  FaUsers,
  FaFileInvoiceDollar,
} from "react-icons/fa";
import { MdDashboard, MdAttachMoney, MdPostAdd } from "react-icons/md";
import {
  IoReceipt,
  IoSettingsSharp,
  IoStatsChart,
  IoWallet,
} from "react-icons/io5";
import { TbReportAnalytics } from "react-icons/tb";
import { HiDocumentText } from "react-icons/hi";
import { BsBank } from "react-icons/bs";

// Interfaces
export interface SubMenuItem {
  title: string;
  icon: React.ReactNode;
  path: string;
  isHighlight?: boolean;
}

export interface MenuItemData {
  title: string;
  icon: React.ReactNode;
  path?: string;
  submenuItems?: SubMenuItem[];
}

export const MENU_ITEMS: MenuItemData[] = [
  {
    title: "Dashboard",
    icon: <MdDashboard size={18} />,
    submenuItems: [
      {
        title: "Análisis",
        icon: <IoStatsChart size={18} />,
        path: "/",
        isHighlight: true,
      },
      {
        title: "Flujo de Caja",
        icon: <IoWallet size={18} />,
        path: "/dashboard/flujo-caja",
      },
    ],
  },
  {
    title: "Ventas",
    icon: <MdAttachMoney size={18} />, // Icono de dinero
    submenuItems: [
      {
        title: "Nueva Cotización",
        icon: <MdPostAdd size={18} />,
        path: "/ventas/nueva",
      },
      {
        title: "Facturas y Boletas",
        icon: <FaFileInvoiceDollar size={18} />,
        path: "/ventas/facturas",
      },
      {
        title: "Cotizaciones",
        icon: <HiDocumentText size={18} />,
        path: "/ventas/cotizaciones",
      },
    ],
  },
  {
    title: "Compras",
    icon: <FaShoppingCart size={18} />, // Carrito
    submenuItems: [
      {
        title: "SOLPED",
        icon: <MdPostAdd size={18} />,
        path: "/compras/solped",
        isHighlight: true,
      },
      {
        title: "Status SOLPED",
        icon: <IoReceipt size={18} />,
        path: "/compras/status-solped",
      },
    ],
  },
  {
    title: "Comprobantes",
    icon: <FaFileInvoiceDollar size={18} />,
    submenuItems: [
      {
        title: "Emitir Comprobante",
        icon: <MdPostAdd size={18} />,
        path: "/comprobantes/emitir",
        isHighlight: true,
      },
      {
        title: "Status Comprobantes",
        icon: <IoReceipt size={18} />,
        path: "/comprobantes/status",
      },
    ],
  },
  {
    title: "Productos",
    icon: <FaBoxOpen size={18} />, // Caja abierta
    submenuItems: [
      {
        title: "Servicios",
        icon: <MdPostAdd size={18} />,
        path: "/productos/servicios",
        isHighlight: true,
      },
      {
        title: "Costos y Gastos",
        icon: <IoWallet size={18} />,
        path: "/productos/costos-gastos",
      },
    ],
  },
  {
    title: "Reportes",
    icon: <TbReportAnalytics size={18} />, // Icono específico de reportes
    submenuItems: [
      {
        title: "Reporte Cotizaciones",
        icon: <HiDocumentText size={18} />,
        path: "/reportes/cotizaciones",
        isHighlight: true,
      },
      {
        title: "Reporte SOLPED",
        icon: <IoReceipt size={18} />,
        path: "/reportes/solped",
      },
    ],
  },
  {
    title: "Gestión Externa", // Clientes / Proveedores / Agencias
    icon: <FaHandshake size={18} />, // Apretón de manos
    submenuItems: [
      {
        title: "Clientes",
        icon: <FaUsers size={18} />,
        path: "/clientes",
        isHighlight: true,
      },
      {
        title: "Proveedores",
        icon: <FaUserTie size={18} />,
        path: "/proveedores",
      },
      { title: "Agencias", icon: <BsBank size={18} />, path: "/agencias" },
    ],
  },
  {
    title: "RRHH",
    icon: <FaUserTie size={18} />, // Corbata
    submenuItems: [
      {
        title: "Colaboradores",
        icon: <FaUsers size={18} />,
        path: "/rrhh/colaboradores",
        isHighlight: true,
      },
      { title: "Bajas", icon: <IoReceipt size={18} />, path: "/rrhh/bajas" },
      { title: "Cargos", icon: <FaUserTie size={18} />, path: "/rrhh/cargos" },
      {
        title: "Descanso Médico",
        icon: <IoReceipt size={18} />,
        path: "/rrhh/descanso-medico",
      },
      {
        title: "Vacaciones",
        icon: <IoReceipt size={18} />,
        path: "/rrhh/vacaciones",
      },
    ],
  },
  {
    title: "Usuarios",
    icon: <FaUsers size={18} />,
    path: "/usuarios",
  },
  {
    title: "Ajustes",
    icon: <IoSettingsSharp size={18} />, // Engranaje
    submenuItems: [
      {
        title: "Pagos y Gastos",
        icon: <IoWallet size={18} />,
        path: "/ajustes/pagos",
        isHighlight: true,
      },
      { title: "Bancos", icon: <BsBank size={18} />, path: "/ajustes/bancos" },
      {
        title: "Encargados",
        icon: <FaUserTie size={18} />,
        path: "/ajustes/encargados",
      },
      {
        title: "Centro Costos",
        icon: <IoStatsChart size={18} />,
        path: "/ajustes/centro-costos",
      },
    ],
  },
];
