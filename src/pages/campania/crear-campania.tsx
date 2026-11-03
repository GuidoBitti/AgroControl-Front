import { useEffect, useState, type SubmitEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { createCampania } from '../../api/campania';
import { getUsuario, type Usuario } from '../../api/usuario';
import BackToMenu from '../../components/BackToMenu';
import './crear-campania.css';

type FormValues = {
  descripcion: string;
  fechaInicio: string;
  fechaFin: string;
};

const emptyForm: FormValues = {
  descripcion: '',
  fechaInicio: '',
  fechaFin: '',
};

function relationId(value: Usuario['organizacion']): number | undefined {
  if (typeof value === 'number') return value;
  return value?.id;
}

function CrearCampania() {
  const [form, setForm] = useState<FormValues>(emptyForm);
  const [organizacionId, setOrganizacionId] = useState<number>();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    async function loadOrganization() {
      try {
        const userId = Number(localStorage.getItem('userId'));
        if (!Number.isInteger(userId) || userId <= 0) {
          throw new Error('Iniciá sesión nuevamente para identificar al usuario.');
        }

        const users = await getUsuario();
        const currentUser = users.find((user) => user.id === userId);
        const id = currentUser && relationId(currentUser.organizacion);
        if (!id) {
          throw new Error('No se pudo identificar la organización del usuario.');
        }

        setOrganizacionId(id);
      } catch (loadError) {
        console.error(loadError);
        setError(
          loadError instanceof Error
            ? loadError.message
            : 'No se pudieron cargar los datos de la organización.',
        );
      } finally {
        setLoading(false);
      }
    }

    void loadOrganization();
  }, []);

  function updateForm(field: keyof FormValues, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
    setNotice('');
  }

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setNotice('');

    if (!organizacionId) {
      setError('No se pudo identificar la organización del usuario.');
      return;
    }

    if (!form.descripcion.trim() || !form.fechaInicio || !form.fechaFin) {
      setError('Completá todos los campos.');
      return;
    }

    if (form.fechaFin < form.fechaInicio) {
      setError('La fecha de fin no puede ser anterior a la fecha de inicio.');
      return;
    }

    setSaving(true);
    try {
      await createCampania({
        descripcion: form.descripcion.trim(),
        fechaInicio: form.fechaInicio,
        fechaFin: form.fechaFin,
        organizacion: organizacionId,
      });
      setForm(emptyForm);
      setNotice('Campaña creada correctamente.');
    } catch (saveError) {
      console.error(saveError);
      setError(
        saveError instanceof Error
          ? saveError.message
          : 'No se pudo crear la campaña.',
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="Pagina">
      <div className="container">
        <BackToMenu />
        <h2 className="title">CREAR CAMPAÑA</h2>
        {loading ? (
          <p role="status">Cargando datos de la organización...</p>
        ) : organizacionId ? (
          <form onSubmit={handleSubmit}>
            <div className="padre">
              <div className="crear-campania-field">
                <label htmlFor="descripcion">Descripción:</label>
                <textarea
                  id="descripcion"
                  value={form.descripcion}
                  onChange={(event) => updateForm('descripcion', event.target.value)}
                  maxLength={500}
                  rows={4}
                  required
                />
              </div>

              <div className="crear-campania-field">
                <label htmlFor="fechaInicio">Fecha de inicio:</label>
                <input
                  type="date"
                  id="fechaInicio"
                  value={form.fechaInicio}
                  onChange={(event) => updateForm('fechaInicio', event.target.value)}
                  required
                />
              </div>

              <div className="crear-campania-field">
                <label htmlFor="fechaFin">Fecha de fin:</label>
                <input
                  type="date"
                  id="fechaFin"
                  value={form.fechaFin}
                  min={form.fechaInicio || undefined}
                  onChange={(event) => updateForm('fechaFin', event.target.value)}
                  required
                />
              </div>

              <p className="crear-campania-organizacion">
                La campaña se asociará a la organización de tu usuario.
              </p>
            </div>

            {error && <p className="crear-campania-error" role="alert">{error}</p>}
            {notice && <p className="crear-campania-notice" role="status">{notice}</p>}

            <button type="submit" className="button" disabled={saving}>
              {saving ? 'Guardando...' : 'Crear campaña'}
            </button>
            <button
              type="button"
              className="crear-campania-cancel"
              onClick={() => navigate('/menu')}
              disabled={saving}
            >
              Cancelar
            </button>
          </form>
        ) : (
          <>
            <p className="crear-campania-error" role="alert">{error}</p>
            <button type="button" className="button" onClick={() => navigate('/menu')}>
              Volver al menú
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default CrearCampania;
