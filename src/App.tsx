import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Income from './pages/income/income';
import Record from './pages/record/record';
import Insumos from './pages/insumos/insumos';
import SearchInsumos from './pages/search-insumos/searchinsumos';
import SearchLote from './pages/search-lote/search-lote.tsx';
import Lotes from './pages/lotes/lotes.tsx';
import DeleteInsumos from './pages/delete-insumos/deleteinsumos.tsx';
import Menu from './pages/menu/menu.tsx';
import Campania from './pages/campania/campania.tsx';
import CampaniaDetalle from './pages/campania/detalle-campania.tsx';
import AsignarTrabajo from './pages/trabajo/trabajo.tsx';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Income />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/record" element={<Record />} />
        <Route path="/insumos" element={<Insumos />} />
        <Route path="/search-insumos" element={<SearchInsumos />} />
        <Route path="/search-lote" element={<SearchLote />} />
        <Route path="/lotes" element={<Lotes />} />
        <Route path="/delete-insumos" element={<DeleteInsumos />} />
        <Route path="/campania" element={<Campania />} />
        <Route path="/campania/:id" element={<CampaniaDetalle />} />{' '}
        <Route path="/trabajo/" element={<AsignarTrabajo />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
