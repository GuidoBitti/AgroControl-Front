import { fetchWithAuth } from './fetchWithAuth';
import type { TipoInsumo } from './tipo-insumo.ts';

const API_URL = import.meta.env.VITE_API_URL

export type Insumo = {
  id: number
  nombre: string
  stock: number
  tipoInsumo: number | TipoInsumo
  descripcion: string
  organizacion?: number
}

export type CreateInsumoData = {
  nombre: string
  stock: number
  tipoInsumoId: number
  descripcion: string
}

export function getTipoInsumoId(insumo: Insumo): number {
  return typeof insumo.tipoInsumo === 'number'
    ? insumo.tipoInsumo
    : insumo.tipoInsumo.id
}

export function getTipoInsumoNombre(insumo: Insumo): string {
  return typeof insumo.tipoInsumo === 'number'
    ? String(insumo.tipoInsumo)
    : insumo.tipoInsumo.nombre
}

export async function getInsumo(): Promise<Insumo[]> {
  const res = await fetchWithAuth(`${API_URL}/insumos`)
  if (!res.ok) throw new Error('Error al obtener insumos')
  return res.json()
}

export async function createInsumo(data: CreateInsumoData): Promise<Insumo> {
  const res = await fetchWithAuth(`${API_URL}/insumos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error('Error al crear insumo')
  return res.json()
}

export async function updateInsumo(
  id: number,
  data: Partial<CreateInsumoData>,
): Promise<Insumo> {
  const res = await fetchWithAuth(`${API_URL}/insumos/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error('Error al actualizar insumo')
  return res.json()
}

export async function deleteInsumo(id: number): Promise<void> {
  const res = await fetchWithAuth(`${API_URL}/insumos/${id}`, { method: 'DELETE' })
  if (!res.ok) throw new Error('Error al eliminar insumo')
}