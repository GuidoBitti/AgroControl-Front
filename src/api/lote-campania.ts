import { fetchWithAuth } from './fetchWithAuth.ts'
import type { Campania } from './campania.ts'
import type { Lote } from './lote.ts'

const API_URL = import.meta.env.VITE_API_URL

export type LoteCampania = {
  id: number
  Lote: Lote
  Campania: Campania
}

export type CreateLoteCampaniaData = {
  loteId: number
  campaniaId: number
}

export async function getLoteCampania(): Promise<LoteCampania[]> {
  const res = await fetchWithAuth(`${API_URL}/lote-campania`)
  if (!res.ok) throw new Error('Error al obtener los lotes de campaña')
  return res.json()
}

export async function createLoteCampania(data: CreateLoteCampaniaData): Promise<LoteCampania> {
  const res = await fetchWithAuth(`${API_URL}/lote-campania`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) {
    if (res.status === 409) {
      throw new Error('Esta campaña ya está asignada a ese lote.')
    }

    throw new Error(`No se pudo asignar la campaña al lote (HTTP ${res.status}).`)
  }
  return res.json()
}

export async function deleteLoteCampania(id: number): Promise<void> {
  const res = await fetchWithAuth(`${API_URL}/lote-campania/${id}`, { method: 'DELETE' })
  if (!res.ok) throw new Error('Error al eliminar el lote de campaña')
}