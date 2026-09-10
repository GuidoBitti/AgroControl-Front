import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Income from './pages/income/income';
import Record from './pages/record/record';
import Insumos from './pages/insumos/insumos';
import SearchInsumos from './pages/search-insumos/searchinsumos';
import SearchLote from './pages/search-lote/search-lote.tsx';
import Lotes from './lotes/lotes.tsx';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Income />} />
        <Route path="/record" element={<Record />} />
        <Route path="/insumos" element={<Insumos />} />
        <Route path="/search-insumos" element={<SearchInsumos />} />
        <Route path="/search-lote" element={<SearchLote />} />
        <Route path="/lotes" element={<Lotes />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
