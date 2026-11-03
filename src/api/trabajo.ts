import { fetchWithAuth } from './fetchWithAuth.ts';

const API_URL = import.meta.env.VITE_API_URL

export type Trabajo = {
  id: number
  descripcion: string
  fechaInicio: string
  fechaFin: string
  cantidadInsumo: number
  lote?: number | {id:number}
  usuario?: number | {id:number}
  organizacion?: number | {id: number}
  insumo?: number | {id: number}
}

async function throwTrabajoError(
  res: Response,
  fallbackMessage: string,
): Promise<never> {
  const responseBody = await res.text()
  if (responseBody) {
    let errorBody: unknown
    try {
      errorBody = JSON.parse(responseBody)
    } catch {
      errorBody = undefined
    }

    if (
      typeof errorBody === 'object' &&
      errorBody !== null &&
      'message' in errorBody &&
      typeof errorBody.message === 'string'
    ) {
      throw new Error(errorBody.message)
    }
  }
  throw new Error(`${fallbackMessage} (HTTP ${res.status})`)
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
  if (!res.ok) await throwTrabajoError(res, 'Error al crear trabajo')
  return res.json()
}

export async function updateTrabajo(
  id: number,
  data: Partial<Pick<Trabajo, 'descripcion' | 'fechaInicio' | 'fechaFin' | 'usuario' | 'insumo' | 'lote' | 'cantidadInsumo' | 'organizacion'>>,
): Promise<Trabajo> {
  const res = await fetchWithAuth(`${API_URL}/trabajo/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) await throwTrabajoError(res, 'Error al actualizar trabajo')
  return res.json()
}

export async function deleteTrabajo(id: number): Promise<void> {
  const res = await fetchWithAuth(`${API_URL}/trabajo/${id}`, { method: 'DELETE' })
  if (!res.ok) throw new Error('Error al eliminar trabajo')
}