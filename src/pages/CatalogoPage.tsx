import { useEffect, useState } from 'react';
import { useAuthenticator } from '@aws-amplify/ui-react';
import { useNavigate } from 'react-router-dom';

import { obtenerProductos } from '../lib/productos';
import { crearPedido } from '../lib/pedidos';
import {
  getAuthInfo,
  type AuthInfo,
} from '../lib/auth';

import type { Producto } from '../types/Producto';

export default function CatalogoPage() {
  const { user } = useAuthenticator((context) => [
    context.user,
  ]);

  const navigate = useNavigate();

  const [productos, setProductos] = useState<Producto[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  const [authInfo, setAuthInfo] =
    useState<AuthInfo | null>(null);

  const [cantidades, setCantidades] = useState<
    Record<number, number>
  >({});

  const [productoProcesando, setProductoProcesando] =
    useState<number | null>(null);

  const [mensaje, setMensaje] = useState('');
  const [errorPedido, setErrorPedido] = useState('');

  const email = user?.signInDetails?.loginId;

  useEffect(() => {
    let activo = true;

    obtenerProductos()
      .then((datos) => {
        if (activo) {
          setProductos(datos);

          const cantidadesIniciales =
            datos.reduce<Record<number, number>>(
              (acumulador, producto) => {
                acumulador[producto.id] = 1;
                return acumulador;
              },
              {},
            );

          setCantidades(cantidadesIniciales);
        }
      })
      .catch((err: Error) => {
        if (activo) {
          setError(err.message);
        }
      })
      .finally(() => {
        if (activo) {
          setCargando(false);
        }
      });

    getAuthInfo()
      .then((info) => {
        if (activo) {
          setAuthInfo(info);
        }
      })
      .catch(() => {
        if (activo) {
          setAuthInfo(null);
        }
      });

    return () => {
      activo = false;
    };
  }, []);

  function actualizarCantidad(
    productoId: number,
    cantidad: number,
  ) {
    const cantidadValida =
      Number.isFinite(cantidad) && cantidad >= 1
        ? Math.floor(cantidad)
        : 1;

    setCantidades((actuales) => ({
      ...actuales,
      [productoId]: cantidadValida,
    }));
  }

  async function realizarPedido(producto: Producto) {
    if (!email) {
      setErrorPedido(
        'No fue posible obtener el correo del usuario autenticado.',
      );
      return;
    }

    const cantidad = cantidades[producto.id] ?? 1;

    setProductoProcesando(producto.id);
    setMensaje('');
    setErrorPedido('');

    try {
      const pedido = await crearPedido({
        clienteEmail: email,
        productoId: producto.id,
        cantidad,
      });

      setMensaje(
        `Pedido #${pedido.id} creado correctamente. Total: ${pedido.total.toLocaleString(
          'es-CL',
          {
            style: 'currency',
            currency: 'CLP',
            maximumFractionDigits: 0,
          },
        )}.`,
      );
    } catch (err) {
      setErrorPedido(
        err instanceof Error
          ? err.message
          : 'Ocurrió un error al crear el pedido.',
      );
    } finally {
      setProductoProcesando(null);
    }
  }

  const formatoPrecio = new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    maximumFractionDigits: 0,
  });

  if (cargando) {
    return (
      <main
        style={{
          padding: 32,
          maxWidth: 1200,
          margin: '0 auto',
          fontFamily: 'system-ui',
        }}
      >
        <p>Cargando catálogo...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main
        style={{
          padding: 32,
          maxWidth: 1200,
          margin: '0 auto',
          fontFamily: 'system-ui',
        }}
      >
        <h1>Catálogo</h1>

        <div
          style={{
            padding: 20,
            border: '1px solid #fecaca',
            background: '#fef2f2',
            color: '#991b1b',
            borderRadius: 10,
          }}
        >
          {error}
        </div>
      </main>
    );
  }

  return (
    <main
      style={{
        padding: '32px 24px',
        fontFamily: 'system-ui',
        maxWidth: 1200,
        margin: '0 auto',
      }}
    >
      <header style={{ marginBottom: 28 }}>
        <h1 style={{ marginBottom: 8 }}>
          Catálogo de productos
        </h1>

        <p
          style={{
            margin: 0,
            color: '#4b5563',
          }}
        >
          Explora los productos disponibles en Pedidos360.
        </p>
      </header>

      {mensaje && (
        <div
          style={{
            padding: 20,
            marginBottom: 24,
            borderRadius: 10,
            border: '1px solid #a7f3d0',
            background: '#ecfdf5',
            color: '#065f46',
          }}
        >
          <strong>Pedido realizado correctamente.</strong>

          <p style={{ margin: '8px 0 16px' }}>
            {mensaje}
          </p>

          <button
            onClick={() => navigate('/cliente')}
            style={{
              cursor: 'pointer',
              padding: '8px 14px',
            }}
          >
            Ver mis pedidos
          </button>
        </div>
      )}

      {errorPedido && (
        <div
          style={{
            padding: 20,
            marginBottom: 24,
            borderRadius: 10,
            border: '1px solid #fecaca',
            background: '#fef2f2',
            color: '#991b1b',
          }}
        >
          <strong>
            No se pudo realizar el pedido.
          </strong>

          <p style={{ marginBottom: 0 }}>
            {errorPedido}
          </p>
        </div>
      )}

      {productos.length === 0 ? (
        <div
          style={{
            padding: 32,
            borderRadius: 10,
            border: '1px solid #e5e7eb',
            background: '#f9fafb',
          }}
        >
          No hay productos disponibles.
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns:
              'repeat(auto-fit, minmax(260px, 1fr))',
            gap: 20,
          }}
        >
          {productos.map((producto) => {
            const procesando =
              productoProcesando === producto.id;

            return (
              <article
                key={producto.id}
                style={{
                  border: '1px solid #e5e7eb',
                  borderRadius: 12,
                  padding: 24,
                  background: '#ffffff',
                  boxShadow:
                    '0 1px 3px rgba(0, 0, 0, 0.08)',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      color: '#6b7280',
                      fontSize: 13,
                      marginBottom: 6,
                    }}
                  >
                    {producto.categoria}
                  </div>

                  <h2
                    style={{
                      marginTop: 0,
                      marginBottom: 16,
                    }}
                  >
                    {producto.modelo}
                  </h2>

                  <p>
                    <strong>Marca:</strong>{' '}
                    {producto.marca}
                  </p>

                  <p>
                    <strong>Talla:</strong>{' '}
                    {producto.talla}
                  </p>

                  {producto.descripcion && (
                    <p
                      style={{
                        color: '#4b5563',
                      }}
                    >
                      {producto.descripcion}
                    </p>
                  )}

                  <p
                    style={{
                      fontSize: 22,
                      fontWeight: 700,
                      marginTop: 20,
                    }}
                  >
                    {formatoPrecio.format(
                      producto.precio,
                    )}
                  </p>
                </div>

                {authInfo?.isCliente && (
                  <div
                    style={{
                      marginTop: 20,
                      paddingTop: 20,
                      borderTop: '1px solid #e5e7eb',
                    }}
                  >
                    <label
                      htmlFor={`cantidad-${producto.id}`}
                      style={{
                        display: 'block',
                        fontWeight: 600,
                        marginBottom: 8,
                      }}
                    >
                      Cantidad
                    </label>

                    <input
                      id={`cantidad-${producto.id}`}
                      type="number"
                      min={1}
                      step={1}
                      value={
                        cantidades[producto.id] ?? 1
                      }
                      disabled={procesando}
                      onChange={(event) =>
                        actualizarCantidad(
                          producto.id,
                          Number(event.target.value),
                        )
                      }
                      style={{
                        width: 90,
                        padding: '8px 10px',
                        marginBottom: 14,
                        border:
                          '1px solid #d1d5db',
                        borderRadius: 6,
                      }}
                    />

                    <button
                      onClick={() =>
                        realizarPedido(producto)
                      }
                      disabled={procesando}
                      style={{
                        display: 'block',
                        width: '100%',
                        padding: '10px 14px',
                        cursor: procesando
                          ? 'not-allowed'
                          : 'pointer',
                        fontWeight: 700,
                      }}
                    >
                      {procesando
                        ? 'Procesando...'
                        : 'Realizar pedido'}
                    </button>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      )}
    </main>
  );
}