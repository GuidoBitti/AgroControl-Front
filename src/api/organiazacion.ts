import type { Usuario } from "./usuario.ts"

const API_URL = import.meta.env.VITE_API_URL

export type Organizacion = {
  id: number
  razonSocial: string
  cuit: string
  usuario: number
}

export async function getOrganizacion(): Promise<Organizacion[]> {
  const res = await fetch(`${API_URL}/organizacion`)
  if (!res.ok) throw new Error('Error al obtener organizaciones')
  return res.json()
}

export async function createOrganizacion(data: Omit<Organizacion, 'id'>): Promise<Organizacion> {
  const res = await fetch(`${API_URL}/organizacion`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error('Error al crear organizacion')
  return res.json()
}

export async function deleteOrganizacion(id: number): Promise<void> {
  const res = await fetch(`${API_URL}/organizacion/${id}`, { method: 'DELETE' })
  if (!res.ok) throw new Error('Error al eliminar organizacion')
}