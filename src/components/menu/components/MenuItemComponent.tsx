import { Link, useLocation } from "react-router-dom";
import { SubMenuItemComponent } from "./SubMenuItem";
import { MdExpandMore } from "react-icons/md";
import type { MenuItemData } from "./MenuItems";

interface Props {
  item: MenuItemData;
  isOpen: boolean;
  onToggle: (title: string) => void;
}

export const MenuItemComponent = ({ item, isOpen, onToggle }: Props) => {
  const location = useLocation();
  const hasSubmenu = !!item.submenuItems && item.submenuItems.length > 0;

  const isParentActive = hasSubmenu
    ? item.submenuItems?.some((subItem) => subItem.path === location.pathname)
    : item.path === location.pathname;

  return (
    <div className="mb-1">
      <div
        onClick={() => hasSubmenu && onToggle(item.title)}
        className={`
          group flex items-center justify-between p-2 rounded-xl cursor-pointer transition-all duration-200 border border-transparent
          ${
            isParentActive
              ? "bg-emerald-600/20 border-emerald-500/30 text-emerald-400"
              : "hover:bg-slate-800 text-slate-300 hover:text-white"
          }
        `}
      >
        <div className="flex items-center gap-3 font-medium">
          <span
            className={
              isParentActive
                ? "text-emerald-400"
                : "text-slate-400 group-hover:text-emerald-400"
            }
          >
            {item.icon}
          </span>

          {!hasSubmenu && item.path ? (
            <Link to={item.path} className="flex-1">
              {item.title}
            </Link>
          ) : (
            <span className="flex-1 text-xs">{item.title}</span>
          )}
        </div>

        {hasSubmenu && (
          <span
            className={`transition-transform duration-300 ${isOpen ? "rotate-180 text-emerald-400" : "text-slate-500"}`}
          >
            <MdExpandMore size={22} />
          </span>
        )}
      </div>

      <div
        className={`
          overflow-hidden transition-all duration-300 ease-in-out pr-2 bg-slate-800 py-1 rounded-lg
          ${isOpen ? "max-h-125 opacity-100 mt-1" : "max-h-0 opacity-0"}
        `}
      >
        <div className="flex flex-col gap-1 pl-4 border-l-2 border-emerald-800 py-1">
          {item.submenuItems?.map((subItem, index) => (
            <SubMenuItemComponent key={index} item={subItem} />
          ))}
        </div>
      </div>
    </div>
  );
};
