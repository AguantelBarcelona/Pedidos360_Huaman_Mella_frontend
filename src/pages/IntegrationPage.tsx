import { useState } from 'react';
import { useAuthenticator } from '@aws-amplify/ui-react';
import { fetchAuthSession } from 'aws-amplify/auth';
import { apiFetch } from '../lib/api';

export default function IntegrationPage() {
  const { signOut, user } = useAuthenticator((context) => [
    context.user,
  ]);

  const [claims, setClaims] =
    useState<Record<string, unknown> | null>(null);

  const [resultado, setResultado] = useState('');

  const email = user?.signInDetails?.loginId;

  async function verClaims() {
    const session = await fetchAuthSession();

    setClaims(
      (session.tokens?.accessToken?.payload as Record<
        string,
        unknown
      >) ?? null,
    );
  }

  async function probar(
    ruta: string,
    method = 'GET',
  ) {
    setResultado('Llamando...');

    try {
      const respuesta = await apiFetch(ruta, {
        method,
      });

      const texto = await respuesta.text();

      setResultado(
        `${method} ${ruta} -> ${respuesta.status}\n${texto.slice(
          0,
          500,
        )}`,
      );
    } catch (error) {
      setResultado(
        `Error: ${(error as Error).message}`,
      );
    }
  }

  return (
    <div
      style={{
        padding: 24,
        fontFamily: 'system-ui',
        maxWidth: 900,
      }}
    >
      <h1>Pedidos360 - prueba de integración</h1>

      <p>Sesión de: {email}</p>

      <button onClick={signOut}>
        Cerrar sesión
      </button>

      <h2>Claims del access token</h2>

      <button onClick={verClaims}>
        Ver claims
      </button>

      {claims && (
        <pre
          style={{
            background: '#f4f4f4',
            padding: 12,
            overflow: 'auto',
          }}
        >
          {JSON.stringify(claims, null, 2)}
        </pre>
      )}

      <h2>Llamadas al API Gateway</h2>

      <div
        style={{
          display: 'flex',
          gap: 8,
          flexWrap: 'wrap',
        }}
      >
        <button
          onClick={() => probar('/api/pedidos')}
        >
          GET pedidos
        </button>

        <button
          onClick={() => probar('/api/pedidos/mios')}
        >
          GET mis pedidos
        </button>

        <button
          onClick={() => probar('/api/productos')}
        >
          GET productos
        </button>

        <button
          onClick={() => probar('/api/inventario')}
        >
          GET inventario
        </button>

        <button
          onClick={() =>
            probar('/api/productos', 'POST')
          }
        >
          POST productos (solo ADMIN)
        </button>
      </div>

      <pre
        style={{
          background: '#f4f4f4',
          padding: 12,
          whiteSpace: 'pre-wrap',
        }}
      >
        {resultado}
      </pre>
    </div>
  );
}