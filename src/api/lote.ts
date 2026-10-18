import { fetchWithAuth } from './fetchWithAuth.ts';

const API_URL = import.meta.env.VITE_API_URL

export type Lote = {
  id: number;
  numero: number;
  tipo: string;
  latitud: number;
  longitud: number;
  hectareas: number;
  descripcion: string;
}
export async function getLote(): Promise<Lote[]> {
  const res = await fetchWithAuth(`${API_URL}/lotes`)
  if (!res.ok) throw new Error('Error al obtener lotes')
  return res.json()
}

export async function createLote(data: Omit<Lote, 'id'>): Promise<Lote> {
  const res = await fetchWithAuth(
    `${API_URL}/lotes`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    }
  );

  if (!res.ok) {
    throw new Error('Error al crear lote');
  }

  return res.json();
}

export async function deleteLote(id: number): Promise<void> {
  const res = await fetchWithAuth(`${API_URL}/lotes/${id}`, { method: 'DELETE' })
  if (!res.ok) throw new Error('Error al eliminar lote')
}