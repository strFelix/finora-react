import { useEffect, useState } from 'react'
import api from '../../services/api'
import { useAuth } from '../../hooks/useAuth'
import Input from '../../components/Input'
import Button from '../../components/Button'
import { FaTrashAlt } from "react-icons/fa";

export default function Category(){
  const { user } = useAuth()
  const [items, setItems] = useState([])
  const [name, setName] = useState('')
  const [type, setType] = useState('TRANSPORT')

  const typeOptions = [
    { value: 'TRANSPORT', label: 'Transporte' },
    { value: 'FOOD', label: 'Alimentação' },
    { value: 'HEALTH', label: 'Saúde' },
    { value: 'EDUCATION', label: 'Educação' },
    { value: 'ENTERTAINMENT', label: 'Entretenimento' },
    { value: 'OTHER', label: 'Outros' }
  ]

  async function load(){
    const { data } = await api.get(`/categories/user/${user.id}`)
    setItems(data)
  }
  useEffect(()=>{ load() }, [])

  async function create(e){
    e.preventDefault()
    await api.post(`/categories/user/${user.id}`, { name, type })
    setName('')
    await load()
  }

  async function remove(id){
    await api.delete(`/categories/${id}`)
    await load()
  }

  const translateType = (t) => {
    const found = typeOptions.find(opt => opt.value === t)
    return found ? found.label : t
  }

  return (
    <div className="grid md:grid-cols-3 gap-6">
      <div className="md:col-span-1 card p-4 max-h-fit">
        <h2 className="font-semibold mb-3">Nova categoria</h2>
        <form onSubmit={create} className="space-y-3">
          <Input label="Nome" value={name} onChange={e=>setName(e.target.value)} required/>

          <label className="label">Tipo</label>
          <select className="input" value={type} onChange={e=>setType(e.target.value)}>
            {typeOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>

          <Button>Adicionar</Button>
        </form>
      </div>

      <div className="md:col-span-2 card p-4">
        <h2 className="font-semibold mb-3">Minhas categorias</h2>

        {items.length === 0 ? (
          <p className="text-gray-500 text-center py-10">Nenhuma categoria cadastrada.</p>
        ) : (
          <ul className="divide-y">
            {items.map(c=>(
              <li key={c.id} className="py-3 flex items-center justify-between">
                <div>
                  <div className="font-medium">{c.name}</div>
                  <div className="text-sm text-gray-500">{translateType(c.type)}</div>
                </div>
                <button onClick={()=>remove(c.id)} className="text-red-600"><FaTrashAlt /></button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
