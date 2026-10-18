import { fetchWithAuth } from './fetchWithAuth.ts';

const API_URL = import.meta.env.VITE_API_URL

export type Campaña = {
  id: number
  fechaInicio: number
  fechaFin: number
  descripcion: string
  LoteCampañaId: number
  organizacionId: number
}

export async function getCampaña(): Promise<Campaña[]> {
  const res = await fetchWithAuth(`${API_URL}/campanias`)
  if (!res.ok) throw new Error('Error al obtener campañas')
  return res.json()
}

export async function createCampaña(data: Omit<Campaña, 'id'>): Promise<Campaña> {
  const res = await fetchWithAuth(`${API_URL}/campanias`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error('Error al crear campaña')
  return res.json()
}

export async function deleteCampaña(id: number): Promise<void> {
  const res = await fetchWithAuth(`${API_URL}/campanias/${id}`, { method: 'DELETE' })
  if (!res.ok) throw new Error('Error al eliminar campaña')
}