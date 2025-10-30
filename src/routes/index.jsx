
import { Routes, Route, Navigate } from 'react-router-dom'
import Login from '../pages/Login/Login'
import Dashboard from '../pages/Dashboard/Dashboard'
import Category from '../pages/Category/Category'
import Transaction from '../pages/Transaction/Transaction'
import Profile from '../pages/Profile/Profile'
import MainLayout from '../layouts/MainLayout'
import { ProtectedRoute } from '../hooks/useAuth'

export default function RoutesIndex(){
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route element={<ProtectedRoute><MainLayout/></ProtectedRoute>}>
        <Route path="/dashboard" element={<Dashboard/>}/>
        <Route path="/categories" element={<Category/>}/>
        <Route path="/transactions" element={<Transaction/>}/>
        <Route path="/profile" element={<Profile/>}/>
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
