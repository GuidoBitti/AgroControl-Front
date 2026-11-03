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
        <h1 className="title">MENÚ PRINCIPAL</h1>
        <div className="menu-groups">
          <section className="menu-group">
            <h2>Campañas</h2>
            <p>Organizá las campañas y consultá las que están en curso.</p>
            <div className="menu-group-links">
              <Link to="/campania/crear" className="menu-link">
                Crear campaña
              </Link>
              <Link to="/campania" className="menu-link">
                Buscar campañas
              </Link>
            </div>
          </section>

          <section className="menu-group">
            <h2>Insumos</h2>
            <p>Administrá el inventario de insumos de tu organización.</p>
            <div className="menu-group-links">
              <Link to="/insumos" className="menu-link">
                Ingresar y gestionar insumos
              </Link>
              <Link to="/search-insumos" className="menu-link">
                Buscar insumos
              </Link>
            </div>
          </section>

          <section className="menu-group">
            <h2>Lotes</h2>
            <p>Consultá los lotes existentes o ingresá uno nuevo.</p>
            <div className="menu-group-links">
              <Link to="/lotes" className="menu-link">
                Ingresar lotes
              </Link>
              <Link to="/search-lote" className="menu-link">
                Buscar lotes
              </Link>
            </div>
          </section>

          <section className="menu-group">
            <h2>Trabajos</h2>
            <p>Busca o asigna trabajos a los lotes de la organización.</p>
            <div className="menu-group-links">
              <Link to="/trabajo" className="menu-link">
                Asignar y gestionar trabajos
              </Link>
              <Link to="/search-trabajo" className="menu-link">
                Buscar trabajos
              </Link>
            </div>
          </section>

          <section className="menu-group">
            <h2>Organización</h2>
            <p>Gestioná los usuarios que pertenecen a tu organización.</p>
            <div className="menu-group-links">
              <Link to="/usuarios-organizacion" className="menu-link">
                Usuarios de la organización
              </Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default Menu;
