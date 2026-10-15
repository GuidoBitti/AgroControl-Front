const API_URL = import.meta.env.VITE_API_URL

export type Insumo = {
  id: number
  nombre: string
  stock: number
  tipo: string
  descripcion: string
}

export async function getInsumo(): Promise<Insumo[]> {
  const res = await fetch(`${API_URL}/insumos`)
  if (!res.ok) throw new Error('Error al obtener insumos')
  return res.json()
}

export async function createInsumo(data: Omit<Insumo, 'id'>): Promise<Insumo> {
  const res = await fetch(`${API_URL}/insumos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error('Error al crear insumo')
  return res.json()
}

export async function deleteInsumo(id: number): Promise<void> {
  const res = await fetch(`${API_URL}/insumos/${id}`, { method: 'DELETE' })
  if (!res.ok) throw new Error('Error al eliminar insumo')
}