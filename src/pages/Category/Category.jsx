import { useEffect, useState } from "react";
import api from "../../services/api";
import { useAuth } from "../../hooks/useAuth";
import Input from "../../components/Input";
import Button from "../../components/Button";
import { FaTrashAlt } from "react-icons/fa";

export default function Category() {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [name, setName] = useState("");
  const [type, setType] = useState("TRANSPORT");
  const [selectedTypes, setSelectedTypes] = useState([]); // <- múltiplos tipos selecionados

  const typeOptions = [
    { value: "TRANSPORT", label: "Transporte" },
    { value: "FOOD", label: "Alimentação" },
    { value: "HEALTH", label: "Saúde" },
    { value: "EDUCATION", label: "Educação" },
    { value: "ENTERTAINMENT", label: "Entretenimento" },
    { value: "OTHER", label: "Outros" },
  ];

  async function load() {
    const { data } = await api.get(`/categories/user/${user.id}`);
    setItems(data);
    setFilteredItems(data);
  }

  useEffect(() => {
    load();
  }, []);

  async function create(e) {
    e.preventDefault();
    await api.post(`/categories/user/${user.id}`, { name, type });
    setName("");
    await load();
  }

  async function remove(id) {
    await api.delete(`/categories/${id}`);
    await load();
  }

  const translateType = (t) => {
    const found = typeOptions.find((opt) => opt.value === t);
    return found ? found.label : t;
  };

  // 🔹 Alterna o estado de seleção dos filtros
  const toggleType = (value) => {
    setSelectedTypes((prev) =>
      prev.includes(value) ? prev.filter((t) => t !== value) : [...prev, value]
    );
  };

  // 🔹 Atualiza as categorias exibidas conforme os tipos selecionados
  useEffect(() => {
    if (selectedTypes.length === 0) {
      setFilteredItems(items);
    } else {
      setFilteredItems(items.filter((i) => selectedTypes.includes(i.type)));
    }
  }, [selectedTypes, items]);

  return (
    <div className="grid md:grid-cols-3 gap-6">
      <div className="md:col-span-1 card p-4 max-h-fit">
        <h2 className="font-semibold mb-3">Nova categoria</h2>
        <form onSubmit={create} className="space-y-3">
          <Input
            label="Nome"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <label className="label">Tipo</label>
          <select
            className="input"
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            {typeOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>

          <Button>Adicionar</Button>
        </form>
      </div>

      <div className="md:col-span-2 card p-4 flex flex-col h-[600px]">
        <h2 className="font-semibold mb-3">Minhas categorias</h2>

        <div className="flex flex-wrap gap-2 mb-4">
          {typeOptions.map((opt) => {
            const isActive = selectedTypes.includes(opt.value);
            return (
              <button
                key={opt.value}
                onClick={() => toggleType(opt.value)}
                className={`px-3 py-1 rounded-full text-sm font-medium border transition-all
                  ${
                    isActive
                      ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                      : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200"
                  }`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>

        <div className="overflow-y-auto pr-2" style={{ maxHeight: "520px" }}>
          {filteredItems.length === 0 ? (
            <p className="text-gray-500 text-center py-10">
              Nenhuma categoria encontrada.
            </p>
          ) : (
            <ul className="divide-y">
              {filteredItems.map((c) => (
                <li
                  key={c.id}
                  className="py-3 flex items-center justify-between"
                >
                  <div>
                    <div className="font-medium">{c.name}</div>
                    <div className="text-sm text-gray-500">
                      {translateType(c.type)}
                    </div>
                  </div>
                  <button
                    onClick={() => remove(c.id)}
                    className="text-red-600 hover:text-red-800 transition"
                  >
                    <FaTrashAlt />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
