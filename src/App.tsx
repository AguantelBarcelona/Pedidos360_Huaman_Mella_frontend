import { useState } from 'react';
import { Authenticator } from '@aws-amplify/ui-react';
import { fetchAuthSession } from 'aws-amplify/auth';
import { apiFetch } from './lib/api';

export default function App() {
  return (
    <Authenticator loginMechanisms={['email']}>
      {({ signOut, user }) => <Panel signOut={signOut} email={user?.signInDetails?.loginId} />}
    </Authenticator>
  );
}

function Panel({ signOut, email }: { signOut?: () => void; email?: string }) {
  const [claims, setClaims] = useState<Record<string, unknown> | null>(null);
  const [resultado, setResultado] = useState<string>('');

  async function verClaims() {
    const session = await fetchAuthSession();
    setClaims(session.tokens?.accessToken?.payload ?? null);
  }

  async function probar(ruta: string, method = 'GET') {
    setResultado('Llamando...');
    try {
      const r = await apiFetch(ruta, { method });
      const texto = await r.text();
      setResultado(`${method} ${ruta} -> ${r.status}\n${texto.slice(0, 500)}`);
    } catch (e) {
      setResultado(`Error: ${(e as Error).message}`);
    }
  }

  return (
    <div style={{ padding: 24, fontFamily: 'system-ui', maxWidth: 900 }}>
      <h1>Pedidos360 - prueba de integracion</h1>
      <p>Sesion de: {email}</p>
      <button onClick={signOut}>Cerrar sesion</button>

      <h2>Claims del access token</h2>
      <button onClick={verClaims}>Ver claims</button>
      {claims && (
        <pre style={{ background: '#f4f4f4', padding: 12, overflow: 'auto' }}>
          {JSON.stringify(claims, null, 2)}
        </pre>
      )}

      <h2>Llamadas al API Gateway</h2>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <button onClick={() => probar('/api/pedidos')}>GET pedidos</button>
        <button onClick={() => probar('/api/productos')}>GET productos</button>
        <button onClick={() => probar('/api/inventario')}>GET inventario</button>
        <button onClick={() => probar('/api/productos', 'POST')}>POST productos (solo ADMIN)</button>
      </div>
      <pre style={{ background: '#f4f4f4', padding: 12, whiteSpace: 'pre-wrap' }}>{resultado}</pre>
    </div>
  );
}