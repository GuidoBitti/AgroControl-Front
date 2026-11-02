import { useEffect, useState } from 'react';
import BackToMenu from '../../components/BackToMenu';
import { getInsumo, type Insumo } from '../../api/insumos';
import { getLoteCampania, type LoteCampania } from '../../api/lote-campania';
import { getLote, type Lote } from '../../api/lote.ts';
import { getCampanias, type Campania } from '../../api/campania.ts';
import { getUsuario, type Usuario } from '../../api/usuario';
import { getRol, type Rol } from '../../api/rol.ts';
import {
  createTrabajo,
  deleteTrabajo,
  getTrabajo,
  updateTrabajo,
  type Trabajo,
} from '../../api/trabajo';
import './trabajo.css';

type FormValues = {
  descripcion: string;
  fechaInicio: string;
  fechaFin: string;
  loteCampaniaId: string;
  insumoId: string;
  usuarioId: string;
};

const emptyForm: FormValues = {
  descripcion: '',
  fechaInicio: '',
  fechaFin: '',
  loteCampaniaId: '',
  insumoId: '',
  usuarioId: '',
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
  const [_roles, setRoles] = useState<Rol[]>([]);
  const [organizacionId, setOrganizacionId] = useState<number>();
  const [_currentUserId, setCurrentUserId] = useState<number>();
  const [trabajos, setTrabajos] = useState<Trabajo[]>([]);
  const [insumos, setInsumos] = useState<Insumo[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [lotesCampania, setLotesCampania] = useState<LoteCampania[]>([]);
  const [lotes, setLotes] = useState<Lote[]>([]);
  const [campanias, setCampanias] = useState<Campania[]>([]);
  const [form, setForm] = useState<FormValues>(emptyForm);
  const [editingId, setEditingId] = useState<number>();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  function usuarioNombre(value: Trabajo['usuario']): string {
    const usuario = usuarios.find((item) => item.id === relationId(value));
    return usuario ? `${usuario.nombre} ${usuario.apellido}` : '';
  }

  function insumoNombre(value: Trabajo['insumo']): string {
    const insumo = insumos.find((item) => item.id === relationId(value));
    return insumo ? insumo.nombre : '';
  }

  function nombreLoteCampania(loteCampania: LoteCampania): string {
    const lote = lotes.find(
      (item) => item.id === relationId(loteCampania.lote),
    );
    const campania = campanias.find(
      (item) => item.id === relationId(loteCampania.campania),
    );
    return `${lote?.id ?? ''} · ${campania?.id ?? ''}`;
  }

  function loteCampaniaNombre(value: Trabajo['loteCampania']): string {
    const loteCampania = lotesCampania.find(
      (item) => item.id === relationId(value),
    );
    return loteCampania ? nombreLoteCampania(loteCampania) : '';
  }

  async function loadUsuario() {
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

  async function loadData() {
    try {
      const userId = Number(localStorage.getItem('userId'));
      if (!Number.isInteger(userId) || userId <= 0) {
        throw new Error('No se pudo identificar al usuario autenticado.');
      }
      const [
        allUsers,
        allTrabajos,
        allInsumos,
        allLotesCampania,
        allLotes,
        allCampanias,
      ] = await Promise.all([
        getUsuario(),
        getTrabajo(),
        getInsumo(),
        getLoteCampania(),
        getLote(),
        getCampanias(),
      ]);
      const currentUser = allUsers.find((usuario) => usuario.id === userId);
      if (!currentUser)
        throw new Error('No se encontraron los datos del usuario autenticado.');

      const orgId = relationId(currentUser.organizacion);
      if (!orgId)
        throw new Error('No se pudo identificar la organización del usuario.');

      setOrganizacionId(orgId);
      setUsuarios(
        allUsers.filter(
          (usuario) => relationId(usuario.organizacion) === orgId,
        ),
      );
      setTrabajos(
        allTrabajos.filter(
          (trabajo) => relationId(trabajo.organizacion) === orgId,
        ),
      );
      setInsumos(allInsumos);
      setLotesCampania(allLotesCampania);
      setLotes(allLotes);
      setCampanias(allCampanias);
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
    void loadUsuario();
  }, []);

  function resetForm() {
    setForm(emptyForm);
    setEditingId(undefined);
  }

  function editTrabajo(trabajo: Trabajo) {
    if (trabajo.id === undefined) return;
    setEditingId(trabajo.id);
    setForm({
      descripcion: trabajo.descripcion,
      fechaInicio: trabajo.fechaInicio.slice(0, 10),
      fechaFin: trabajo.fechaFin.slice(0, 10),
      loteCampaniaId: String(relationId(trabajo.loteCampania) ?? ''),
      insumoId: String(relationId(trabajo.insumo) ?? ''),
      usuarioId: String(relationId(trabajo.usuario) ?? ''),
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

    const loteCampaniaSeleccionada = Number(form.loteCampaniaId);
    const insumoSeleccionado = Number(form.insumoId);
    const usuarioSeleccionado = Number(form.usuarioId);
    if (
      [loteCampaniaSeleccionada, insumoSeleccionado, usuarioSeleccionado].some(
        (id) => !Number.isInteger(id) || id <= 0,
      )
    ) {
      setSaving(false);
      setError('Seleccioná un lote y campaña, un insumo y un usuario válidos.');
      return;
    }

    if (form.fechaFin < form.fechaInicio) {
      setSaving(false);
      setError('La fecha de fin no puede ser anterior a la fecha de inicio.');
      return;
    }

    try {
      const trabajoData = {
        descripcion: form.descripcion.trim(),
        fechaInicio: form.fechaInicio,
        fechaFin: form.fechaFin,
        loteCampania: loteCampaniaSeleccionada,
        insumo: insumoSeleccionado,
        usuario: usuarioSeleccionado,
      };
      if (editingId !== undefined) {
        await updateTrabajo(editingId, trabajoData);
        setNotice('Trabajo actualizado correctamente.');
      } else {
        await createTrabajo({ ...trabajoData, organizacion: organizacionId });
        setNotice('Trabajo creado correctamente.');
      }
      resetForm();
      await loadData();
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

  async function handleDelete(trabajo: Trabajo) {
    if (trabajo.id === undefined) return;
    if (
      !window.confirm(`¿Querés eliminar el trabajo "${trabajo.descripcion}"?`)
    )
      return;

    setError('');
    setNotice('');
    try {
      await deleteTrabajo(trabajo.id);
      setTrabajos((current) =>
        current.filter((item) => item.id !== trabajo.id),
      );
      setNotice('Trabajo eliminado correctamente.');
    } catch (deleteError) {
      console.error(deleteError);
      setError(
        deleteError instanceof Error
          ? deleteError.message
          : 'No se pudo eliminar el trabajo.',
      );
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

      {!loading && organizacionId !== undefined && !error && isAdmin && (
        <>
          {notice && (
            <p className="trabajos-feedback trabajos-success" role="status">
              {notice}
            </p>
          )}

          <section className="trabajos-form-section">
            <h2>
              {editingId === undefined ? 'Agregar trabajo' : 'Editar trabajo'}
            </h2>
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
                  Lote y campaña
                  <select
                    value={form.loteCampaniaId}
                    onChange={(event) =>
                      setForm({ ...form, loteCampaniaId: event.target.value })
                    }
                    required
                  >
                    <option value="">Seleccionar lote y campaña</option>
                    {lotesCampania.map((loteCampania) => (
                      <option key={loteCampania.id} value={loteCampania.id}>
                        {nombreLoteCampania(loteCampania)}
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
                  {saving
                    ? 'Guardando...'
                    : editingId === undefined
                      ? 'Crear trabajo'
                      : 'Guardar cambios'}
                </button>
                {editingId !== undefined && (
                  <button
                    type="button"
                    className="trabajos-secondary"
                    onClick={resetForm}
                    disabled={saving}
                  >
                    Cancelar edición
                  </button>
                )}
              </div>
            </form>
          </section>

          <section className="trabajos-list-section">
            <h2>Trabajos de la organización</h2>
            {trabajos.length === 0 ? (
              <p>No hay trabajos para mostrar.</p>
            ) : (
              <div className="trabajos-table-wrapper">
                <table>
                  <thead>
                    <tr>
                      <th>Descripción</th>
                      <th>Inicio</th>
                      <th>Fin</th>
                      <th>Lote y campaña</th>
                      <th>Insumo</th>
                      <th>Usuario</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {trabajos.map((trabajo) => (
                      <tr key={trabajo.id}>
                        <td>{trabajo.descripcion}</td>
                        <td>{trabajo.fechaInicio.slice(0, 10)}</td>
                        <td>{trabajo.fechaFin.slice(0, 10)}</td>
                        <td>{loteCampaniaNombre(trabajo.loteCampania)}</td>
                        <td>{insumoNombre(trabajo.insumo)}</td>
                        <td>{usuarioNombre(trabajo.usuario)}</td>
                        <td className="trabajos-row-actions">
                          <button
                            type="button"
                            onClick={() => editTrabajo(trabajo)}
                          >
                            Editar
                          </button>
                          <button
                            type="button"
                            className="trabajos-delete"
                            onClick={() => void handleDelete(trabajo)}
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

export default Trabajos;
