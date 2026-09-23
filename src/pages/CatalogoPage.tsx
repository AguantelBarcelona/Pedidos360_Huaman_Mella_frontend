import { useEffect, useState } from 'react';
import { obtenerProductos } from '../lib/productos';
import type { Producto } from '../types/Producto';

export default function CatalogoPage() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let activo = true;

    obtenerProductos()
      .then((datos) => {
        if (activo) {
          setProductos(datos);
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

    return () => {
      activo = false;
    };
  }, []);

  if (cargando) {
    return (
      <main style={{ padding: 32 }}>
        <p>Cargando catálogo...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main style={{ padding: 32 }}>
        <h1>Catálogo</h1>
        <p>{error}</p>
      </main>
    );
  }

  return (
    <main
      style={{
        padding: 32,
        fontFamily: 'system-ui',
        maxWidth: 1200,
        margin: '0 auto',
      }}
    >
      <h1>Catálogo de productos</h1>

      <p>
        Explora los productos disponibles en Pedidos360.
      </p>

      {productos.length === 0 ? (
        <p>No hay productos disponibles.</p>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns:
              'repeat(auto-fit, minmax(240px, 1fr))',
            gap: 20,
            marginTop: 24,
          }}
        >
          {productos.map((producto) => (
            <article
              key={producto.id}
              style={{
                border: '1px solid #ddd',
                borderRadius: 12,
                padding: 20,
              }}
            >
              <h2>{producto.modelo}</h2>

              <p>
                <strong>Marca:</strong> {producto.marca}
              </p>

              <p>
                <strong>Categoría:</strong>{' '}
                {producto.categoria}
              </p>

              <p>
                <strong>Talla:</strong> {producto.talla}
              </p>

              <p>
                <strong>Precio:</strong>{' '}
                {producto.precio.toLocaleString('es-CL', {
                  style: 'currency',
                  currency: 'CLP',
                })}
              </p>

              {producto.descripcion && (
                <p>{producto.descripcion}</p>
              )}
            </article>
          ))}
        </div>
      )}
    </main>
  );
}