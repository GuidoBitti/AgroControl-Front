import { fetchWithAuth } from './fetchWithAuth.ts';

const API_URL = import.meta.env.VITE_API_URL

export type Trabajo = {
  id: number
  descripcion: string
  fechaInicio: string
  fechaFin: string
  loteCampañaId: number
  usuarioId: number
}

export async function getTrabajo(): Promise<Trabajo[]> {
  const res = await fetchWithAuth(`${API_URL}/trabajo`)
  if (!res.ok) throw new Error('Error al obtener trabajos')
  return res.json()
}

export async function createTrabajo(data: Omit<Trabajo, 'id'>): Promise<Trabajo> {
  const res = await fetchWithAuth(`${API_URL}/trabajo`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error('Error al crear trabajo')
  return res.json()
}

export async function deleteTrabajo(id: number): Promise<void> {
  const res = await fetchWithAuth(`${API_URL}/trabajo/${id}`, { method: 'DELETE' })
  if (!res.ok) throw new Error('Error al eliminar trabajo')
}