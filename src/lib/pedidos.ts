import { apiFetch } from './api';
import type { Pedido } from '../types/Pedido';

export async function obtenerMisPedidos(): Promise<Pedido[]> {
  const respuesta = await apiFetch('/api/pedidos/mios');

  if (!respuesta.ok) {
    throw new Error(
      `No fue posible obtener los pedidos. Código ${respuesta.status}`,
    );
  }

  return respuesta.json() as Promise<Pedido[]>;
}