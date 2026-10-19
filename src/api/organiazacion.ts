import { fetchWithAuth } from './fetchWithAuth.ts';
import { type Usuario } from './usuario.ts';

const API_URL = import.meta.env.VITE_API_URL

export type Organizacion = {
  id: number
  razonSocial: string
  cuit: string
  usuario: Usuario
}

export async function getOrganizacion(): Promise<Organizacion[]> {
  const res = await fetchWithAuth(`${API_URL}/organizaciones/:id`)
  if (!res.ok) throw new Error('Error al obtener organizaciones')
  return res.json()
}

export async function createOrganizacion(data: Omit<Omit<Organizacion, 'id'>,'usuario.id'>): Promise<Organizacion> {
  const res = await fetchWithAuth(`${API_URL}/organizaciones`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error('Error al crear organizacion')
  return res.json()
}