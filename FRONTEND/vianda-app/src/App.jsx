import './App.css'
import Comidas from './pages/Comidas'
import Venta from './pages/Venta'
import Clientes from './pages/Clientes'
import Pedidos from './pages/Pedidos'
import HistorialVentas from './pages/HistorialVentas'
import Navbar from './components/Navbar'
import Login from './pages/Login'

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'

function App() {

  return (
    <>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/venta" element={<Venta />} />
          <Route path="/comidas" element={<Comidas />} />
          <Route path="/clientes" element={<Clientes />} />
          <Route path="/pedidos" element={<Pedidos />} />
          <Route path="/historial-ventas" element={<HistorialVentas />} />

        </Routes>
      </Router>
    </>
  )
}

export default App
