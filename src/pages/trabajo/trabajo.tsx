import { useEffect, useState } from 'react';
import BackToMenu from '../../components/BackToMenu';
import { getInsumo, type Insumo } from '../../api/insumos';
import { getLote, type Lote } from '../../api/lote.ts';
import { getUsuario, type Usuario } from '../../api/usuario';
import { createTrabajo, type Trabajo } from '../../api/trabajo';
import './trabajo.css';
import '../../components/RecordCards.css';

type FormValues = {
  descripcion: string;
  fechaInicio: string;
  fechaFin: string;
  loteId: string;
  insumoId: string;
  usuarioId: string;
  cantidadInsumo: number;
};

const emptyForm: FormValues = {
  descripcion: '',
  fechaInicio: '',
  fechaFin: '',
  loteId: '',
  insumoId: '',
  usuarioId: '',
  cantidadInsumo: 0,
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

function Trabajos() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [organizacionId, setOrganizacionId] = useState<number>();
  const [insumos, setInsumos] = useState<Insumo[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [lotes, setLotes] = useState<Lote[]>([]);
  const [form, setForm] = useState<FormValues>(emptyForm);
  const [trabajosCreados, setTrabajosCreados] = useState<Trabajo[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const usuarioNombre = (value: Trabajo['usuario']): string => {
    const usuarioId = relationId(value);
    const usuario = usuarios.find((item) => item.id === usuarioId);
    return usuario ? `${usuario.nombre} ${usuario.apellido}` : 'N/A';
  };

  const insumoNombre = (value: Trabajo['insumo']): string =>
    insumos.find((item) => item.id === relationId(value))?.nombre ?? 'N/A';

  const loteNombre = (value: Trabajo['lote']): string => {
    const loteId = relationId(value);
    const lote = lotes.find((item) => item.id === loteId);
    return lote
      ? `${lote.descripcion} - ${lote.numero}`
      : loteId?.toString() ?? 'N/A';
  };

  async function loadData() {
    try {
      const userId = Number(localStorage.getItem('userId'));
      if (!Number.isInteger(userId) || userId <= 0) {
        throw new Error('No se pudo identificar al usuario autenticado.');
      }
      const [allUsers, allInsumos, allLotes] = await Promise.all([
        getUsuario(),
        getInsumo(),
        getLote(),
      ]);
      const currentUser = allUsers.find((usuario) => usuario.id === userId);
      if (!currentUser)
        throw new Error('No se encontraron los datos del usuario autenticado.');

      const orgId = relationId(currentUser.organizacion);
      if (!orgId)
        throw new Error('No se pudo identificar la organización del usuario.');

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
      setInsumos(allInsumos);
      setLotes(allLotes);
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

  useEffect(() => {
    void loadData();
  }, []);

  async function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!organizacionId) return;
    setSaving(true);
    setError('');
    setNotice('');

    const loteSeleccionado = Number(form.loteId);
    const insumoSeleccionado = Number(form.insumoId);
    const usuarioSeleccionado = Number(form.usuarioId);
    if (
      [loteSeleccionado, insumoSeleccionado, usuarioSeleccionado].some(
        (id) => !Number.isInteger(id) || id <= 0,
      )
    ) {
      setSaving(false);
      setError('Seleccioná un lote, un insumo y un usuario válidos.');
      return;
    }

    if (form.fechaFin < form.fechaInicio) {
      setSaving(false);
      setError('La fecha de fin no puede ser anterior a la fecha de inicio.');
      return;
    }
    if (!Number.isInteger(form.cantidadInsumo) || form.cantidadInsumo < 0) {
      setSaving(false);
      setError('La cantidad debe ser un entero mayor o igual a cero.');
      return;
    }

    try {
      const trabajoData = {
        descripcion: form.descripcion.trim(),
        fechaInicio: form.fechaInicio,
        fechaFin: form.fechaFin,
        lote: loteSeleccionado,
        insumo: insumoSeleccionado,
        usuario: usuarioSeleccionado,
        cantidadInsumo: form.cantidadInsumo,
      };
      const creado = await createTrabajo({
        ...trabajoData,
        organizacion: organizacionId,
      });
      setTrabajosCreados((current) => [
        {
          ...creado,
          lote: loteSeleccionado,
          insumo: insumoSeleccionado,
          usuario: usuarioSeleccionado,
        },
        ...current,
      ]);
      setNotice('Trabajo creado correctamente.');
      setForm(emptyForm);
    } catch (saveError) {
      console.error(saveError);
      setError(
        saveError instanceof Error
          ? saveError.message
          : 'No se pudo guardar el trabajo.',
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="container">
      <BackToMenu />
      <h1 className="title">TRABAJOS</h1>

      {loading && <p role="status">Cargando trabajos...</p>}
      {!loading && error && (
        <p className="trabajos-feedback trabajos-error" role="alert">
          {error}
        </p>
      )}
      {!loading && !error && !isAdmin && (
        <p className="usuarios-feedback usuarios-error" role="alert">
          Solo el administrador o un ingeniero puede gestionar los trabajos de
          la organización.
        </p>
      )}

      {!loading && organizacionId !== undefined && isAdmin && (
        <>
          {notice && (
            <p className="trabajos-feedback trabajos-success" role="status">
              {notice}
            </p>
          )}

          <section className="trabajos-form-section">
            <h2>Agregar trabajo</h2>
            <form onSubmit={handleSubmit}>
              <div className="trabajos-form-grid">
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
                  Insumo
                  <select
                    value={form.insumoId}
                    onChange={(event) =>
                      setForm({ ...form, insumoId: event.target.value })
                    }
                  >
                    <option value="">Seleccionar insumo</option>
                    {insumos.map((insumo) => (
                      <option key={insumo.id} value={insumo.id}>
                        {insumo.nombre}
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  Cantidad de insumo
                  <input
                    type="number"
                    min="0"
                    step={1}
                    value={form.cantidadInsumo}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        cantidadInsumo: Number(e.target.value),
                      })
                    }
                    required
                  />
                </label>
                <label>
                  Lote
                  <select
                    id="lote"
                    value={form.loteId}
                    onChange={(e) =>
                      setForm({ ...form, loteId: e.target.value })
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
                  Usuario
                  <select
                    value={form.usuarioId}
                    onChange={(event) =>
                      setForm({ ...form, usuarioId: event.target.value })
                    }
                    required
                  >
                    <option value="">Seleccionar usuario</option>
                    {usuarios.map((usuario) => (
                      <option key={usuario.id} value={usuario.id}>
                        {usuario.nombre} {usuario.apellido}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
              <div className="trabajos-form-actions">
                <button type="submit" disabled={saving}>
                  {saving ? 'Guardando...' : 'Crear trabajo'}
                </button>
              </div>
            </form>
          </section>

          {trabajosCreados.length > 0 && (
            <section className="trabajos-list-section">
              <h2>Trabajos creados</h2>
              <div className="record-list" aria-label="Trabajos creados">
                {trabajosCreados.map((trabajo) => (
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
                            Inicio:
                          </span>
                          {trabajo.fechaInicio.slice(0, 10)}
                        </span>
                        <span className="record-card-detail">
                          <span className="record-card-detail-label">
                            Fin:
                          </span>
                          {trabajo.fechaFin.slice(0, 10)}
                        </span>
                        <span className="record-card-detail">
                          <span className="record-card-detail-label">
                            Lote:
                          </span>
                          {loteNombre(trabajo.lote)}
                        </span>
                        <span className="record-card-detail">
                          <span className="record-card-detail-label">
                            Insumo:
                          </span>
                          {insumoNombre(trabajo.insumo)}
                        </span>
                        <span className="record-card-detail">
                          <span className="record-card-detail-label">
                            Usuario:
                          </span>
                          {usuarioNombre(trabajo.usuario)}
                        </span>
                        <span className="record-card-detail">
                          <span className="record-card-detail-label">
                            Cantidad de insumos:
                          </span>
                          {trabajo.cantidadInsumo}
                        </span>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </main>
  );
}

export default Trabajos;
