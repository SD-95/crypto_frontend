import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'bootstrap/dist/css/bootstrap.min.css';
import App from './App';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import About from './template/About';
import Prediction_input from './template/Prediction_input';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter basename="/crypto_frontend/">
      <Routes>
        <Route path="/" element={<App />}>
        <Route index element={<Prediction_input />} />
        <Route path='home' element={<Prediction_input />} />
        <Route path="about" element={<About />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
