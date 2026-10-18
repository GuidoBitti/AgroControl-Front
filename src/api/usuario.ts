import { fetchWithAuth } from "./fetchWithAuth"
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

type LoginUserFields = Partial<Pick<Usuario, 'id' | 'nombre' | 'apellido' | 'email'>>

export type LoginResponse = {
  token: string
  id?: number
  nombre?: string
  apellido?: string
  email?: string
  usuario?: LoginUserFields
  user?: LoginUserFields
  data?: LoginUserFields & {
    usuario?: LoginUserFields
    user?: LoginUserFields
  }
}

export async function login(email: string, password: string): Promise<LoginResponse> {
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

export async function getUsuarioDesdeLogin(
  data: LoginResponse,
  email: string,
): Promise<Pick<Usuario, 'id' | 'nombre' | 'apellido'>> {
  const user = data.usuario ?? data.user ?? data.data?.usuario ?? data.data?.user ?? data.data ?? data
  const userEmail = user.email ?? data.email ?? email

  if (user.id !== undefined && user.nombre && user.apellido) {
    return {
      id: user.id,
      nombre: user.nombre.trim(),
      apellido: user.apellido.trim(),
    }
  }

  const usuarios = await getUsuario()
  const usuario = usuarios.find((item) => item.email.toLowerCase() === userEmail.toLowerCase())
  if (!usuario) throw new Error('No se encontraron los datos del usuario autenticado')
  return usuario
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