import { useState } from 'react';
import './deleteinsumos.css';
import { deleteInsumo, getInsumo, type Insumo } from '../../api/insumos';
import { Link } from 'react-router-dom';
import BackToMenu from '../../components/BackToMenu.js';

function DeleteInsumos() {
  const [nombre, setNombre] = useState('');
  const [resultados, setResultados] = useState<Insumo[]>([]);
  const [buscado, setBuscado] = useState(false);

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const insumos = await getInsumo();
      const texto = nombre.trim().toLowerCase();

      setResultados(
        insumos.filter(
          (i) =>
            i.id.toString().includes(texto) ||
            i.nombre.toLowerCase().includes(texto) ||
            i.descripcion.toLowerCase().includes(texto) ||
            i.tipo.toLowerCase().includes(texto),
        ),
      );
      setBuscado(true);
    } catch (error) {
      console.error(error);
      alert('No se pudo realizar la búsqueda');
    }
  };
  const handleDelete = async (id: number) => {
    if (!window.confirm('¿Seguro que querés eliminar este insumo?')) return;

    try {
      await deleteInsumo(id);
      setResultados((prev) => prev.filter((i) => i.id !== id));
    } catch (error) {
      console.error(error);
      alert('No se pudo eliminar el insumo');
    }
  };

  return (
    <div className="Pagina">
      <div className="container">
        <BackToMenu />
        <h1 className="title">ELIMINAR INSUMOS</h1>
        <form onSubmit={handleSubmit}>
          <div className="padre">
            <input
              type="text"
              placeholder="Ingrese el nombre del insumo"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />
            <button type="submit" className="button">
              Buscar
            </button>
            <p>
              ¿Deseas agregar un insumo?{' '}
              <Link to="/insumos">Añadir Insumo</Link>
            </p>
          </div>
        </form>

        {buscado && (
          <div className="results">
            <h2 className="resultados-titulo">Resultados de la búsqueda:</h2>
            <table className="table">
              <thead>
                <tr>
                  <th>id</th>
                  <th>Nombre</th>
                  <th>Tipo</th>
                  <th>Stock</th>
                  <th>Descripción</th>
                </tr>
              </thead>
              <tbody>
                {resultados.map((i) => (
                  <tr key={i.id}>
                    <td>{i.id}</td>
                    <td>{i.nombre}</td>
                    <td>{i.tipo}</td>
                    <td>{i.stock}</td>
                    <td>{i.descripcion}</td>
                    <td>
                      <button
                        onClick={() => handleDelete(i.id)}
                        className="button delete"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
                {resultados.length === 0 && (
                  <tr>
                    <td colSpan={6}>No se encontraron insumos</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
        <div className="accion">
          <Link to="/menu" className="button">
            Volver
          </Link>
        </div>
      </div>
    </div>
  );
}

export default DeleteInsumos;
