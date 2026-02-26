import { Link, useLocation } from "react-router-dom"; // 1. Importar useLocation
import type { SubMenuItem } from "./MenuItems";

interface Props {
  item: SubMenuItem;
}

export const SubMenuItemComponent = ({ item }: Props) => {
  const location = useLocation();
  const isActive = location.pathname === item.path;

  return (
    <Link
      to={item.path}
      className={`
       w-full flex items-center gap-3 p-2 rounded-lg text-[11px] font-medium transition-all duration-200 
        ${
          isActive
            ? "bg-emerald-600 text-white hover:bg-emerald-500 shadow-md translate-x-1"
            : "text-slate-400 hover:text-white hover:bg-slate-800"
        }
      `}
    >
      <span className={isActive ? "text-white" : "text-emerald-500"}>
        {item.icon}
      </span>
      <span>{item.title}</span>
    </Link>
  );
};
