
import React, { createContext, useContext, useEffect, useState } from 'react'
import { Navigate, Outlet, useNavigate } from 'react-router-dom'
import api from '../services/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }){
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('finora:user')
    return stored ? JSON.parse(stored) : null
  })
  const navigate = useNavigate()

  const updateUser = (newUser) => {
    setUser(newUser);
    localStorage.setItem("user", JSON.stringify(newUser));
  };


  const login = async ({ email, plainPassword }) => {
    const { data } = await api.post('/users/authenticate', { email, plainPassword })
    setUser(data)
    localStorage.setItem('finora:user', JSON.stringify(data))
    navigate('/dashboard')
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('finora:user')
    navigate('/')
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(){
  return useContext(AuthContext)
}

// Wrapper to protect routes
export function ProtectedRoute({ children }){
  const { user } = useAuth()
  if(!user) return <Navigate to="/" replace />
  return children || <Outlet/>
}
