import {
  Avatar,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@heroui/react";
import { useAuthStore } from "../auth/auth.store";

export default function Header() {
  const { perfil, logout } = useAuthStore.getState();
  // const location = useLocation();

  // const activeItem = MENU_ITEMS.find((item) => {
  //   const path = location.pathname;
  //   return path.includes(item.to.replace(/^\//, ""));
  // });
  // const ActiveIcon = activeItem?.icon;

  return (
    <header className="w-full relative min-h-12 bg-white px-6 py-2 rounded-t-2xl overflow-hidden flex items-center justify-end border-b-1 border-white shadow-sm">
      {/* <section className="flex items-center gap-3 text-slate-700">
        {ActiveIcon && <ActiveIcon className="text-3xl text-emerald-600" />}
        <h1 className="text-2xl font-black   text-emerald-600">
          {activeItem?.label || "Bienvenido"}{" "}
        </h1>
      </section> */}

      <Dropdown placement="bottom-end">
        <DropdownTrigger>
          <Avatar
            size="sm"
            isBordered
            as="button"
            className="transition-transform cursor-pointer hover:scale-105 ring-2 ring-emerald-500 ring-offset-2"
            src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
          />
        </DropdownTrigger>
        <DropdownMenu aria-label="Profile Actions" variant="flat">
          <DropdownItem
            key="profile"
            className="h-14 gap-2 border-b-1 border-gray-200"
            textValue="Perfil"
          >
            <p className="font-semibold text-sm">
              {perfil?.nombre || "Usuario"}
            </p>
            <p className="font-medium text-xs text-default-500">
              {perfil?.correo || "correo@ejemplo.com"}
            </p>
          </DropdownItem>
          <DropdownItem key="settings">Configuración</DropdownItem>
          <DropdownItem key="logout" color="danger" onPress={logout}>
            Cerrar Sesión
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </header>
  );
}
