import { useEffect, useState } from 'react';
import BackToMenu from '../../components/BackToMenu';
import { type Usuario, getUsuario } from '../../api/usuario';
import {
  getRol,
  deleteRol,
  createRol,
  updateRol,
  type Rol,
} from '../../api/rol';
import './rol.css';

type FormValues = {
  descripcion: string;
};

const emptyForm: FormValues = {
  descripcion: '',
};

function Rols() {
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [organizacionId, setOrganizacionId] = useState<number | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [Rols, setRols] = useState<Rol[]>([]);
  const [form, setForm] = useState<FormValues>(emptyForm);
  const [editingId, setEditingId] = useState<number>();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  async function loadRols() {
    try {
      const data = await getRol();
      setRols(data);
    } catch (loadError) {
      console.error(loadError);
      setError(
        loadError instanceof Error
          ? loadError.message
          : 'No se pudieron cargar los Rols',
      );
    } finally {
      setLoading(false);
    }
  }

  type RolRelation =
    | number
    | string
    | { id?: number; descripcion?: string }
    | null
    | undefined;

  function roleName(value: RolRelation, roles: Rol[]): string {
    if (typeof value === 'string') return value;
    if (typeof value === 'number') {
      return roles.find((r) => r.id === value)?.descripcion ?? '';
    }
    if (value?.descripcion) return value.descripcion;
    return roles.find((r) => r.id === value?.id)?.descripcion ?? '';
  }

  function relationId(value: number | { id?: number } | null | undefined) {
    if (typeof value === 'number') return value;
    return value?.id;
  }

  async function loadData() {
    try {
      const userId = Number(localStorage.getItem('userId'));
      if (!Number.isInteger(userId) || userId <= 0) {
        throw new Error('No se pudo identificar al usuario autenticado.');
      }
      const [allUsers, allRoles] = await Promise.all([getUsuario(), getRol()]);
      const currentUser = allUsers.find((usuario) => usuario.id === userId);
      if (!currentUser)
        throw new Error('No se encontraron los datos del usuario autenticado.');

      const orgId = relationId(currentUser.organizacion);
      if (!orgId)
        throw new Error('No se pudo identificar la organización del usuario.');

      setCurrentUserId(userId);
      setOrganizacionId(orgId);
      setIsAdmin(
        ['administrador', 'admin'].includes(
          roleName(currentUser.rol, allRoles).trim().toLowerCase(),
        ),
      );
      setUsuarios(
        allUsers.filter(
          (usuario) => relationId(usuario.organizacion) === orgId,
        ),
      );
      setRols(allRoles);
    } catch (loadError) {
      console.error(loadError);
      setError(
        loadError instanceof Error
          ? loadError.message
          : 'No se pudieron cargar los usuarios.',
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadRols();
    void loadData();
  }, []);

  function editRol(Rol: Rol) {
    setEditingId(Rol.id);
    setForm({
      descripcion: Rol.descripcion,
    });
    setNotice('');
    setError('');
  }

  function resetForm() {
    setForm(emptyForm);
    setEditingId(undefined);
  }

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setNotice('');

    if (![form.descripcion].every((value) => value.trim())) {
      alert('Completá el campo.');
      return;
    }

    const RolData = {
      descripcion: form.descripcion.trim(),
    };

    setSaving(true);
    try {
      if (editingId !== undefined) {
        await updateRol(editingId, RolData);
        setNotice('Rol actualizado correctamente.');
      } else {
        await createRol(RolData);
        setNotice('Rol creado correctamente.');
      }
      resetForm();
      await loadRols();
    } catch (saveError) {
      console.error(saveError);
      setError(
        saveError instanceof Error
          ? saveError.message
          : 'No se pudo guardar el Rol.',
      );
    } finally {
      setSaving(false);
    }
  };

  async function handleDelete(rol: Rol) {
    if (rol.id === undefined) return;

    if (!window.confirm(`¿Querés eliminar el Rol "${rol.descripcion}"?`))
      return;

    setError('');
    setNotice('');

    try {
      await deleteRol(rol.id);
      setRols((current) => current.filter((item) => item.id !== rol.id));
      setNotice('Rol eliminado correctamente.');
    } catch (deleteError) {
      console.error(deleteError);
      setError(
        deleteError instanceof Error
          ? deleteError.message
          : 'No se pudo eliminar el Rol.',
      );
    }
  }

  return (
    <main className="container">
      <BackToMenu />
      <h1 className="title">Rol</h1>

      {loading && <p role="status">Cargando Rols...</p>}
      {!loading && error && (
        <p className="rols-feedback Rols-error" role="alert">
          {error}
        </p>
      )}
      {!loading && !error && !isAdmin && (
        <p className="usuarios-feedback usuarios-error" role="alert">
          Solo un administrador puede gestionar los roles de la organización.
        </p>
      )}
      {!loading && !error && isAdmin && (
        <>
          {notice && (
            <p className="rols-feedback Rols-success" role="status">
              {notice}
            </p>
          )}
          {error && (
            <p className="rols-feedback Rols-error" role="alert">
              {error}
            </p>
          )}

          <section className="rols-form-section">
            <h2>{editingId === undefined ? 'Agregar Rol' : 'Editar Rol'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="rols-form-grid">
                <label>
                  Descripcion
                  <input
                    value={form.descripcion}
                    onChange={(event) =>
                      setForm({ ...form, descripcion: event.target.value })
                    }
                    required
                  />
                </label>
              </div>
              <div className="rols-form-actions">
                <button type="submit" disabled={saving}>
                  {saving
                    ? 'Guardando...'
                    : editingId === undefined
                      ? 'Crear Rol'
                      : 'Guardar cambios'}
                </button>
                {editingId !== undefined && (
                  <button
                    type="button"
                    className="rols-secondary"
                    onClick={resetForm}
                    disabled={saving}
                  >
                    Cancelar edición
                  </button>
                )}
              </div>
            </form>
          </section>

          <section className="rols-list-section">
            <h2>Rols de la organización</h2>
            {Rols.length === 0 ? (
              <p>No hay Rols para mostrar.</p>
            ) : (
              <div className="rols-table-wrapper">
                <table>
                  <thead>
                    <tr>
                      <th>Id</th>
                      <th>Descripcion</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Rols.map((Rol) => (
                      <tr key={Rol.id}>
                        <td>{Rol.id}</td>
                        <td>{Rol.descripcion}</td>
                        <td className="rols-row-actions">
                          <button type="button" onClick={() => editRol(Rol)}>
                            Editar
                          </button>
                          <button
                            type="button"
                            className="rols-delete"
                            onClick={() => void handleDelete(Rol)}
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

export default Rols;
