import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { MenuItemComponent } from "./components/MenuItemComponent";
import { MENU_ITEMS } from "./components/MenuItems";

const Menu = () => {
  const location = useLocation();

  // 1. Estado inicial inteligente: Busca qué menú contiene la ruta actual al cargar
  const [openSubMenu, setOpenSubMenu] = useState<string | null>(() => {
    const activeItem = MENU_ITEMS.find((item) =>
      item.submenuItems?.some((subItem) => subItem.path === location.pathname),
    );
    // Si encontramos uno activo, devolvemos su título, si no, null
    return activeItem ? activeItem.title : null;
  });

  // 2. (Opcional) Sincronizar si cambias de ruta programáticamente
  useEffect(() => {
    const activeItem = MENU_ITEMS.find((item) =>
      item.submenuItems?.some((subItem) => subItem.path === location.pathname),
    );
    if (activeItem) {
      setOpenSubMenu(activeItem.title);
    }
  }, [location.pathname]);

  const toggleSubMenu = (menuName: string) => {
    setOpenSubMenu(openSubMenu === menuName ? null : menuName);
  };

  return (
    <div className="w-64 h-full bg-slate-900 text-slate-200 flex flex-col p-4 custom-scrollbar pt-10 pr-0">
      {/* Header del Menú */}
      <div className="flex items-center gap-2 mb-8 px-2">
        <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center font-bold text-slate-900 text-lg">
          M
        </div>
        <h2 className="text-xl font-bold tracking-wide text-white">
          Mi Sistema
        </h2>
      </div>

      <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4 px-3">
        Menu
      </h3>

      {/* Lista de Items */}
      <nav className="flex flex-col gap-1 pb-10 overflow-y-auto pr-2">
        {MENU_ITEMS.map((item, index) => (
          <MenuItemComponent
            key={index}
            item={item}
            isOpen={openSubMenu === item.title}
            onToggle={toggleSubMenu}
          />
        ))}
      </nav>

      <div className="mt-auto px-3 py-4 border-t border-slate-800">
        <p className="text-xs text-slate-500 text-center">
          © 2026 Empresa S.A.
        </p>
      </div>
    </div>
  );
};

export default Menu;
