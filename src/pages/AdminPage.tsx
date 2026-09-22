export default function AdminPage() {
  return (
    <div style={{ padding: 24, fontFamily: 'system-ui' }}>
      <h1>Panel de Administración</h1>

      <p>
        Esta sección solo puede ser utilizada por usuarios
        pertenecientes al grupo ADMIN.
      </p>
    </div>
  );
}