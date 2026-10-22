import './menu.css';
import { Link } from 'react-router-dom';
import LogoutButton from '../../components/LogoutButton';

function Menu() {
  return (
    <div className="Pagina">
      <div className="container">
        <div className="page-actions page-actions-end">
          <LogoutButton />
        </div>
        <h1 className="title">MENU</h1>
        <div className="padre">
          {/* <Link to="/campania" className="button">
            Consultar campaña
          </Link> */}
          {/* <Link to="/trabajo" className="button">
            Asignar trabajo
          </Link> */}
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
          <Link to="/usuarios-organizacion" className="button">
            Usuarios organización
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Menu;
