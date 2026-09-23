import { useEffect, useState } from 'react';

import { obtenerMisPedidos } from '../lib/pedidos';
import type { Pedido } from '../types/Pedido';

export default function ClientePage() {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let activo = true;

    async function cargarPedidos() {
      try {
        setCargando(true);
        setError('');

        const datos = await obtenerMisPedidos();

        if (activo) {
          setPedidos(datos);
        }
      } catch (err) {
        if (activo) {
          setError(
            err instanceof Error
              ? err.message
              : 'Ocurrió un error al cargar los pedidos.',
          );
        }
      } finally {
        if (activo) {
          setCargando(false);
        }
      }
    }

    cargarPedidos();

    return () => {
      activo = false;
    };
  }, []);

  const formatoPrecio = new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    maximumFractionDigits: 0,
  });

  const formatoFecha = new Intl.DateTimeFormat('es-CL', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });

  return (
    <main
      style={{
        maxWidth: 1100,
        margin: '0 auto',
        padding: '32px 24px',
        fontFamily: 'system-ui',
      }}
    >
      <header style={{ marginBottom: 32 }}>
        <h1 style={{ marginBottom: 8 }}>
          Mi cuenta
        </h1>

        <p
          style={{
            margin: 0,
            color: '#4b5563',
          }}
        >
          Consulta los pedidos asociados a tu cuenta.
        </p>
      </header>

      <section>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 16,
            marginBottom: 20,
          }}
        >
          <h2 style={{ margin: 0 }}>
            Mis pedidos
          </h2>

          {!cargando && !error && (
            <span
              style={{
                color: '#6b7280',
                fontSize: 14,
              }}
            >
              {pedidos.length}{' '}
              {pedidos.length === 1
                ? 'pedido'
                : 'pedidos'}
            </span>
          )}
        </div>

        {cargando && (
          <div
            style={{
              padding: 24,
              border: '1px solid #e5e7eb',
              borderRadius: 10,
              background: '#ffffff',
            }}
          >
            Cargando pedidos...
          </div>
        )}

        {!cargando && error && (
          <div
            style={{
              padding: 20,
              border: '1px solid #fecaca',
              borderRadius: 10,
              background: '#fef2f2',
              color: '#991b1b',
            }}
          >
            <strong>
              No se pudieron cargar los pedidos.
            </strong>

            <p style={{ marginBottom: 0 }}>
              {error}
            </p>
          </div>
        )}

        {!cargando &&
          !error &&
          pedidos.length === 0 && (
            <div
              style={{
                padding: 32,
                textAlign: 'center',
                border: '1px solid #e5e7eb',
                borderRadius: 10,
                background: '#f9fafb',
              }}
            >
              <h3 style={{ marginTop: 0 }}>
                Aún no tienes pedidos
              </h3>

              <p
                style={{
                  marginBottom: 0,
                  color: '#6b7280',
                }}
              >
                Los pedidos que realices aparecerán
                en esta sección.
              </p>
            </div>
          )}

        {!cargando &&
          !error &&
          pedidos.length > 0 && (
            <div
              style={{
                display: 'grid',
                gap: 16,
              }}
            >
              {pedidos.map((pedido) => (
                <article
                  key={pedido.id}
                  style={{
                    padding: 24,
                    border: '1px solid #e5e7eb',
                    borderRadius: 12,
                    background: '#ffffff',
                    boxShadow:
                      '0 1px 3px rgba(0, 0, 0, 0.08)',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent:
                        'space-between',
                      alignItems: 'flex-start',
                      gap: 16,
                      flexWrap: 'wrap',
                      marginBottom: 20,
                    }}
                  >
                    <div>
                      <h3
                        style={{
                          margin: '0 0 6px',
                        }}
                      >
                        Pedido #{pedido.id}
                      </h3>

                      <span
                        style={{
                          color: '#6b7280',
                          fontSize: 14,
                        }}
                      >
                        {formatoFecha.format(
                          new Date(
                            pedido.fechaCreacion,
                          ),
                        )}
                      </span>
                    </div>

                    <span
                      style={{
                        padding: '6px 12px',
                        borderRadius: 999,
                        background: '#ecfdf5',
                        color: '#047857',
                        fontWeight: 700,
                        fontSize: 13,
                      }}
                    >
                      {pedido.estado}
                    </span>
                  </div>

                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns:
                        'repeat(auto-fit, minmax(160px, 1fr))',
                      gap: 20,
                    }}
                  >
                    <div>
                      <div
                        style={{
                          color: '#6b7280',
                          fontSize: 13,
                          marginBottom: 4,
                        }}
                      >
                        Producto
                      </div>

                      <strong>
                        Producto #{pedido.productoId}
                      </strong>
                    </div>

                    <div>
                      <div
                        style={{
                          color: '#6b7280',
                          fontSize: 13,
                          marginBottom: 4,
                        }}
                      >
                        Cantidad
                      </div>

                      <strong>
                        {pedido.cantidad}
                      </strong>
                    </div>

                    <div>
                      <div
                        style={{
                          color: '#6b7280',
                          fontSize: 13,
                          marginBottom: 4,
                        }}
                      >
                        Precio unitario
                      </div>

                      <strong>
                        {formatoPrecio.format(
                          pedido.precioUnitario,
                        )}
                      </strong>
                    </div>

                    <div>
                      <div
                        style={{
                          color: '#6b7280',
                          fontSize: 13,
                          marginBottom: 4,
                        }}
                      >
                        Total
                      </div>

                      <strong
                        style={{
                          fontSize: 18,
                        }}
                      >
                        {formatoPrecio.format(
                          pedido.total,
                        )}
                      </strong>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
      </section>
    </main>
  );
}