import './insumos.css';
import { useEffect, useState } from 'react';
import BackToMenu from '../../components/BackToMenu.js';
import {
  getInsumo,
  deleteInsumo,
  createInsumo,
  updateInsumo,
  type Insumo,
} from '../../api/insumos.ts';

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

function Insumos() {
  const [insumos, setInsumos] = useState<Insumo[]>([]);
  const [form, setForm] = useState<FormValues>(emptyForm);
  const [editingId, setEditingId] = useState<number>();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  async function loadInsumos() {
    try {
      const data = await getInsumo();
      setInsumos(data);
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

  useEffect(() => {
    void loadInsumos();
  }, []);

  function editInsumo(insumo: Insumo) {
    setEditingId(insumo.id);
    setForm({
      nombre: insumo.nombre,
      descripcion: insumo.descripcion,
      stock: String(insumo.stock),
      tipo: insumo.tipo,
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
      if (editingId !== undefined) {
        await updateInsumo(editingId, insumoData);
        setNotice('Insumo actualizado correctamente.');
      } else {
        await createInsumo(insumoData);
        setNotice('Insumo creado correctamente.');
      }
      resetForm();
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

  async function handleDelete(insumo: Insumo) {
    if (!window.confirm(`¿Querés eliminar el insumo "${insumo.nombre}"?`))
      return;

    setError('');
    setNotice('');
    try {
      await deleteInsumo(insumo.id);
      setInsumos((current) => current.filter((item) => item.id !== insumo.id));
      setNotice('Insumo eliminado correctamente.');
    } catch (deleteError) {
      console.error(deleteError);
      setError(
        deleteError instanceof Error
          ? deleteError.message
          : 'No se pudo eliminar el insumo.',
      );
    }
  }

  return (
    <main className="container">
      <BackToMenu />
      <h1 className="title">INSUMOS</h1>

      {loading && <p role="status">Cargando insumos...</p>}
      {!loading && error && (
        <p className="insumos-feedback insumos-error" role="alert">
          {error}
        </p>
      )}
      {!loading && !error && (
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
            <h2>
              {editingId === undefined ? 'Agregar insumo' : 'Editar insumo'}
            </h2>
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
                    type="tipo"
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
                    type="stock"
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
                  {saving
                    ? 'Guardando...'
                    : editingId === undefined
                      ? 'Crear insumo'
                      : 'Guardar cambios'}
                </button>
                {editingId !== undefined && (
                  <button
                    type="button"
                    className="insumos-secondary"
                    onClick={resetForm}
                    disabled={saving}
                  >
                    Cancelar edición
                  </button>
                )}
              </div>
            </form>
          </section>

          <section className="insumos-list-section">
            <h2>Insumos de la organización</h2>
            {insumos.length === 0 ? (
              <p>No hay insumos para mostrar.</p>
            ) : (
              <div className="insumos-table-wrapper">
                <table>
                  <thead>
                    <tr>
                      <th>Nombre</th>
                      <th>Descripcion</th>
                      <th>Tipo</th>
                      <th>Stock</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {insumos.map((insumo) => (
                      <tr key={insumo.id}>
                        <td>{insumo.nombre}</td>
                        <td>{insumo.descripcion}</td>
                        <td>{insumo.tipo}</td>
                        <td>{insumo.stock}</td>
                        <td className="insumos-row-actions">
                          <button
                            type="button"
                            onClick={() => editInsumo(insumo)}
                          >
                            Editar
                          </button>
                          <button
                            type="button"
                            className="insumos-delete"
                            onClick={() => void handleDelete(insumo)}
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

export default Insumos;
