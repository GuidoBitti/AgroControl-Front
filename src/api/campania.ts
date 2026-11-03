import { fetchWithAuth } from './fetchWithAuth.ts'
import type { LoteCampania } from './lote-campania.ts'
import type { Organizacion } from './organiazacion.ts'

const API_URL = import.meta.env.VITE_API_URL

export type Campania = {
  id: number
  fechaInicio: string
  fechaFin: string
  descripcion: string
  LoteCampanias: LoteCampania[]
  organizacion?: number | Organizacion | Organizacion[] | null
}

export type CreateCampaniaData = {
  fechaInicio: string
  fechaFin: string
  descripcion: string
  organizacion: number
}

// UNA campaña
export async function getCampania(id: number): Promise<Campania> {
  const res = await fetchWithAuth(`${API_URL}/campanias/${id}`)
  if (!res.ok) throw new Error('Error al obtener la campaña')
  return res.json()
}

export async function getCampaniaActual(): Promise<Campania> {
  const res = await fetchWithAuth(`${API_URL}/campanias/actual`)
  if (!res.ok) {
    const errorBody: unknown = await res.json()
    if (
      typeof errorBody === 'object' &&
      errorBody !== null &&
      'message' in errorBody &&
      typeof errorBody.message === 'string'
    ) {
      throw new Error(errorBody.message)
    }

    throw new Error(`No se pudo obtener la campaña vigente (HTTP ${res.status}).`)
  }
  return res.json()
}

// TODAS las campañas
export async function getCampanias(): Promise<Campania[]> {
  const res = await fetchWithAuth(`${API_URL}/campanias`)
  if (!res.ok) throw new Error('Error al obtener las campañas')
  return res.json()
}

export async function createCampania(data: CreateCampaniaData): Promise<Campania> {
  const res = await fetchWithAuth(`${API_URL}/campanias`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) {
    if (res.status === 409) {
      throw new Error('La campaña se superpone con otra campaña de tu organización.')
    }

    const errorBody: unknown = await res.json()
    if (
      typeof errorBody === 'object' &&
      errorBody !== null &&
      'message' in errorBody &&
      typeof errorBody.message === 'string'
    ) {
      throw new Error(errorBody.message)
    }

    throw new Error(`No se pudo crear la campaña (HTTP ${res.status}).`)
  }
  return res.json()
}

export async function deleteCampania(id: number): Promise<void> {
  const res = await fetchWithAuth(`${API_URL}/campanias/${id}`, { method: 'DELETE' })
  if (!res.ok) throw new Error('Error al eliminar la campania')
}