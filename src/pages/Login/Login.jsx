
import { useState } from 'react'
import Input from '../../components/Input'
import Button from '../../components/Button'
import { useAuth } from '../../hooks/useAuth'

export default function Login(){
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [plainPassword, setPlainPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const onSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try{
      await login({ email, plainPassword })
    }catch(err){
      setError('Email ou senha inválidos.')
    }finally{
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen grid place-items-center">
      <form onSubmit={onSubmit} className="card w-full max-w-md p-6 space-y-4">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-brand-500 rounded-xl" />
          <h1 className="text-xl font-semibold">Entrar no Finora</h1>
        </div>
        <Input label="Email" type="email" value={email} onChange={e=>setEmail(e.target.value)} required />
        <Input label="Senha" type="password" value={plainPassword} onChange={e=>setPlainPassword(e.target.value)} required />
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <Button disabled={loading}>{loading ? 'Entrando...' : 'Entrar'}</Button>
      </form>
    </div>
  )
}
