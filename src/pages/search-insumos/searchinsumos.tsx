import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import './searchinsumos.css';
import {
  deleteInsumo,
  getInsumo,
  updateInsumo,
  type Insumo,
} from '../../api/insumos';
import BackToMenu from '../../components/BackToMenu.js';
import '../../components/RecordCards.css';

function SearchInsumos() {
  const [nombre, setNombre] = useState('');
  const [insumos, setInsumos] = useState<Insumo[]>([]);
  const [resultados, setResultados] = useState<Insumo[]>([]);
  const [cantidades, setCantidades] = useState<Record<number, string>>({});
  const [buscado, setBuscado] = useState(false);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<number | null>(null);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  useEffect(() => {
    async function cargarInsumos() {
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
            : 'No se pudieron cargar los insumos.',
        );
      } finally {
        setLoading(false);
      }
    }

    void cargarInsumos();
  }, []);

  const buscarInsumos = (texto: string) => {
    const busqueda = texto.trim().toLowerCase();

    return insumos.filter(
      (insumo) =>
        insumo.id.toString().includes(busqueda) ||
        insumo.nombre.toLowerCase().includes(busqueda) ||
        insumo.descripcion.toLowerCase().includes(busqueda) ||
        insumo.tipo.toLowerCase().includes(busqueda),
    );
  };

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setNotice('');

    setResultados(buscarInsumos(nombre));
    setBuscado(true);
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
        current.map((item) => item.id === insumo.id ? actualizado : item),
      );
      setResultados((current) =>
        current.map((item) =>
          item.id === insumo.id ? actualizado : item,
        ),
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
      setInsumos((current) =>
        current.filter((item) => item.id !== insumo.id),
      );
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

  return (
    <div className="Pagina">
      <div className="container search-insumos-page">
        <BackToMenu />
        <h1 className="title">BÚSQUEDA DE INSUMOS</h1>
        <form onSubmit={handleSubmit}>
          <div className="padre">
            <input
              type="text"
              placeholder="Ingrese el nombre del insumo"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />
            <p>
              ¿Desea agregar un nuevo insumo?{' '}
              <Link to="/insumos">Agregar Insumo</Link>
            </p>
            <button type="submit" className="button" disabled={loading}>
              {loading ? 'Cargando insumos...' : 'Buscar'}
            </button>
          </div>
        </form>
        {error && (
          <p
            className="search-insumos-feedback search-insumos-error"
            role="alert"
          >
            {error}
          </p>
        )}
        {notice && (
          <p
            className="search-insumos-feedback search-insumos-success"
            role="status"
          >
            {notice}
          </p>
        )}
        {loading && <p role="status">Cargando insumos...</p>}
        {buscado && (
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
                          <span className="record-card-detail-label">Tipo:</span>
                          {i.tipo}
                        </span>
                        <span className="record-card-detail">
                          <span className="record-card-detail-label">Stock:</span>
                          {i.stock}
                        </span>
                        <span className="record-card-detail">
                          <span className="record-card-detail-label">Descripción:</span>
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
        )}
      </div>
    </div>
  );
}

export default SearchInsumos;
