import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import {
  FaEye,
  FaEyeSlash,
  FaShieldAlt,
  FaQuestionCircle,
  FaTimes,
} from "react-icons/fa";
import api from "../../services/api";
import "../../assets/css/animations.css";

export default function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [plainPassword, setPlainPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  // Campos de registro
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regLoading, setRegLoading] = useState(false);
  const [regMessage, setRegMessage] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await login({ email, plainPassword });
    } catch (err) {
      setError("Email ou senha inválidos.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setRegLoading(true);
    setRegMessage("");
    try {
      await api.post("/users/register", {
        name: regName,
        email: regEmail,
        plainPassword: regPassword,
      });
      setRegMessage("✅ Conta criada com sucesso! Faça login.");
      setTimeout(() => setShowRegister(false), 1000);
      setRegName("");
      setRegEmail("");
      setRegPassword("");
    } catch (err) {
      console.error(err);
      if(err.status === 409) {
        setRegMessage("❌ Email já cadastrado.");
      } else {
        setRegMessage("❌ Erro ao criar conta. Verifique os dados.");
      }
    } finally {
      setRegLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white relative">
      {/* ===== LOGIN CARD ===== */}
      <div className="card p-6 rounded-2xl shadow-sm border-0 w-full max-w-lg relative z-10">
        {/* Ícone de ajuda */}
        <div className="text-end text-gray-400">
          <FaQuestionCircle className="inline-block text-lg cursor-pointer hover:text-gray-600" />
        </div>

        {/* Logo */}
        <div className="text-center mb-6 relative">
          <img
            src="/src/assets/img/logo-high.png"
            alt="Finora Logo"
            className="mx-auto w-24"
          />
        </div>

        {/* Formulário */}
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block font-semibold text-sm mb-1 text-gray-700">
              Email
            </label>
            <input
              type="email"
              className="input w-full border-gray-300 focus:ring-0 focus:border-blue-600"
              placeholder="Digite seu email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block font-semibold text-sm mb-1 text-gray-700">
              Senha
            </label>
            <div className="relative flex items-center">
              <input
                type={showPassword ? "text" : "password"}
                className="input w-full border-gray-300 focus:ring-0 focus:border-blue-600 pr-10"
                placeholder="Digite sua senha"
                value={plainPassword}
                onChange={(e) => setPlainPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          {error && <p className="text-red-600 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-900 hover:bg-blue-950 text-white font-semibold py-2 rounded-lg transition"
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>

        {/* Links inferiores */}
        <div className="text-center mt-4">
          <button className="text-blue-700 font-semibold text-sm hover:underline">
            Esqueci minha senha
          </button>
        </div>

        <div className="flex justify-between items-center text-gray-400 text-sm mt-5">
          <div className="flex items-center gap-1">
            <FaShieldAlt /> Safe
          </div>
          <button
            onClick={() => { setShowRegister(true); setRegMessage(""); }}
            className="text-blue-700 font-semibold text-sm hover:underline"
          >
            Criar uma conta
          </button>
        </div>
      </div>

      {/* ===== MODAL DE REGISTRO ===== */}
      {showRegister && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fadeIn z-20">
          <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-md relative animate-slideUp">
            <button
              onClick={() => setShowRegister(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-700"
            >
              <FaTimes />
            </button>

            <h2 className="text-xl font-semibold text-center mb-4 text-blue-900">
              Criar conta
            </h2>

            <form onSubmit={handleRegister} className="space-y-3">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Nome
                </label>
                <input
                  type="text"
                  className="input w-full border-gray-300 focus:ring-0 focus:border-blue-600"
                  placeholder="Seu nome completo"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  className="input w-full border-gray-300 focus:ring-0 focus:border-blue-600"
                  placeholder="Seu melhor email"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Senha
                </label>
                <input
                  type="password"
                  className="input w-full border-gray-300 focus:ring-0 focus:border-blue-600"
                  placeholder="Crie uma senha"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  required
                />
              </div>

              {regMessage && (
                <p
                  className={`text-sm text-center ${
                    regMessage.startsWith("✅")
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {regMessage}
                </p>
              )}

              <button
                type="submit"
                disabled={regLoading}
                className="w-full bg-blue-900 hover:bg-blue-950 text-white font-semibold py-2 rounded-lg transition mt-2"
              >
                {regLoading ? "Criando conta..." : "Cadastrar"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
