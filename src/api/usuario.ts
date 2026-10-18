import { fetchWithAuth } from './fetchWithAuth.ts';

const API_URL = import.meta.env.VITE_API_URL

export type Usuario = {
  id: number
  nombre: string
  apellido: string
  email: string
  telefono: string
  password: string
  fechaNacimiento: string
  direccion: string
  rolId: number
  //organizacion: number
}

export async function login(email: string, password: string): Promise<Usuario> {
  const res = await fetch(`${API_URL}/usuarios/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })
  if (!res.ok) throw new Error('Credenciales incorrectas')
  return res.json()
}

export async function getUsuario(): Promise<Usuario[]> {
  const res = await fetchWithAuth(`${API_URL}/usuarios`)
  if (!res.ok) throw new Error('Error al obtener usuarios')
  return res.json()
}

export async function createUsuario(data: Omit<Usuario, 'id'>): Promise<Usuario> {
  const res = await fetchWithAuth(`${API_URL}/usuarios`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.message)
  }
  return res.json()
}

export async function deleteUsuario(id: number): Promise<void> {
  const res = await fetchWithAuth(`${API_URL}/usuarios/${id}`, { method: 'DELETE' })
  if (!res.ok) throw new Error('Error al eliminar usuario')
}