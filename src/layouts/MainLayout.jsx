import { Outlet, NavLink } from 'react-router-dom'
import logo from '../assets/img/logo.png'

export default function MainLayout() {

  return (
    <div className="min-h-screen grid grid-rows-[auto,1fr] bg-gray-50">
      <header className="border-b bg-white">
        <div className="container-responsive py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={logo}
              alt="Finora Logo"
              className="w-24 object-contain select-none"
            />
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <NavLink to="/dashboard" className="text-gray-600 hover:text-black">Métricas</NavLink>
            <NavLink to="/categories" className="text-gray-600 hover:text-black">Categorias</NavLink>
            <NavLink to="/transactions" className="text-gray-600 hover:text-black">Transações</NavLink>
            <NavLink to="/profile" className="text-gray-600 hover:text-black">Perfil</NavLink>
          </nav>
        </div>
      </header>
      <main className="container-responsive py-6 w-[90%] mx-auto">
        <Outlet />
      </main>
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t">
        <div className="flex justify-around py-2 text-sm">
          <NavLink to="/dashboard">Métricas</NavLink>
          <NavLink to="/categories">Categorias</NavLink>
          <NavLink to="/transactions">Transações</NavLink>
          <NavLink to="/profile">Perfil</NavLink>
        </div>
      </nav>
    </div>
  )
}
