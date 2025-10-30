import { useAuth } from "../../hooks/useAuth";
import {
  FaUser,
  FaPalette,
  FaLock,
  FaSync,
  FaQuestionCircle,
  FaSignOutAlt,
  FaBell,
  FaArrowLeft,
  FaPen,
} from "react-icons/fa";

export default function Profile() {
  const { user, logout } = useAuth();

  const options = [
    { icon: <FaUser className="text-blue-700" />, label: "Meus dados" },
    { icon: <FaPalette className="text-blue-700" />, label: "Personalizar App" },
    { icon: <FaLock className="text-blue-700" />, label: "Privacidade" },
    { icon: <FaSync className="text-blue-700" />, label: "Sincronizar dados bancários" },
    { icon: <FaQuestionCircle className="text-blue-700" />, label: "Central de ajuda" },
  ];

  return (
    <div className="flex flex-col items-center justify-start p-6 bg-white rounded-2xl shadow-sm mx-auto mt-6">
      {/* Cabeçalho */}
      <div className="flex justify-between items-center w-full mb-6">
        <FaArrowLeft className="text-white text-xl cursor-pointer" />
        <h2 className="text-lg font-semibold text-blue-900">Perfil</h2>
        <FaBell className="text-blue-900 text-xl" />
      </div>

      {/* Foto de perfil */}
      <div className="relative mb-4">
        <img
          src="https://via.placeholder.com/120"
          alt="Foto do usuário"
          className="w-28 h-28 rounded-full object-cover border-4 border-white shadow-md"
        />
        <button className="absolute bottom-1 right-1 bg-blue-900 text-white p-2 rounded-full text-xs shadow-md">
          <FaPen size={10} />
        </button>
      </div>

      {/* Nome e tag */}
      <h3 className="text-lg font-semibold text-gray-800">{user?.name}</h3>
      <div className="mt-1 bg-blue-900 text-white text-xs px-3 py-1 rounded-md font-medium">
        {user?.id}
      </div>

      {/* Opções */}
      <div className="mt-8 w-full border-t divide-y">
        {options.map((opt, i) => (
          <div
            key={i}
            className="flex items-center justify-between py-3 px-2 hover:bg-gray-50 cursor-pointer"
          >
            <div className="flex items-center gap-3">
              {opt.icon}
              <span className="text-gray-700 text-sm">{opt.label}</span>
            </div>
            <span className="text-gray-400 text-sm">›</span>
          </div>
        ))}
      </div>

      {/* Botão de sair */}
      <button
        onClick={logout}
        className="mt-8 flex items-center gap-2 text-red-600 font-medium text-sm hover:text-red-700 transition-all"
      >
        <FaSignOutAlt /> Sair
      </button>
    </div>
  );
}
