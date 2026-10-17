const API_URL = import.meta.env.VITE_API_URL

import type { LoteCampania } from './lote-campania.ts'
import type { Organizacion } from './organiazacion.ts'


export type Campania = {
  id: number
  fechaInicio: string
  fechaFin: string
  descripcion: string
  LoteCampanias: LoteCampania[]
  organizacion: Organizacion[]
}

// UNA campaña
export async function getCampania(id: number): Promise<Campania> {
  const res = await fetch(`${API_URL}/campanias/${id}`)
  if (!res.ok) throw new Error('Error al obtener la campaña')
  return res.json()
}

// TODAS las campañas
export async function getCampanias(): Promise<Campania[]> {
  const res = await fetch(`${API_URL}/campanias`)
  if (!res.ok) throw new Error('Error al obtener las campañas')
  return res.json()
}

export async function createCampania(data: Omit<Campania, 'id'>): Promise<Campania> {
  const res = await fetch(`${API_URL}/campanias`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error('Error al crear la campania')
  return res.json()
}

export async function deleteCampania(id: number): Promise<void> {
  const res = await fetch(`${API_URL}/campanias/${id}`, { method: 'DELETE' })
  if (!res.ok) throw new Error('Error al eliminar la campania')
}