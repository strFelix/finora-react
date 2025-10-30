import { useEffect, useState, useMemo } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";
import api from "../../services/api";
import { useAuth } from "../../hooks/useAuth";

import {
  FaHeartbeat,
  FaBus,
  FaUtensils,
  FaBook,
  FaFilm,
  FaQuestionCircle,
} from "react-icons/fa";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

export default function Dashboard() {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [filter, setFilter] = useState("ALL"); // ALL | INCOME | EXPENSE
  const [categoryMode, setCategoryMode] = useState("TYPE"); // TYPE | CATEGORY

  const categoryTypeStyles = {
    HEALTH: {
      icon: <FaHeartbeat />,
      iconColor: "#FF1111",
      circle: "#FFC7C7",
      bg: "#FFEAEA",
      label: "Saúde",
    },
    TRANSPORT: {
      icon: <FaBus />,
      iconColor: "#0ABBFF",
      circle: "#CEF0FD",
      bg: "#EAF7FF",
      label: "Transporte",
    },
    FOOD: {
      icon: <FaUtensils />,
      iconColor: "#4CE616",
      circle: "#E0F4D9",
      bg: "#EFFCEC",
      label: "Alimentação",
    },
    EDUCATION: {
      icon: <FaBook />,
      iconColor: "#DCEE03",
      circle: "#F1F4CD",
      bg: "#F5F7E0",
      label: "Educação",
    },
    ENTERTAINMENT: {
      icon: <FaFilm />,
      iconColor: "#FF059B",
      circle: "#FCD4EC",
      bg: "#FAEDF4",
      label: "Entretenimento",
    },
    UNDEFINED: {
      icon: <FaQuestionCircle />,
      iconColor: "#999",
      circle: "#DDD",
      bg: "#F5F5F5",
      label: "Indefinido",
    },
    OTHER: {
      icon: <FaQuestionCircle />,
      iconColor: "#9747FF",
      circle: "#E7D4FF",
      bg: "#F7F0FF",
      label: "Outros",
    },
  };

  useEffect(() => {
    async function load() {
      try {
        const { data } = await api.get(`/transactions/user/${user.id}`);
        const sorted = [...data].sort(
          (a, b) => new Date(a.date) - new Date(b.date)
        );
        setTransactions(sorted);
      } catch (e) {
        console.error(e);
      }
    }

    if (user?.id) load();
  }, [user?.id]);

  const filteredTransactions = useMemo(() => {
    if (filter === "INCOME") return transactions.filter((t) => t.type === "I");
    if (filter === "EXPENSE") return transactions.filter((t) => t.type === "E");
    return transactions;
  }, [transactions, filter]);

  const entries = useMemo(
    () =>
      filteredTransactions
        .filter((t) => t.type === "I")
        .reduce((a, b) => a + b.value, 0),
    [filteredTransactions]
  );
  const exits = useMemo(
    () =>
      filteredTransactions
        .filter((t) => t.type === "E")
        .reduce((a, b) => a + b.value, 0),
    [filteredTransactions]
  );
  const total = useMemo(
    () => (filter === "ALL" ? entries - exits : entries + exits),
    [entries, exits, filter]
  );

  const chartData = useMemo(() => {
    if (transactions.length === 0) return { labels: [], datasets: [] };

    const sorted = [...transactions].sort(
      (a, b) => new Date(a.date) - new Date(b.date)
    );

    const labels = sorted.map((t) =>
      new Date(t.date).toLocaleDateString("pt-BR")
    );

    let accumulatedEntry = 0;
    let accumulatedExit = 0;

    const entryValues = sorted.map((t) => {
      if (t.type === "I") accumulatedEntry += t.value;
      return accumulatedEntry;
    });

    const exitValues = sorted.map((t) => {
      if (t.type === "E") accumulatedExit += t.value;
      return accumulatedExit;
    });

    const datasetsBase = [
      {
        label: "Entradas",
        data: entryValues,
        borderColor: "#16a34a",
        backgroundColor: "rgba(22,163,74,0.15)",
        tension: 0.4,
        fill: true,
        borderWidth: 3,
      },
      {
        label: "Saídas",
        data: exitValues,
        borderColor: "#dc2626",
        backgroundColor: "rgba(220,38,38,0.15)",
        tension: 0.4,
        fill: true,
        borderWidth: 3,
      },
    ];

    if (filter === "INCOME") {
      return {
        labels,
        datasets: [
          {
            ...datasetsBase[0],
            borderColor: "#6b7280",
            backgroundColor: "rgba(107,114,128,0.15)",
          },
        ],
      };
    }

    if (filter === "EXPENSE") {
      return {
        labels,
        datasets: [
          {
            ...datasetsBase[1],
            borderColor: "#6b7280",
            backgroundColor: "rgba(107,114,128,0.15)",
          },
        ],
      };
    }

    return { labels, datasets: datasetsBase };
  }, [transactions, filter]);

  const categoriesSummary = useMemo(() => {
    const grouped = {};
    const transactionCount = {};

    filteredTransactions.forEach((t) => {
      if (t.type === "E") {
        const key =
          categoryMode === "TYPE"
            ? t.category?.type || "UNDEFINED"
            : t.category?.name || "Sem categoria";

        grouped[key] = (grouped[key] || 0) + t.value;
        transactionCount[key] = (transactionCount[key] || 0) + 1;
      }
    });

    const totalSpent = Object.values(grouped).reduce((a, b) => a + b, 0);

    return Object.entries(grouped)
      .map(([key, val]) => {
        const style =
          categoryTypeStyles[key?.toUpperCase()] || categoryTypeStyles.OTHER;

        const name = categoryMode === "TYPE" ? style.label || key : key; // quando for por categoria, mostra o nome original

        return {
          key,
          name,
          style,
          value: val,
          percent: totalSpent ? ((val / totalSpent) * 100).toFixed(1) : 0,
          transactions: transactionCount[key] || 0,
        };
      })
      .sort((a, b) => b.value - a.value);
  }, [filteredTransactions, categoryMode]);
  const displayedCategories = categoriesSummary;
  return (
    <div className="space-y-8 w-[full] mb-10">
      <div className="flex justify-center gap-4 mb-2">
        {[
          { key: "ALL", label: "Todos" },
          { key: "INCOME", label: "Entradas" },
          { key: "EXPENSE", label: "Saídas" },
        ].map((opt) => (
          <button
            key={opt.key}
            onClick={() => setFilter(opt.key)}
            className={`px-4 py-1 rounded-full text-sm font-medium transition-all ${
              filter === opt.key
                ? "bg-blue-600 text-white shadow-md"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      <div className="text-center">
        <h2
          className={`text-3xl font-bold ${
            filter === "ALL"
              ? total >= 0
                ? "text-green-600"
                : "text-red-600"
              : "text-gray-700"
          }`}
        >
          R$ {total.toFixed(2)}
        </h2>
        <p className="text-gray-500">
          {filter === "ALL"
            ? "Saldo total"
            : filter === "INCOME"
            ? "Total de entradas"
            : "Total de saídas"}
        </p>
      </div>

      <div className="card p-5 h-[400px] md:h-[500px]">
        <h3 className="font-semibold mb-3 text-gray-700">
          Evolução de Transações
        </h3>
        <Line
          data={chartData}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { position: "top" },
              tooltip: { mode: "index", intersect: false },
            },
            scales: {
              x: { title: { display: true, text: "" } },
              y: {
                beginAtZero: true,
                title: { display: true, text: "Valor (R$)" },
              },
            },
          }}
        />
      </div>

      {filter !== "INCOME" && (
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-700">
              Despesas por
            </h3>

            {/* 🔹 Submenu de agrupamento */}
            <div className="flex gap-2 text-sm">
              {[
                { key: "TYPE", label: "Tipo" },
                { key: "CATEGORY", label: "Categoria" },
              ].map((opt) => (
                <button
                  key={opt.key}
                  onClick={() => setCategoryMode(opt.key)}
                  className={`px-3 py-1 rounded-full transition-all ${
                    categoryMode === opt.key
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {displayedCategories.length === 0 ? (
            <p className="text-gray-500 text-center py-10">
              Nenhuma despesa registrada.
            </p>
          ) : (
            <ul className="space-y-1">
              {displayedCategories.map((c, i) => {
                const style =
                  categoryTypeStyles[c.key?.toUpperCase()] ||
                  categoryTypeStyles.UNDEFINED;

                return (
                  <li
                    key={i}
                    className="relative overflow-hidden rounded-lg p-3"
                  >
                    {/* Barra de preenchimento proporcional */}
                    <div
                      className="absolute top-0 left-0 h-full rounded-lg transition-all duration-500"
                      style={{
                        width: `${parseFloat(c.percent)}%`,
                        backgroundColor: style.circle,
                        opacity: 0.35,
                      }}
                    ></div>

                    <div className="relative flex items-center justify-between">
                      {/* Ícone + nome + transações */}
                      <div className="flex items-center gap-3">
                        <div
                          className="w-10 h-10 flex items-center justify-center rounded-full"
                          style={{
                            backgroundColor: style.circle,
                            color: style.iconColor,
                          }}
                        >
                          {style.icon}
                        </div>

                        <div>
                          <div className="font-semibold text-gray-800 text-base">
                            {c.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {c.transactions} transações
                          </div>
                        </div>
                      </div>

                      {/* Valor e percentual */}
                      <div className="text-right">
                        <div className="font-semibold text-gray-800">
                          R$ {c.value.toFixed(1)}
                        </div>
                        <div className="text-sm text-gray-500">
                          {c.percent}%
                        </div>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}

      <div className="grid md:grid-cols-3 gap-4 ">
        <div className="card p-5">
          <div className="text-gray-500">Transações</div>
          <div className="text-2xl font-semibold">
            {filteredTransactions.length}
          </div>
        </div>

        {(filter === "ALL" || filter === "INCOME") && (
          <div
            className={`card p-5 ${filter === "INCOME" ? "md:col-span-2" : ""}`}
          >
            <div className="text-gray-500">Entradas</div>
            <div
              className={`text-2xl font-semibold ${
                filter === "ALL" ? "text-green-600" : "text-gray-700"
              }`}
            >
              R$ {entries.toFixed(2)}
            </div>
          </div>
        )}

        {(filter === "ALL" || filter === "EXPENSE") && (
          <div
            className={`card p-5 ${
              filter === "EXPENSE" ? "md:col-span-2" : ""
            }`}
          >
            <div className="text-gray-500">Saídas</div>
            <div
              className={`text-2xl font-semibold ${
                filter === "ALL" ? "text-red-600" : "text-gray-700"
              }`}
            >
              R$ {exits.toFixed(2)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
