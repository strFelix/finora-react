import { useEffect, useState } from 'react'
import api from '../../services/api'
import { useAuth } from '../../hooks/useAuth'
import Input from '../../components/Input'
import Button from '../../components/Button'
import { FaTrashAlt } from "react-icons/fa";

export default function Transaction() {
  const { user } = useAuth()
  const [items, setItems] = useState([])
  const [categories, setCategories] = useState([])

  const [categoryId, setCategoryId] = useState('')
  const [value, setValue] = useState('')
  const [description, setDescription] = useState('')
  const [type, setType] = useState('E')
  const [date, setDate] = useState(() => {
    const now = new Date()
    return now.toISOString().slice(0, 10)
  })

  async function loadTransactions() {
    const { data } = await api.get(`/transactions/user/${user.id}`)
    setItems(data)
  }

  async function loadCategories() {
    const { data } = await api.get(`/categories/user/${user.id}`)
    setCategories(data)
  }

  useEffect(() => {
    loadTransactions()
    loadCategories()
  }, [])

  async function create(e) {
    e.preventDefault()

    const payload = {
      value: Number(value),
      date: date,
      description,
      type, // mantém E ou F
      installment: 1,
      totalInstallments: 1,
      isRecurring: false
    }

    if (categoryId) {
      payload.category = { id: Number(categoryId) }
    }

    await api.post(`/transactions/user/${user.id}`, payload)
    setValue('')
    setDescription('')
    setDate(new Date().toISOString().slice(0, 10))
    setCategoryId('')
    await loadTransactions()
  }

  async function remove(id) {
    await api.delete(`/transactions/${id}`)
    await loadTransactions()
  }

  return (
    <div className="grid md:grid-cols-3 gap-6">
      <div className="md:col-span-1 card p-4 max-h-fit">
        <h2 className="font-semibold mb-3">Nova transação</h2>
        <form onSubmit={create} className="space-y-3">
          <Input label="Valor" type="number" value={value} onChange={e => setValue(e.target.value)} required />
          <Input label="Descrição" value={description} onChange={e => setDescription(e.target.value)} />

          <label className="label">Categoria</label>
          {categories.length > 0 ? (
            <select className="input" value={categoryId} onChange={e => setCategoryId(e.target.value)}>
              <option value="">Sem categoria</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          ) : (
            <select className="input text-gray-400" disabled>
              <option>Não há categorias cadastradas</option>
            </select>
          )}

          <label className="label">Tipo</label>
          <select className="input" value={type} onChange={e => setType(e.target.value)}>
            <option value="E">Saída</option>
            <option value="I">Entrada</option>
          </select>

          <Input label="Data" type="date" value={date} onChange={e => setDate(e.target.value)} required />

          <Button disabled={categories.length === 0 && !categoryId}>Adicionar</Button>
        </form>
      </div>

      <div className="md:col-span-2 card p-4">
        <h2 className="font-semibold mb-3">Transações</h2>

        {items.length === 0 ? (
          <p className="text-gray-500 text-center py-10">Não há transações registradas.</p>
        ) : (
          <ul className="divide-y">
            {items.map(t => (
              <li key={t.id} className="py-3 flex items-center justify-between">
                <div>
                  <div className="font-medium">R$ {t.value?.toFixed?.(2) || t.value}</div>
                  <div className="text-sm text-gray-500">{t.description || '-'}</div>
                  <div className="text-xs text-gray-400">
                    {t.date.split('-').reverse().join('/')} • {t.type === 'I' ? 'Entrada' : 'Saída'}
                    {t.category && t.category.name ? ` • ${t.category.name}` : ''}
                  </div>
                </div>
                <button onClick={() => remove(t.id)} className="text-red-600"><FaTrashAlt /></button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
