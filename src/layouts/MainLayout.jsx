import { useState } from 'react'
import { Outlet, NavLink } from 'react-router-dom'
import { FaBars, FaTimes } from 'react-icons/fa'
import logo from '../assets/img/logo.png'
import "../assets/css/animations.css";

export default function MainLayout() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* ===== Header ===== */}
      <header className="border-b bg-white shadow-sm sticky top-0 z-50">
        <div className="container-responsive py-4 flex items-center justify-between px-4">
          {/* Logo */}
          <NavLink to="/dashboard" className="flex items-center gap-3 select-none">
            <img src={logo} alt="Finora Logo" className="w-24 object-contain" />
          </NavLink>

          {/* ===== Menu desktop ===== */}
          <nav className="hidden md:flex items-center gap-6">
            <NavLink to="/dashboard" className="text-gray-600 hover:text-black">
              Métricas
            </NavLink>
            <NavLink to="/categories" className="text-gray-600 hover:text-black">
              Categorias
            </NavLink>
            <NavLink to="/transactions" className="text-gray-600 hover:text-black">
              Transações
            </NavLink>
            <NavLink to="/profile" className="text-gray-600 hover:text-black">
              Perfil
            </NavLink>
          </nav>

          {/* ===== Botão de menu mobile ===== */}
          <button
            className="md:hidden text-gray-700 text-2xl focus:outline-none"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        {/* ===== Menu mobile ===== */}
        {menuOpen && (
          <div className="md:hidden bg-white border-t animate-slideDown">
            <ul className="flex flex-col text-gray-700 text-base">
              <NavLink
                to="/dashboard"
                className="py-3 px-6 hover:bg-gray-100"
                onClick={() => setMenuOpen(false)}
              >
                Métricas
              </NavLink>
              <NavLink
                to="/categories"
                className="py-3 px-6 hover:bg-gray-100"
                onClick={() => setMenuOpen(false)}
              >
                Categorias
              </NavLink>
              <NavLink
                to="/transactions"
                className="py-3 px-6 hover:bg-gray-100"
                onClick={() => setMenuOpen(false)}
              >
                Transações
              </NavLink>
              <NavLink
                to="/profile"
                className="py-3 px-6 hover:bg-gray-100"
                onClick={() => setMenuOpen(false)}
              >
                Perfil
              </NavLink>
            </ul>
          </div>
        )}
      </header>

      {/* ===== Conteúdo principal ===== */}
      <main className="container-responsive py-6 w-[90%] mx-auto flex-1">
        <Outlet />
      </main>

      {/* ===== Footer ===== */}
      <footer className="bg-white border-t shadow-sm py-4">
        <div className="w-full mx-auto max-w-screen-xl px-4 md:flex md:items-center md:justify-between">
          <span className="text-sm text-gray-500 sm:text-center">
            © {new Date().getFullYear()} Finora™. Todos os direitos reservados.
          </span>

          <ul className="flex flex-wrap items-center mt-3 text-sm font-medium text-gray-500 sm:mt-0">
            <li>
              <a href="#" className="hover:underline me-4 md:me-6">
                Sobre
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline me-4 md:me-6">
                Privacidade
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline me-4 md:me-6">
                Licença
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                Contato
              </a>
            </li>
          </ul>
        </div>
      </footer>
    </div>
  )
}
