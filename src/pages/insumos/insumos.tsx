import './insumos.css';
import { useEffect, useState } from 'react';
import BackToMenu from '../../components/BackToMenu.js';
import { getRol, type Rol } from '../../api/rol';
import { getUsuario, type Usuario } from '../../api/usuario.ts';
import {
  getInsumo,
  createInsumo,
  updateInsumo,
  deleteInsumo,
  type Insumo,
} from '../../api/insumos.ts';
import '../../components/RecordCards.css';

type FormValues = {
  nombre: string;
  tipo: string;
  stock: string;
  descripcion: string;
};

const emptyForm: FormValues = {
  nombre: '',
  tipo: '',
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
  const [_insumos, setInsumos] = useState<Insumo[]>([]);
  const [form, setForm] = useState<FormValues>(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [savingId, setSavingId] = useState<number | null>(null);
  const [resultados, setResultados] = useState<Insumo[]>([]);
  const [cantidades, setCantidades] = useState<Record<number, string>>({});
  const [_buscado, setBuscado] = useState(false);

  async function loadInsumos() {
    try {
      const data = await getInsumo();
      setInsumos(data);
      setResultados(data);
      setBuscado(true);
    } catch (loadError) {
      console.error(loadError);
      setError(
        loadError instanceof Error
          ? loadError.message
          : 'No se pudieron cargar los insumos',
      );
    } finally {
      setLoading(false);
    }
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
    void loadInsumos();
    void loadData();
  }, []);

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setNotice('');

    if (
      ![form.nombre, form.tipo, form.stock, form.descripcion].every((value) =>
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
      tipo: form.tipo.trim(),
      stock: stockNumber,
      descripcion: form.descripcion.trim(),
    };

    setSaving(true);
    try {
      await createInsumo(insumoData);
      setNotice('Insumo creado correctamente.');
      setForm(emptyForm);
      await loadInsumos();
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

  const handleEliminar = async (insumo: Insumo) => {
    if (
      !window.confirm(
        `¿Seguro que querés eliminar el insumo "${insumo.nombre}"?`,
      )
    ) {
      return;
    }

    setSavingId(insumo.id);
    setError('');
    setNotice('');
    try {
      await deleteInsumo(insumo.id);
      setInsumos((current) => current.filter((item) => item.id !== insumo.id));
      setResultados((current) =>
        current.filter((item) => item.id !== insumo.id),
      );
      setNotice(`Se eliminó "${insumo.nombre}".`);
    } catch (deleteError) {
      console.error(deleteError);
      setError(
        deleteError instanceof Error
          ? deleteError.message
          : 'No se pudo eliminar el insumo.',
      );
    } finally {
      setSavingId(null);
    }
  };

  const handleAgregarStock = async (insumo: Insumo) => {
    const cantidad = Number(cantidades[insumo.id] ?? '1');
    if (!Number.isInteger(cantidad) || cantidad <= 0) {
      setError('Ingresá una cantidad entera mayor que cero.');
      setNotice('');
      return;
    }

    setSavingId(insumo.id);
    setError('');
    setNotice('');
    try {
      const actualizado = await updateInsumo(insumo.id, {
        nombre: insumo.nombre,
        tipo: insumo.tipo,
        descripcion: insumo.descripcion,
        stock: insumo.stock + cantidad,
      });
      setInsumos((current) =>
        current.map((item) => (item.id === insumo.id ? actualizado : item)),
      );
      setResultados((current) =>
        current.map((item) => (item.id === insumo.id ? actualizado : item)),
      );
      setNotice(`Se agregaron ${cantidad} unidades a "${insumo.nombre}".`);
      setCantidades((current) => ({ ...current, [insumo.id]: '1' }));
    } catch (saveError) {
      console.error(saveError);
      setError(
        saveError instanceof Error
          ? saveError.message
          : 'No se pudo actualizar el stock.',
      );
    } finally {
      setSavingId(null);
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
                  <input
                    type="text"
                    value={form.tipo}
                    onChange={(event) =>
                      setForm({ ...form, tipo: event.target.value })
                    }
                    required
                  />
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
                <button type="submit" disabled={saving}>
                  {saving ? 'Guardando...' : 'Crear insumo'}
                </button>
              </div>
            </form>
          </section>

          <section className="search-insumos-results">
            <h2 className="resultados-titulo">Resultados de la búsqueda:</h2>
            {resultados.length === 0 ? (
              <p>No se encontraron insumos.</p>
            ) : (
              <div className="record-list" aria-label="Resultados de insumos">
                {resultados.map((i) => (
                  <article className="record-card" key={i.id}>
                    <div className="record-card-content">
                      <span className="record-card-kicker">Insumo #{i.id}</span>
                      <h3 className="record-card-title">{i.nombre}</h3>
                      <div className="record-card-details">
                        <span className="record-card-detail">
                          <span className="record-card-detail-label">
                            Tipo:
                          </span>
                          {i.tipo}
                        </span>
                        <span className="record-card-detail">
                          <span className="record-card-detail-label">
                            Stock:
                          </span>
                          {i.stock}
                        </span>
                        <span className="record-card-detail">
                          <span className="record-card-detail-label">
                            Descripción:
                          </span>
                          {i.descripcion}
                        </span>
                      </div>
                    </div>
                    <div className="record-card-actions search-insumos-actions">
                      <label className="search-insumos-quantity">
                        Agregar unidades
                        <input
                          type="number"
                          min={1}
                          step={1}
                          value={cantidades[i.id] ?? '1'}
                          onChange={(event) =>
                            setCantidades((current) => ({
                              ...current,
                              [i.id]: event.target.value,
                            }))
                          }
                          aria-label={`Unidades a agregar a ${i.nombre}`}
                        />
                      </label>
                      <button
                        type="button"
                        className="search-insumos-add"
                        disabled={savingId !== null}
                        onClick={() => void handleAgregarStock(i)}
                      >
                        {savingId === i.id ? 'Guardando...' : 'Agregar stock'}
                      </button>
                      <button
                        type="button"
                        className="record-card-danger"
                        disabled={savingId !== null}
                        onClick={() => void handleEliminar(i)}
                      >
                        Eliminar
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
}

export default Insumos;
