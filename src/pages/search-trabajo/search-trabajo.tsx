import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import './search-trabajo.css';
import {
  deleteTrabajo,
  getTrabajo,
  updateTrabajo,
  type Trabajo,
} from '../../api/trabajo';
import { getInsumo, type Insumo } from '../../api/insumos';
import { getLote, type Lote } from '../../api/lote';
import { getUsuario, type Usuario } from '../../api/usuario';
import BackToMenu from '../../components/BackToMenu';
import '../../components/RecordCards.css';

type FormValues = {
  descripcion: string;
  fechaInicio: string;
  fechaFin: string;
  loteId: string;
  insumoId: string;
  usuarioId: string;
  cantidadInsumo: string;
};

const emptyForm: FormValues = {
  descripcion: '',
  fechaInicio: '',
  fechaFin: '',
  loteId: '',
  insumoId: '',
  usuarioId: '',
  cantidadInsumo: '',
};

function relationId(
  value: number | { id?: number } | null | undefined,
): number | undefined {
  if (typeof value === 'number') return value;
  return value?.id;
}

function roleName(value: Usuario['rol']): string {
  return typeof value === 'string' ? value : value.descripcion;
}

function SearchTrabajos() {
  const [nombre, setNombre] = useState('');
  const [trabajos, setTrabajos] = useState<Trabajo[]>([]);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [insumos, setInsumos] = useState<Insumo[]>([]);
  const [lotes, setLotes] = useState<Lote[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [form, setForm] = useState<FormValues>(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [resultados, setResultados] = useState<Trabajo[]>([]);
  const [buscado, setBuscado] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  useEffect(() => {
    async function cargarTrabajos() {
      try {
        const userId = Number(localStorage.getItem('userId'));
        if (!Number.isInteger(userId) || userId <= 0) {
          throw new Error('No se pudo identificar al usuario autenticado.');
        }

        const [allUsers, allTrabajos, allInsumos, allLotes] = await Promise.all([
          getUsuario(),
          getTrabajo(),
          getInsumo(),
          getLote(),
        ]);
        const currentUser = allUsers.find((usuario) => usuario.id === userId);
        if (!currentUser) {
          throw new Error('No se encontraron los datos del usuario autenticado.');
        }
        const orgId = relationId(currentUser.organizacion);
        if (!orgId) {
          throw new Error('No se pudo identificar la organización del usuario.');
        }

        const trabajosOrganizacion = allTrabajos.filter(
          (trabajo) => relationId(trabajo.organizacion) === orgId,
        );
        setTrabajos(trabajosOrganizacion);
        setResultados(trabajosOrganizacion);
        setUsuarios(
          allUsers.filter(
            (usuario) => relationId(usuario.organizacion) === orgId,
          ),
        );
        setInsumos(allInsumos);
        setLotes(allLotes);
        setIsAdmin(
          ['administrador', 'admin', 'ingeniero', 'ing'].includes(
            roleName(currentUser.rol).trim().toLowerCase(),
          ),
        );
        setBuscado(true);
      } catch (loadError) {
        console.error(loadError);
        setError(
          loadError instanceof Error
            ? loadError.message
            : 'No se pudieron cargar los trabajos.',
        );
      } finally {
        setLoading(false);
      }
    }

    void cargarTrabajos();
  }, []);

  const buscarTrabajos = (texto: string, origen = trabajos) => {
    const busqueda = texto.trim().toLowerCase();

    return origen.filter(
      (trabajo) =>
        trabajo.id.toString().includes(busqueda) ||
        trabajo.fechaInicio.includes(busqueda) ||
        trabajo.descripcion.toLowerCase().includes(busqueda) ||
        trabajo.fechaFin.includes(busqueda) ||
        trabajo.cantidadInsumo.toString().includes(busqueda) ||
        String(getInsumoId(trabajo) ?? '').includes(busqueda) ||
        String(getLoteId(trabajo) ?? '').includes(busqueda) ||
        String(getUsuarioId(trabajo) ?? '').includes(busqueda),
    );
  };

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setNotice('');

    setResultados(buscarTrabajos(nombre));
    setBuscado(true);
  };

  const handleLimpiar = () => {
    setNombre('');
    setResultados(trabajos);
    setBuscado(true);
  };

  const getInsumoId = (t: Trabajo): number | undefined => relationId(t.insumo);

  const getLoteId = (t: Trabajo): number | undefined => relationId(t.lote);

  const getUsuarioId = (t: Trabajo): number | undefined =>
    relationId(t.usuario);

  const usuarioNombre = (id: number | undefined): string => {
    const usuario = usuarios.find((item) => item.id === id);
    return usuario ? `${usuario.nombre} ${usuario.apellido}` : 'N/A';
  };

  const insumoNombre = (id: number | undefined): string =>
    insumos.find((item) => item.id === id)?.nombre ?? 'N/A';

  const loteNombre = (id: number | undefined): string => {
    const lote = lotes.find((item) => item.id === id);
    return lote
      ? `${lote.descripcion} - ${lote.numero}`
      : id?.toString() ?? 'N/A';
  };

  const handleEditar = (trabajo: Trabajo) => {
    setEditingId(trabajo.id);
    setForm({
      descripcion: trabajo.descripcion,
      fechaInicio: trabajo.fechaInicio.slice(0, 10),
      fechaFin: trabajo.fechaFin.slice(0, 10),
      loteId: String(getLoteId(trabajo) ?? ''),
      insumoId: String(getInsumoId(trabajo) ?? ''),
      usuarioId: String(getUsuarioId(trabajo) ?? ''),
      cantidadInsumo: String(trabajo.cantidadInsumo),
    });
    setError('');
    setNotice('');
  };

  const handleCancelarEdicion = () => {
    setEditingId(null);
    setForm(emptyForm);
  };

  const handleGuardarEdicion = async (
    event: React.SubmitEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    if (editingId === null) return;

    const loteId = Number(form.loteId);
    const insumoId = Number(form.insumoId);
    const usuarioId = Number(form.usuarioId);
    const cantidadInsumo = Number(form.cantidadInsumo);

    if (
      [loteId, insumoId, usuarioId].some(
        (id) => !Number.isInteger(id) || id <= 0,
      )
    ) {
      setError('Seleccioná un lote, un insumo y un usuario válidos.');
      return;
    }
    if (form.fechaFin < form.fechaInicio) {
      setError('La fecha de fin no puede ser anterior a la fecha de inicio.');
      return;
    }
    if (!Number.isInteger(cantidadInsumo) || cantidadInsumo < 0) {
      setError('La cantidad debe ser un entero mayor o igual a cero.');
      return;
    }

    setSaving(true);
    setError('');
    setNotice('');
    try {
      const actualizado = await updateTrabajo(editingId, {
        descripcion: form.descripcion.trim(),
        fechaInicio: form.fechaInicio,
        fechaFin: form.fechaFin,
        lote: loteId,
        insumo: insumoId,
        usuario: usuarioId,
        cantidadInsumo,
      });
      const actualizados = trabajos.map((trabajo) =>
        trabajo.id === editingId ? actualizado : trabajo,
      );
      setTrabajos(actualizados);
      setResultados(buscarTrabajos(nombre, actualizados));
      setEditingId(null);
      setForm(emptyForm);
      setNotice('Trabajo actualizado correctamente.');
    } catch (saveError) {
      console.error(saveError);
      setError(
        saveError instanceof Error
          ? saveError.message
          : 'No se pudo actualizar el trabajo.',
      );
    } finally {
      setSaving(false);
    }
  };

  const handleEliminar = async (trabajo: Trabajo) => {
    if (
      !window.confirm(`¿Querés eliminar el trabajo "${trabajo.descripcion}"?`)
    ) {
      return;
    }
    setSaving(true);
    setError('');
    setNotice('');
    try {
      await deleteTrabajo(trabajo.id);
      const restantes = trabajos.filter((item) => item.id !== trabajo.id);
      setTrabajos(restantes);
      setResultados(buscarTrabajos(nombre, restantes));
      if (editingId === trabajo.id) handleCancelarEdicion();
      setNotice('Trabajo eliminado correctamente.');
    } catch (deleteError) {
      console.error(deleteError);
      setError(
        deleteError instanceof Error
          ? deleteError.message
          : 'No se pudo eliminar el trabajo.',
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="Pagina">
      <div className="container">
        <BackToMenu />
        <h1 className="title">BÚSQUEDA DE TRABAJOS</h1>
        <form onSubmit={handleSubmit}>
          <div className="padre">
            <input
              type="text"
              placeholder="Ingrese el nombre del trabajo"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />
            <p>
              ¿Desea agregar un nuevo trabajo?{' '}
              <Link to="/trabajo">Agregar Trabajo</Link>
            </p>
            <button type="submit" className="button" disabled={loading}>
              {loading ? 'Cargando trabajos...' : 'Buscar'}
            </button>
            <button type="button" className="button" onClick={handleLimpiar}>
              Limpiar
            </button>
          </div>
        </form>
        {error && (
          <p
            className="search-trabajo-feedback search-trabajo-error"
            role="alert"
          >
            {error}
          </p>
        )}
        {notice && (
          <p
            className="search-trabajo-feedback search-trabajo-success"
            role="status"
          >
            {notice}
          </p>
        )}
        {loading && <p role="status">Cargando trabajos...</p>}
        {isAdmin && editingId !== null && (
          <section className="search-trabajo-edit">
            <h2>Editar trabajo</h2>
            <form onSubmit={handleGuardarEdicion}>
              <div className="search-trabajo-edit-grid">
                <label>
                  Descripción
                  <input
                    value={form.descripcion}
                    onChange={(event) =>
                      setForm({ ...form, descripcion: event.target.value })
                    }
                    required
                  />
                </label>
                <label>
                  Fecha de inicio
                  <input
                    type="date"
                    value={form.fechaInicio}
                    onChange={(event) =>
                      setForm({ ...form, fechaInicio: event.target.value })
                    }
                    required
                  />
                </label>
                <label>
                  Fecha de fin
                  <input
                    type="date"
                    value={form.fechaFin}
                    onChange={(event) =>
                      setForm({ ...form, fechaFin: event.target.value })
                    }
                    required
                  />
                </label>
                <label>
                  Lote
                  <select
                    value={form.loteId}
                    onChange={(event) =>
                      setForm({ ...form, loteId: event.target.value })
                    }
                    required
                  >
                    <option value="" disabled>
                      Seleccioná un lote
                    </option>
                    {lotes.map((lote) => (
                      <option key={lote.id} value={lote.id}>
                        {lote.descripcion} - {lote.numero}
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  Insumo
                  <select
                    value={form.insumoId}
                    onChange={(event) =>
                      setForm({ ...form, insumoId: event.target.value })
                    }
                    required
                  >
                    <option value="" disabled>
                      Seleccioná un insumo
                    </option>
                    {insumos.map((insumo) => (
                      <option key={insumo.id} value={insumo.id}>
                        {insumo.nombre}
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  Usuario
                  <select
                    value={form.usuarioId}
                    onChange={(event) =>
                      setForm({ ...form, usuarioId: event.target.value })
                    }
                    required
                  >
                    <option value="" disabled>
                      Seleccioná un usuario
                    </option>
                    {usuarios.map((usuario) => (
                      <option key={usuario.id} value={usuario.id}>
                        {usuario.nombre} {usuario.apellido}
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  Cantidad de insumo
                  <input
                    type="number"
                    min={0}
                    step={1}
                    value={form.cantidadInsumo}
                    onChange={(event) =>
                      setForm({ ...form, cantidadInsumo: event.target.value })
                    }
                    required
                  />
                </label>
              </div>
              <div className="search-trabajo-edit-actions">
                <button type="submit" disabled={saving}>
                  {saving ? 'Guardando...' : 'Guardar cambios'}
                </button>
                <button
                  type="button"
                  className="search-trabajo-secondary"
                  onClick={handleCancelarEdicion}
                  disabled={saving}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </section>
        )}

        {buscado && (
          <section className="search-trabajo-results">
            <h2 className="search-trabajo-results-title">
              Trabajos encontrados:
            </h2>
            {resultados.length === 0 ? (
              <p>No se encontraron trabajos.</p>
            ) : (
              <div className="record-list" aria-label="Resultados de trabajos">
                {resultados.map((trabajo) => (
                  <article className="record-card" key={trabajo.id}>
                    <div className="record-card-content">
                      <span className="record-card-kicker">
                        Trabajo #{trabajo.id}
                      </span>
                      <h3 className="record-card-title">
                        {trabajo.descripcion}
                      </h3>
                      <div className="record-card-details">
                        <span className="record-card-detail">
                          <span className="record-card-detail-label">
                            Fecha de inicio:
                          </span>
                          {trabajo.fechaInicio.slice(0, 10)}
                        </span>
                        <span className="record-card-detail">
                          <span className="record-card-detail-label">
                            Fecha de fin:
                          </span>
                          {trabajo.fechaFin.slice(0, 10)}
                        </span>
                        <span className="record-card-detail">
                          <span className="record-card-detail-label">
                            Cantidad de insumos:
                          </span>
                          {trabajo.cantidadInsumo}
                        </span>
                        <span className="record-card-detail">
                          <span className="record-card-detail-label">
                            Lote:
                          </span>
                          {loteNombre(getLoteId(trabajo))}
                        </span>
                        <span className="record-card-detail">
                          <span className="record-card-detail-label">
                            Usuario:
                          </span>
                          {usuarioNombre(getUsuarioId(trabajo))}
                        </span>
                        <span className="record-card-detail">
                          <span className="record-card-detail-label">
                            Insumo:
                          </span>
                          {insumoNombre(getInsumoId(trabajo))}
                        </span>
                      </div>
                    </div>
                    {isAdmin && (
                      <div className="record-card-actions">
                        <button
                          type="button"
                          disabled={saving}
                          onClick={() => handleEditar(trabajo)}
                        >
                          Editar
                        </button>
                        <button
                          type="button"
                          className="record-card-danger"
                          disabled={saving}
                          onClick={() => void handleEliminar(trabajo)}
                        >
                          Eliminar
                        </button>
                      </div>
                    )}
                  </article>
                ))}
              </div>
            )}
          </section>
        )}
      </div>
    </div>
  );
}

export default SearchTrabajos;
