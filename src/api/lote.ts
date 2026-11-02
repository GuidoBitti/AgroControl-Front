import { fetchWithAuth } from './fetchWithAuth.ts';
import type { Cultivo } from "./cultivo.ts"

const API_URL = import.meta.env.VITE_API_URL

export type Lote = {
  id: number
  numero: number
  latitud: number
  longitud: number
  hectareas: number
  descripcion: string
  Cultivo?: Cultivo
}

export type CreateLoteData = Pick<
  Lote,
  'numero' | 'latitud' | 'longitud' | 'hectareas' | 'descripcion'
>

export async function getLote(): Promise<Lote[]> {
  const res = await fetchWithAuth(`${API_URL}/lotes`)
  if (!res.ok) throw new Error('Error al obtener lotes')
  return res.json()
}

export async function createLote(data: CreateLoteData): Promise<Lote> {
  const res = await fetchWithAuth(
    `${API_URL}/lotes`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...data,
        tipo: '',
      }),
    }
  );

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

    throw new Error(`Error al crear lote (HTTP ${res.status})`)
  }

  return res.json();
}

export async function deleteLote(id: number): Promise<void> {
  const res = await fetchWithAuth(`${API_URL}/lotes/${id}`, { method: 'DELETE' })
  if (!res.ok) throw new Error('Error al eliminar lote')
}