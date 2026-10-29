import { fetchWithAuth } from './fetchWithAuth.ts';

const API_URL = import.meta.env.VITE_API_URL

export type Rol = {
  id?: number
  descripcion: string
}

export async function getRol(): Promise<Rol[]> {
  const res = await fetchWithAuth(`${API_URL}/rol`)
  if (!res.ok) throw new Error('Error al obtener roles')
  return res.json()
}

export async function createRol(data: Omit<Rol, 'id'>): Promise<Rol> {
  const res = await fetchWithAuth(`${API_URL}/rol`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error('Error al crear rol')
  return res.json()
}

export async function updateRol(
  id: number,
  data: Partial<Pick<Rol, 'descripcion'>> & {
    rol?: { id: number }
  },
): Promise<Rol> {
  const res = await fetchWithAuth(`${API_URL}/rols/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) {
    const error = await res.json() as { message?: string }
    throw new Error(error.message ?? 'Error al actualizar Rol')
  }
  return res.json()
}

export async function deleteRol(id: number): Promise<void> {
  const res = await fetchWithAuth(`${API_URL}/rols/${id}`, { method: 'DELETE' })
  if (!res.ok) throw new Error('Error al eliminar Rol')
}