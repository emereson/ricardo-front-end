import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line, Bar, Doughnut } from "react-chartjs-2";
import {
  FaArrowUp,
  FaArrowDown,
  FaDollarSign,
  FaUsers,
  FaShoppingCart,
} from "react-icons/fa";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
);

const Analisis = () => {
  const lineChartData = {
    labels: [
      "Ene",
      "Feb",
      "Mar",
      "Abr",
      "May",
      "Jun",
      "Jul",
      "Ago",
      "Sep",
      "Oct",
      "Nov",
      "Dic",
    ],
    datasets: [
      {
        label: "Ingresos",
        data: [
          12000, 19000, 15000, 25000, 22000, 30000, 28000, 35000, 33000, 40000,
          42000, 50000,
        ],
        borderColor: "rgb(16, 185, 129)", // Emerald 500
        backgroundColor: "rgba(16, 185, 129, 0.2)",
        tension: 0.4, // Curva suave
        fill: true,
      },
      {
        label: "Gastos",
        data: [
          8000, 12000, 10000, 15000, 14000, 18000, 16000, 20000, 19000, 22000,
          21000, 25000,
        ],
        borderColor: "rgb(239, 68, 68)", // Red 500
        backgroundColor: "rgba(239, 68, 68, 0.1)",
        tension: 0.4,
        borderDash: [5, 5], // Línea punteada
      },
    ],
  };

  const lineChartOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" as const },
      title: { display: true, text: "Flujo de Caja Anual (2025)" },
    },
    scales: {
      y: { beginAtZero: true },
    },
  };

  // B. Gráfico de Barras (Ventas por Vendedor)
  const barChartData = {
    labels: ["Juan P.", "Maria L.", "Carlos R.", "Ana S.", "Pedro M."],
    datasets: [
      {
        label: "Ventas Completadas",
        data: [45, 59, 34, 71, 26],
        backgroundColor: [
          "rgba(16, 185, 129, 0.8)",
          "rgba(59, 130, 246, 0.8)",
          "rgba(245, 158, 11, 0.8)",
          "rgba(139, 92, 246, 0.8)",
          "rgba(236, 72, 153, 0.8)",
        ],
        borderRadius: 5,
      },
    ],
  };

  // C. Gráfico de Dona (Categorías)
  const doughnutData = {
    labels: ["Servicios", "Productos", "Suscripciones", "Consultoría"],
    datasets: [
      {
        data: [35, 25, 20, 20],
        backgroundColor: [
          "rgb(16, 185, 129)", // Emerald
          "rgb(15, 23, 42)", // Slate 900
          "rgb(59, 130, 246)", // Blue
          "rgb(203, 213, 225)", // Slate 300
        ],
        borderWidth: 0,
      },
    ],
  };

  return (
    <main className="w-full  z-10  flex flex-col  px-6 pt-4 py-3 gap-3">
      {/* --- HEADER --- */}
      <div className="flex justify-between items-center mb-2">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            Dashboard de Análisis
          </h1>
          <p className="text-slate-500 text-sm">
            Resumen general de rendimiento
          </p>
        </div>
        <button className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm hover:bg-slate-800 transition shadow-lg">
          Descargar Reporte
        </button>
      </div>

      {/* --- SECCIÓN DE TARJETAS (KPIs) --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1 */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
          <div>
            <p className="text-slate-500 text-xs uppercase font-bold tracking-wider">
              Ingresos Totales
            </p>
            <h3 className="text-2xl font-bold text-slate-800 mt-1">$128,450</h3>
            <span className="text-emerald-500 text-xs flex items-center gap-1 font-bold mt-2">
              <FaArrowUp /> +12.5%{" "}
              <span className="text-slate-400 font-normal">
                vs mes anterior
              </span>
            </span>
          </div>
          <div className="p-3 bg-emerald-100 rounded-full text-emerald-600">
            <FaDollarSign size={24} />
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
          <div>
            <p className="text-slate-500 text-xs uppercase font-bold tracking-wider">
              Nuevos Clientes
            </p>
            <h3 className="text-2xl font-bold text-slate-800 mt-1">1,240</h3>
            <span className="text-emerald-500 text-xs flex items-center gap-1 font-bold mt-2">
              <FaArrowUp /> +5.2%{" "}
              <span className="text-slate-400 font-normal">
                vs mes anterior
              </span>
            </span>
          </div>
          <div className="p-3 bg-blue-100 rounded-full text-blue-600">
            <FaUsers size={24} />
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
          <div>
            <p className="text-slate-500 text-xs uppercase font-bold tracking-wider">
              Ventas
            </p>
            <h3 className="text-2xl font-bold text-slate-800 mt-1">345</h3>
            <span className="text-red-500 text-xs flex items-center gap-1 font-bold mt-2">
              <FaArrowDown /> -2.4%{" "}
              <span className="text-slate-400 font-normal">
                vs mes anterior
              </span>
            </span>
          </div>
          <div className="p-3 bg-orange-100 rounded-full text-orange-600">
            <FaShoppingCart size={24} />
          </div>
        </div>

        {/* Card 4 */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
          <div>
            <p className="text-slate-500 text-xs uppercase font-bold tracking-wider">
              Ticket Promedio
            </p>
            <h3 className="text-2xl font-bold text-slate-800 mt-1">$350</h3>
            <span className="text-emerald-500 text-xs flex items-center gap-1 font-bold mt-2">
              <FaArrowUp /> +8.1%{" "}
              <span className="text-slate-400 font-normal">
                vs mes anterior
              </span>
            </span>
          </div>
          <div className="p-3 bg-purple-100 rounded-full text-purple-600">
            <FaDollarSign size={24} />
          </div>
        </div>
      </div>

      {/* --- SECCIÓN DE GRÁFICOS --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Gráfico Principal (Ocupa 2 columnas) */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 lg:col-span-2">
          <Line options={lineChartOptions} data={lineChartData} />
        </div>

        {/* Gráfico Dona (Ocupa 1 columna) */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center justify-center">
          <h3 className="text-slate-700 font-bold mb-4 w-full text-left">
            Distribución de Ventas
          </h3>
          <div className="w-full max-w-62.5">
            <Doughnut data={doughnutData} />
          </div>
        </div>
      </div>

      {/* --- SECCIÓN INFERIOR --- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-6 text-sm">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-slate-700 font-bold mb-4">
            Top Vendedores (Mes Actual)
          </h3>
          <Bar data={barChartData} />
        </div>

        {/* Tabla Resumen Simple */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <h3 className="text-slate-700 font-bold mb-4">
            Últimas Transacciones
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left text-slate-500">
              <thead className="text-xs text-slate-700 uppercase bg-slate-50">
                <tr>
                  <th className="px-4 py-3">ID</th>
                  <th className="px-4 py-3">Cliente</th>
                  <th className="px-4 py-3">Monto</th>
                  <th className="px-4 py-3">Estado</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium text-slate-900">
                    #TR-3450
                  </td>
                  <td className="px-4 py-3">Empresa ABC S.A.C.</td>
                  <td className="px-4 py-3">$1,200.00</td>
                  <td className="px-4 py-3">
                    <span className="bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full text-xs">
                      Pagado
                    </span>
                  </td>
                </tr>
                <tr className="border-b hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium text-slate-900">
                    #TR-3451
                  </td>
                  <td className="px-4 py-3">Juan Pérez</td>
                  <td className="px-4 py-3">$450.00</td>
                  <td className="px-4 py-3">
                    <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full text-xs">
                      Pendiente
                    </span>
                  </td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium text-slate-900">
                    #TR-3452
                  </td>
                  <td className="px-4 py-3">Consultora Global</td>
                  <td className="px-4 py-3">$3,500.00</td>
                  <td className="px-4 py-3">
                    <span className="bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full text-xs">
                      Pagado
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Analisis;
