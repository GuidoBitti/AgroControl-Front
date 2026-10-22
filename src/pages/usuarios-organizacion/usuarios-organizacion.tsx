import { useEffect, useState } from 'react';
import BackToMenu from '../../components/BackToMenu';
import { getRol, type Rol } from '../../api/rol';
import {
  createUsuario,
  deleteUsuario,
  getUsuario,
  updateUsuario,
  type Usuario,
} from '../../api/usuario';
import './usuarios-organizacion.css';

type FormValues = {
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  fechaNacimiento: string;
  direccion: string;
  password: string;
  rolId: string;
};

const emptyForm: FormValues = {
  nombre: '',
  apellido: '',
  email: '',
  telefono: '',
  fechaNacimiento: '',
  direccion: '',
  password: '',
  rolId: '',
};

function relationId(value: Usuario['organizacion']): number | undefined {
  if (typeof value === 'number') return value;
  return value?.id;
}

function roleId(value: Usuario['rol']): number | undefined {
  if (typeof value === 'string') return undefined;
  return value.id;
}

function roleName(value: Usuario['rol']): string {
  return typeof value === 'string' ? value : value.descripcion;
}

function UsuariosOrganizacion() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [roles, setRoles] = useState<Rol[]>([]);
  const [organizacionId, setOrganizacionId] = useState<number>();
  const [currentUserId, setCurrentUserId] = useState<number>();
  const [form, setForm] = useState<FormValues>(emptyForm);
  const [editingId, setEditingId] = useState<number>();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

  async function loadData() {
    try {
      const userId = Number(localStorage.getItem('userId'));
      if (!Number.isInteger(userId) || userId <= 0) {
        throw new Error('No se pudo identificar al usuario autenticado.');
      }
      const [allUsers, allRoles] = await Promise.all([getUsuario(), getRol()]);
      const currentUser = allUsers.find((usuario) => usuario.id === userId);
      if (!currentUser) throw new Error('No se encontraron los datos del usuario autenticado.');

      const orgId = relationId(currentUser.organizacion);
      if (!orgId) throw new Error('No se pudo identificar la organización del usuario.');

      setCurrentUserId(userId);
      setOrganizacionId(orgId);
      setIsAdmin(['administrador', 'admin'].includes(roleName(currentUser.rol).trim().toLowerCase()));
      setUsuarios(allUsers.filter((usuario) => relationId(usuario.organizacion) === orgId));
      setRoles(allRoles);
    } catch (loadError) {
      console.error(loadError);
      setError(loadError instanceof Error ? loadError.message : 'No se pudieron cargar los usuarios.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void Promise.resolve().then(loadData);
  }, []);

  function resetForm() {
    setForm(emptyForm);
    setEditingId(undefined);
  }

  function editUsuario(usuario: Usuario) {
    if (usuario.id === undefined) return;
    setEditingId(usuario.id);
    setForm({
      nombre: usuario.nombre,
      apellido: usuario.apellido,
      email: usuario.email,
      telefono: usuario.telefono,
      fechaNacimiento: usuario.fechaNacimiento.slice(0, 10),
      direccion: usuario.direccion,
      password: '',
      rolId: String(roleId(usuario.rol) ?? ''),
    });
    setNotice('');
    setError('');
  }

  async function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!organizacionId) return;
    setSaving(true);
    setError('');
    setNotice('');

    const rolSeleccionado = Number(form.rolId);
    if (!Number.isInteger(rolSeleccionado) || rolSeleccionado <= 0) {
      setSaving(false);
      setError('Seleccioná un rol válido.');
      return;
    }

    try {
      const userData = {
        nombre: form.nombre.trim(),
        apellido: form.apellido.trim(),
        email: form.email.trim(),
        telefono: form.telefono.trim(),
        fechaNacimiento: form.fechaNacimiento,
        direccion: form.direccion.trim(),
      };
      if (editingId !== undefined) {
        await updateUsuario(editingId, { ...userData, rol: { id: rolSeleccionado } });
        setNotice('Usuario actualizado correctamente.');
      } else {
        if (!form.password.trim()) {
          setError('La contraseña es obligatoria para crear un usuario.');
          setSaving(false);
          return;
        }
        await createUsuario({
          ...userData,
          password: form.password,
          rolId: rolSeleccionado,
          organizacion: organizacionId,
        });
        setNotice('Usuario creado correctamente.');
      }
      resetForm();
      await loadData();
    } catch (saveError) {
      console.error(saveError);
      setError(saveError instanceof Error ? saveError.message : 'No se pudo guardar el usuario.');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(usuario: Usuario) {
    if (usuario.id === undefined || usuario.id === currentUserId) return;
    if (!window.confirm(`¿Querés eliminar a ${usuario.nombre} ${usuario.apellido}?`)) return;

    setError('');
    setNotice('');
    try {
      await deleteUsuario(usuario.id);
      setUsuarios((current) => current.filter((item) => item.id !== usuario.id));
      setNotice('Usuario eliminado correctamente.');
    } catch (deleteError) {
      console.error(deleteError);
      setError(deleteError instanceof Error ? deleteError.message : 'No se pudo eliminar el usuario.');
    }
  }

  return (
    <main className="container usuarios-organizacion">
      <BackToMenu />
      <h1 className="title">USUARIOS ORGANIZACIÓN</h1>

      {loading && <p role="status">Cargando usuarios...</p>}
      {!loading && error && <p className="usuarios-feedback usuarios-error" role="alert">{error}</p>}
      {!loading && !error && !isAdmin && (
        <p className="usuarios-feedback usuarios-error" role="alert">
          Solo un administrador puede gestionar los usuarios de la organización.
        </p>
      )}

      {!loading && !error && isAdmin && (
        <>
          {notice && <p className="usuarios-feedback usuarios-success" role="status">{notice}</p>}
          {error && <p className="usuarios-feedback usuarios-error" role="alert">{error}</p>}

          <section className="usuarios-form-section">
            <h2>{editingId === undefined ? 'Agregar usuario' : 'Editar usuario'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="usuarios-form-grid">
                <label>
                  Nombre
                  <input value={form.nombre} onChange={(event) => setForm({ ...form, nombre: event.target.value })} required />
                </label>
                <label>
                  Apellido
                  <input value={form.apellido} onChange={(event) => setForm({ ...form, apellido: event.target.value })} required />
                </label>
                <label>
                  Email
                  <input type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} required />
                </label>
                <label>
                  Teléfono
                  <input type="tel" value={form.telefono} onChange={(event) => setForm({ ...form, telefono: event.target.value })} required />
                </label>
                <label>
                  Fecha de nacimiento
                  <input type="date" value={form.fechaNacimiento} onChange={(event) => setForm({ ...form, fechaNacimiento: event.target.value })} required />
                </label>
                <label>
                  Dirección
                  <input value={form.direccion} onChange={(event) => setForm({ ...form, direccion: event.target.value })} required />
                </label>
                {editingId === undefined && (
                  <label>
                    Contraseña
                    <input type="password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} minLength={8} required />
                  </label>
                )}
                <label>
                  Rol
                  <select
                    value={form.rolId}
                    onChange={(event) => setForm({ ...form, rolId: event.target.value })}
                    disabled={editingId === currentUserId}
                    required
                  >
                    <option value="">Seleccionar rol</option>
                    {roles.map((rol) => <option key={rol.id} value={rol.id}>{rol.descripcion}</option>)}
                  </select>
                </label>
              </div>
              <div className="usuarios-form-actions">
                <button type="submit" disabled={saving}>
                  {saving ? 'Guardando...' : editingId === undefined ? 'Crear usuario' : 'Guardar cambios'}
                </button>
                {editingId !== undefined && (
                  <button type="button" className="usuarios-secondary" onClick={resetForm} disabled={saving}>
                    Cancelar edición
                  </button>
                )}
              </div>
            </form>
          </section>

          <section className="usuarios-list-section">
            <h2>Usuarios de la organización</h2>
            {usuarios.length === 0 ? (
              <p>No hay usuarios para mostrar.</p>
            ) : (
              <div className="usuarios-table-wrapper">
                <table>
                  <thead>
                    <tr>
                      <th>Nombre</th>
                      <th>Email</th>
                      <th>Teléfono</th>
                      <th>Rol</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {usuarios.map((usuario) => (
                      <tr key={usuario.id}>
                        <td>{usuario.nombre} {usuario.apellido}</td>
                        <td>{usuario.email}</td>
                        <td>{usuario.telefono}</td>
                        <td>{roleName(usuario.rol)}</td>
                        <td className="usuarios-row-actions">
                          <button type="button" onClick={() => editUsuario(usuario)}>Editar</button>
                          <button
                            type="button"
                            className="usuarios-delete"
                            onClick={() => void handleDelete(usuario)}
                            disabled={usuario.id === currentUserId}
                            title={usuario.id === currentUserId ? 'No podés eliminar tu propio usuario.' : undefined}
                          >
                            Eliminar
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </>
      )}
    </main>
  );
}

export default UsuariosOrganizacion;
