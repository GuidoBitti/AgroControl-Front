import { fetchWithAuth } from './fetchWithAuth.ts'

const API_URL = import.meta.env.VITE_API_URL

export type TipoInsumo = {
  id: number
  nombre: string
}

export async function getTiposInsumo(): Promise<TipoInsumo[]> {
  const res = await fetchWithAuth(`${API_URL}/tipos-insumo`)
  if (!res.ok) throw new Error('Error al obtener los tipos de insumo')
  return res.json()
}

export async function getTipoInsumo(id: number): Promise<TipoInsumo> {
  const res = await fetchWithAuth(`${API_URL}/tipos-insumo/${id}`)
  if (!res.ok) throw new Error('Error al obtener el tipo de insumo')
  return res.json()
}
