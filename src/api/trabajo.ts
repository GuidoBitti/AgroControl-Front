import type { LoteCampania } from "./lote-campania.ts"
import type { Usuario } from "./usuario.ts"

const API_URL = import.meta.env.VITE_API_URL

export type Trabajo = {
  id: number
  descripcion: string
  fechaInicio: string
  fechaFin: string
  LoteCampania: number
  Usuario: number
}

export async function getTrabajo(): Promise<Trabajo[]> {
  const res = await fetch(`${API_URL}/trabajo`)
  if (!res.ok) throw new Error('Error al obtener trabajos')
  return res.json()
}

export async function createTrabajo(data: Omit<Trabajo, 'id'>): Promise<Trabajo> {
  const res = await fetch(`${API_URL}/trabajo`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error('Error al crear trabajo')
  return res.json()
}

export async function deleteTrabajo(id: number): Promise<void> {
  const res = await fetch(`${API_URL}/trabajo/${id}`, { method: 'DELETE' })
  if (!res.ok) throw new Error('Error al eliminar trabajo')
}