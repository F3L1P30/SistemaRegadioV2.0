import './css/index.css';
import { Routes, Route, Navigate } from 'react-router-dom';
import React from 'react';
import { AuthProvider } from './AuthContext';
import Inicio from './Inicio';
import Medidor from './Medidor';
import Contacto from './Contacto';
import Geo from './Geo';
import InicioSesion from './InicioSesion';
import Perfil from './Perfil';
import Administrador from './Administrador';
import RegistrarUsuario from './RegistrarUsuario';
import GestionarUsuarios from './GestionarUsuarios';
import { useAuth } from './AuthContext';


function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/InicioSesion" element={<InicioSesion />} />
        <Route path="/" element={<ProtectedRoute element={<Navigate to="/Inicio" replace />} />} />
        <Route path="/Inicio" element={<ProtectedRoute element={<Inicio />} />} />
        <Route path="/Medidor" element={<ProtectedRoute element={<Medidor />} />} />
        <Route path="/Contacto" element={<ProtectedRoute element={<Contacto />} />} />
        <Route path="/Geo" element={<ProtectedRoute element={<Geo />} />} />
        <Route path="/Perfil" element={<ProtectedRoute element={<Perfil />} />} />
        <Route path="/Administrador" element={<ProtectedRoute element={<Administrador />} />} />
        <Route path="/RegistrarUsuario" element={<ProtectedRoute element={<RegistrarUsuario />} />} />
        <Route path="/GestionarUsuarios" element={<ProtectedRoute element={<GestionarUsuarios />} />} />
      </Routes>
    </AuthProvider>
  );
}

// Componente para redirigir al usuario si no está autenticado
function ProtectedRoute({ element }) {
  const { user } = useAuth(); // Obtén el estado de autenticación desde el contexto
  
  return user ? element : <Navigate to="/InicioSesion" replace={true} />;
}

export default App;