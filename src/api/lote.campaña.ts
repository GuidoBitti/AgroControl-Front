import { fetchWithAuth } from './fetchWithAuth.ts';

const API_URL = import.meta.env.VITE_API_URL

export type LoteCampaña = {
  id: number
  loteId: number
  campañaId: number
  cultivoId: number
}

export async function getLoteCampaña(): Promise<LoteCampaña[]> {
  const res = await fetchWithAuth(`${API_URL}/lote-campana`)
  if (!res.ok) throw new Error('Error al obtener lotes campaña')
  return res.json()
}

export async function createLoteCampaña(data: Omit<LoteCampaña, 'id'>): Promise<LoteCampaña> {
  const res = await fetchWithAuth(`${API_URL}/lote-campana`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error('Error al crear lote de campaña')
  return res.json()
}

export async function deleteLoteCampaña(id: number): Promise<void> {
  const res = await fetchWithAuth(`${API_URL}/lote-campana/${id}`, { method: 'DELETE' })
  if (!res.ok) throw new Error('Error al eliminar lote de campaña')
}