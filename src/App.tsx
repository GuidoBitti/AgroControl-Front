import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Income from './pages/income/income';
import Record from './pages/record/record';
import Insumos from './pages/insumos/insumos';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Income />} />
        <Route path="/record" element={<Record />} />
        <Route path="/insumos" element={<Insumos />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
