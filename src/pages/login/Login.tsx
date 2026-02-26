import { Button, Input } from "@heroui/react";
import { useForm } from "react-hook-form";
import type { Login } from "../../types/usuer.type";
import { useCallback, useState } from "react";
import { handleAxiosError } from "../../utils/errorHandler";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { inputClassNames2 } from "../../utils/classNames"; // Asegúrate que tus estilos sean compatibles
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { useAuthStore } from "../../auth/auth.store";
import { IoIosMail } from "react-icons/io";
import { API } from "../../utils/api";

export default function Login() {
  const navigate = useNavigate();
  const { login, savePerfil } = useAuthStore.getState();

  const { register, handleSubmit } = useForm<Login>();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);

  const onSubmit = useCallback(
    async (data: Login) => {
      setLoading(true);
      const url = `${API}/users/login`;

      try {
        const res = await axios.post(url, data);
        login(res.data.token);
        savePerfil(res.data.user);
        navigate("/");
        window.location.reload();
      } catch (err) {
        handleAxiosError(err);
      } finally {
        setLoading(false);
      }
    },
    [login, savePerfil, navigate],
  );

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <main className="w-full min-h-screen flex bg-slate-900 overflow-hidden">
      <section className="hidden md:flex w-1/2 h-screen flex-col items-center justify-center p-10 bg-linear-to-br from-slate-950 to-slate-900 relative">
        <div className="absolute top-10 left-10 w-20 h-20 bg-blue-500 rounded-full blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-purple-500 rounded-full blur-3xl opacity-20"></div>

        <article className="z-10 text-center text-white space-y-4">
          <h1 className="text-3xl lg:text-4xl font-light tracking-wide text-slate-300">
            Bienvenido al ecosistema
          </h1>
          <h2 className="text-7xl lg:text-8xl font-black tracking-tighter flex items-center justify-center gap-1">
            Flu<span className="text-blue-500">X</span>or
          </h2>
          <div className="h-1 w-24 bg-blue-500 mx-auto rounded-full my-4"></div>
          <h3 className="text-xl lg:text-2xl font-medium text-slate-400">
            Soluciones S.A.S
          </h3>
          <p className="max-w-md mx-auto text-slate-500 mt-4 text-sm">
            Gestiona tu facturación de manera rápida, segura y eficiente.
          </p>
        </article>
      </section>

      <section className="w-full md:w-1/2 h-screen flex justify-center items-center p-4 max-sm:p-0 max-sm:bg-white">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full max-w-md bg-white md:rounded-3xl md:p-10 md:shadow-2xl md:shadow-slate-900/50 flex flex-col items-center gap-2 max-sm:h-full max-sm:justify-center max-sm:px-8"
        >
          <div className="mb-8 flex flex-col items-center">
            <img
              className="w-32 h-auto object-contain drop-shadow-md mb-4 rounded-xl"
              src="/logo.png"
              alt="Fluxor Logo"
            />
            <h4 className="text-2xl font-bold text-slate-800 md:hidden">
              Iniciar Sesión
            </h4>
            <p className="text-slate-500 text-sm md:hidden">
              Ingresa tus credenciales para continuar
            </p>
          </div>

          <div className="w-full flex flex-col gap-5">
            <Input
              {...register("correo")}
              isRequired
              label="Correo electrónico"
              placeholder="admin@fluxor.com"
              labelPlacement="outside"
              type="email"
              variant="bordered"
              radius="sm"
              size="md"
              classNames={inputClassNames2}
              endContent={
                <IoIosMail className="text-2xl text-slate-400 pointer-events-none shrink-0" />
              }
            />

            <Input
              {...register("password")}
              isRequired
              label="Contraseña"
              placeholder="••••••••••••"
              labelPlacement="outside"
              type={showPassword ? "text" : "password"}
              variant="bordered"
              radius="sm"
              size="md"
              classNames={inputClassNames2}
              endContent={
                <button
                  className="focus:outline-none"
                  type="button"
                  onClick={togglePasswordVisibility}
                  aria-label="toggle password visibility"
                >
                  {showPassword ? (
                    <AiOutlineEye className="text-2xl text-slate-400 pointer-events-none" />
                  ) : (
                    <AiOutlineEyeInvisible className="text-2xl text-slate-400 pointer-events-none" />
                  )}
                </button>
              }
            />

            <Button
              className="w-full py-6 text-lg font-bold bg-slate-900 text-white shadow-lg shadow-slate-900/20 mt-4 hover:bg-slate-800 transition-transform active:scale-95"
              color="primary"
              size="lg"
              type="submit"
              isLoading={loading}
              spinner={
                <svg
                  className="animate-spin h-5 w-5 text-current"
                  fill="none"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    fill="currentColor"
                  />
                </svg>
              }
            >
              {loading ? "Accediendo..." : "Iniciar Sesión"}
            </Button>
          </div>

          <p className="mt-8 text-xs text-slate-400 text-center">
            &copy; {new Date().getFullYear()} Fluxor Soluciones S.A.S. Todos los
            derechos reservados.
          </p>
        </form>
      </section>
    </main>
  );
}
