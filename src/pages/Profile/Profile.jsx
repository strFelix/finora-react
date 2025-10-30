import { useState, useEffect } from "react";
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
  FaUserCircle,
} from "react-icons/fa";
import api from "../../services/api";

export default function Profile() {
  const { user, logout, updateUser } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [toast, setToast] = useState(null);
  const [isError, setIsError] = useState(false);
  const [avatarBase64, setAvatarBase64] = useState(null);

  const options = [
    { icon: <FaUser className="text-blue-700" />, label: "Meus dados" },
    { icon: <FaPalette className="text-blue-700" />, label: "Personalizar App" },
    { icon: <FaLock className="text-blue-700" />, label: "Privacidade" },
    { icon: <FaSync className="text-blue-700" />, label: "Sincronizar dados bancários" },
    { icon: <FaQuestionCircle className="text-blue-700" />, label: "Central de ajuda" },
  ];

  useEffect(() => {
    if (user?.preferencesJson) {
      try {
        const prefs =
          typeof user.preferencesJson === "string"
            ? JSON.parse(user.preferencesJson)
            : user.preferencesJson;
        setAvatarBase64(prefs.avatar || null);
      } catch {
        setAvatarBase64(null);
      }
    } else {
      setAvatarBase64(null);
    }
  }, [user]);

  const handleSave = async () => {
    if (!selectedFile) return;

    setUploading(true);
    const reader = new FileReader();

    reader.onloadend = async () => {
      const base64String = reader.result.split(",")[1];
      const payload = {
        darkMode: false,
        language: "pt-br",
        currency: "pt-br",
        itemsPerPage: 0,
        emailNotifications: false,
        avatar: base64String,
      };

      try {
        await api.put(`users/preferences/${user.id}`, payload);
        setAvatarBase64(base64String);

        const { data } = await api.get(`/users/${user.id}`);
        if (typeof updateUser === "function") updateUser(data);

        setIsError(false);
        setShowModal(false);
        setToast("✅ Foto de perfil atualizada!");
      } catch {
        setIsError(true);
        setToast("❌ Erro ao atualizar a foto.");
      } finally {
        setUploading(false);
        setSelectedFile(null);
        setPreview(null);
        setTimeout(() => setToast(null), 3000);
      }
    };

    reader.readAsDataURL(selectedFile);
  };

  return (
    <div className="flex flex-col items-center justify-start p-6 bg-white rounded-2xl shadow-sm mx-auto mt-6 relative">
      <div className="flex justify-between items-center w-full mb-6">
        <FaArrowLeft className="text-blue-900 text-xl cursor-pointer" />
        <h2 className="text-lg font-semibold text-blue-900">Perfil</h2>
        <FaBell className="text-blue-900 text-xl cursor-pointer" />
      </div>

      <div className="relative mb-4">
        {avatarBase64 ? (
          <img
            src={`data:image/png;base64,${avatarBase64}`}
            alt="Foto do usuário"
            className="w-28 h-28 rounded-full object-cover border-4 border-white shadow-md transition-all duration-300"
          />
        ) : (
          <div className="w-28 h-28 rounded-full flex items-center justify-center bg-gray-100 border-4 border-white shadow-md">
            <FaUserCircle className="text-gray-400 text-6xl" />
          </div>
        )}
        <button
          onClick={() => {
            setShowModal(true);
            setToast(null);
          }}
          className="absolute bottom-1 right-1 bg-blue-900 text-white p-2 rounded-full text-xs shadow-md hover:bg-blue-950 transition"
        >
          <FaPen size={10} />
        </button>
      </div>

      <h3 className="text-lg font-semibold text-gray-800">
        {user?.name || "Usuário Anônimo"}
      </h3>
      <div className="mt-1 bg-blue-900 text-white text-xs px-3 py-1 rounded-md font-medium">
        ID: {user?.id || "N/D"}
      </div>

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

      <button
        onClick={logout}
        className="mt-8 flex items-center gap-2 text-red-600 font-medium text-sm hover:text-red-700 transition-all"
      >
        <FaSignOutAlt /> Sair
      </button>

      {showModal && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm z-50 animate-fadeIn"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-white rounded-xl p-6 w-96 animate-slideUp shadow-lg"
            onClick={(e) => e.stopPropagation()} // Evita fechar ao clicar dentro
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              Alterar foto de perfil
            </h3>

            {preview ? (
              <img
                src={preview}
                alt="Pré-visualização"
                className="w-32 h-32 rounded-full object-cover mx-auto mb-4 shadow-md"
              />
            ) : (
              <div className="w-32 h-32 rounded-full flex items-center justify-center bg-gray-100 mx-auto mb-4 shadow-inner">
                <FaUserCircle className="text-gray-400 text-6xl" />
              </div>
            )}

            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  setSelectedFile(file);
                  setPreview(URL.createObjectURL(file));
                }
              }}
              className="block w-full text-sm text-gray-600 mb-3"
            />

            <div className="flex justify-end mt-4">
              <button
                onClick={handleSave}
                disabled={uploading}
                className="px-5 py-2 rounded-md bg-blue-900 text-white hover:bg-blue-950 transition disabled:opacity-50"
              >
                {uploading ? "Salvando..." : "Salvar"}
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div
          className={`fixed bottom-16 right-6 px-4 py-3 rounded-md shadow-lg text-white text-sm font-medium transition-all duration-300 ${
            isError ? "bg-red-600" : "bg-green-600"
          }`}
        >
          {toast}
        </div>
      )}
    </div>
  );
}