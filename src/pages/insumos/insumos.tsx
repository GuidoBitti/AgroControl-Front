import './insumos.css';
import { useEffect, useState } from 'react';
import BackToMenu from '../../components/BackToMenu.js';
import { getRol, type Rol } from '../../api/rol';
import { getUsuario, type Usuario } from '../../api/usuario.ts';
import { createInsumo } from '../../api/insumos.ts';
import { getTiposInsumo, type TipoInsumo } from '../../api/tipo-insumo.ts';

type FormValues = {
  nombre: string;
  tipoInsumoId: string;
  stock: string;
  descripcion: string;
};

const emptyForm: FormValues = {
  nombre: '',
  tipoInsumoId: '',
  stock: '',
  descripcion: '',
};

function relationId(value: Usuario['organizacion']): number | undefined {
  if (typeof value === 'number') return value;
  return value?.id;
}

function roleName(value: Usuario['rol']): string {
  return typeof value === 'string' ? value : value.descripcion;
}

function Insumos() {
  const [_usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [_roles, setRoles] = useState<Rol[]>([]);
  const [_organizacionId, setOrganizacionId] = useState<number>();
  const [_currentUserId, setCurrentUserId] = useState<number>();
  const [tiposInsumo, setTiposInsumo] = useState<TipoInsumo[]>([]);
  const [form, setForm] = useState<FormValues>(emptyForm);
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
      const [allUsers, allRoles, allTiposInsumo] = await Promise.all([
        getUsuario(),
        getRol(),
        getTiposInsumo(),
      ]);
      const currentUser = allUsers.find((usuario) => usuario.id === userId);
      if (!currentUser)
        throw new Error('No se encontraron los datos del usuario autenticado.');

      const orgId = relationId(currentUser.organizacion);
      if (!orgId)
        throw new Error('No se pudo identificar la organización del usuario.');

      setCurrentUserId(userId);
      setOrganizacionId(orgId);
      setIsAdmin(
        ['administrador', 'admin', 'ingeniero', 'ing'].includes(
          roleName(currentUser.rol).trim().toLowerCase(),
        ),
      );
      setUsuarios(
        allUsers.filter(
          (usuario) => relationId(usuario.organizacion) === orgId,
        ),
      );
      setRoles(allRoles);
      setTiposInsumo(allTiposInsumo);
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
    void loadData();
  }, []);

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setNotice('');

    if (
      ![
        form.nombre,
        form.tipoInsumoId,
        form.stock,
        form.descripcion,
      ].every((value) =>
        value.trim(),
      )
    ) {
      alert('Completá todos los campos.');
      return;
    }

    const stockNumber = Number(form.stock);
    if (!Number.isInteger(stockNumber) || stockNumber < 0) {
      setError(
        'El stock tiene que ser entero o un numero mayor o igual a cero',
      );
      return;
    }

    const insumoData = {
      nombre: form.nombre.trim(),
      tipoInsumoId: Number(form.tipoInsumoId),
      stock: stockNumber,
      descripcion: form.descripcion.trim(),
    };

    setSaving(true);
    try {
      await createInsumo(insumoData);
      setNotice('Insumo creado correctamente.');
      setForm(emptyForm);
    } catch (saveError) {
      console.error(saveError);
      setError(
        saveError instanceof Error
          ? saveError.message
          : 'No se pudo guardar el insumo.',
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="container ">
      <BackToMenu />
      <h1 className="title">INSUMOS</h1>

      {loading && <p role="status">Cargando insumos...</p>}
      {!loading && error && (
        <p className="insumos-feedback insumos-error" role="alert">
          {error}
        </p>
      )}
      {!loading && !error && !isAdmin && (
        <p className="usuarios-feedback usuarios-error" role="alert">
          Solo el administrador o un ingeniero puede gestionar los insumos de la
          organización.
        </p>
      )}
      {!loading && !error && isAdmin && (
        <>
          {notice && (
            <p className="insumos-feedback insumos-success" role="status">
              {notice}
            </p>
          )}
          {error && (
            <p className="insumos-feedback insumos-error" role="alert">
              {error}
            </p>
          )}

          <section className="insumos-form-section">
            <h2>Agregar nuevo insumo</h2>
            <form onSubmit={handleSubmit}>
              <div className="insumos-form-grid">
                <label>
                  Nombre
                  <input
                    value={form.nombre}
                    onChange={(event) =>
                      setForm({ ...form, nombre: event.target.value })
                    }
                    required
                  />
                </label>
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
                <label>
                  Tipo
                  <select
                    value={form.tipoInsumoId}
                    onChange={(event) =>
                      setForm({ ...form, tipoInsumoId: event.target.value })
                    }
                    required
                  >
                    <option value="" disabled>
                      {tiposInsumo.length > 0
                        ? 'Seleccioná un tipo'
                        : 'No hay tipos disponibles'}
                    </option>
                    {tiposInsumo.map((tipoInsumo) => (
                      <option key={tipoInsumo.id} value={tipoInsumo.id}>
                        {tipoInsumo.nombre}
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  Stock
                  <input
                    type="number"
                    min={0}
                    step={1}
                    value={form.stock}
                    onChange={(event) =>
                      setForm({ ...form, stock: event.target.value })
                    }
                    required
                  />
                </label>
              </div>
              <div className="insumos-form-actions">
                <button
                  type="submit"
                  disabled={saving || tiposInsumo.length === 0}
                >
                  {saving ? 'Guardando...' : 'Crear insumo'}
                </button>
              </div>
            </form>
          </section>
        </>
      )}
    </div>
  );
}

export default Insumos;
