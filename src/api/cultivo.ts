import { fetchWithAuth } from './fetchWithAuth.ts';

const API_URL = import.meta.env.VITE_API_URL

export type Cultivo = {
  id: number
  tipo: string
  descripcion: string
  LoteCampañaId: number
}

export async function getCultivo(): Promise<Cultivo[]> {
  const res = await fetchWithAuth(`${API_URL}/cultivo`)
  if (!res.ok) throw new Error('Error al obtener cultivos')
  return res.json()
}

export async function createCultivo(data: Omit<Cultivo, 'id'>): Promise<Cultivo> {
  const res = await fetchWithAuth(`${API_URL}/cultivo`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error('Error al crear cultivo')
  return res.json()
}

export async function deleteCultivo(id: number): Promise<void> {
  const res = await fetchWithAuth(`${API_URL}/cultivo/${id}`, { method: 'DELETE' })
  if (!res.ok) throw new Error('Error al eliminar cultivo')
}