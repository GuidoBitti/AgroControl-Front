import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Income from './pages/income/income';
import Record from './pages/record/record';
import Insumos from './pages/insumos/insumos';
import SearchInsumos from './pages/search-insumos/searchinsumos';
import SearchLote from './pages/search-lote/search-lote.tsx';
import Lotes from './pages/lotes/lotes.tsx';
import Menu from './pages/menu/menu.tsx';
import ProtectedRoute from './components/ProtectedRoute.tsx';
import AsignarTrabajo from './pages/trabajo/trabajo.tsx';
import UsuariosOrganizacion from './pages/usuarios-organizacion/usuarios-organizacion.tsx';
import Campania from './pages/campania/campania.tsx';
import CampaniaDetalle from './pages/campania/detalle-campania.tsx';
import CrearCampania from './pages/campania/crear-campania.tsx';
import SearchTrabajos from './pages/search-trabajo/search-trabajo.tsx';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Income />} />
        <Route
          path="/menu"
          element={
            <ProtectedRoute>
              <Menu />
            </ProtectedRoute>
          }
        />
        <Route path="/record" element={<Record />} />
        <Route
          path="/insumos"
          element={
            <ProtectedRoute>
              <Insumos />
            </ProtectedRoute>
          }
        />
        <Route
          path="/search-insumos"
          element={
            <ProtectedRoute>
              <SearchInsumos />
            </ProtectedRoute>
          }
        />
        <Route
          path="/search-lote"
          element={
            <ProtectedRoute>
              <SearchLote />
            </ProtectedRoute>
          }
        />
        <Route
          path="/lotes"
          element={
            <ProtectedRoute>
              <Lotes />
            </ProtectedRoute>
          }
        />
        <Route
          path="/campania"
          element={
            <ProtectedRoute>
              <Campania />
            </ProtectedRoute>
          }
        />
        <Route
          path="/campania/crear"
          element={
            <ProtectedRoute>
              <CrearCampania />
            </ProtectedRoute>
          }
        />
        <Route
          path="/campania/:id"
          element={
            <ProtectedRoute>
              <CampaniaDetalle />
            </ProtectedRoute>
          }
        />
        <Route
          path="/trabajo"
          element={
            <ProtectedRoute>
              <AsignarTrabajo />
            </ProtectedRoute>
          }
        />
        <Route
          path="/search-trabajo"
          element={
            <ProtectedRoute>
              <SearchTrabajos />
            </ProtectedRoute>
          }
        />
        <Route
          path="/usuarios-organizacion"
          element={
            <ProtectedRoute>
              <UsuariosOrganizacion />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
