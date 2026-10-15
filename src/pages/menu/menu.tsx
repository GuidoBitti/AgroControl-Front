import './menu.css';
import { Link } from 'react-router-dom';

function Menu() {
  return (
    <div className="Pagina">
      <div className="container">
        <h1 className="title">MENU</h1>
        <div className="padre">
          <Link to="/insumos" className="button">
            Ingresar Insumos
          </Link>
          <Link to="/search-insumos" className="button">
            Buscar Insumos
          </Link>
          <Link to="/delete-insumos" className="button">
            Eliminar Insumos
          </Link>
          <Link to="/search-lote" className="button">
            Buscar Lotes
          </Link>
          <Link to="/lotes" className="button">
            Ingresar Lotes
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Menu;
