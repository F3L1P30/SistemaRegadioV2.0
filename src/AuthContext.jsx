import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [valorRol, setValorRol] = useState(null);
  const navigate = useNavigate(); 
  const [estaCargando, setEstaCargando] = useState(true);

  // Verifica si el usuario está autenticado cuando se carga la página
  useEffect(() => {
    const storedUser = localStorage.getItem('authUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      rol(JSON.parse(storedUser));
    }
    setEstaCargando(false); 
  }, []);
  

  // Implementa la lógica de inicio de sesion
  const login = (dataUsuario) => {
    console.log("iniciar sesion exitoso");
    setUser(dataUsuario);
    localStorage.setItem('authUser', JSON.stringify(dataUsuario));
    navigate('/Inicio', { replace: true });
  };

  // Implementa la lógica de cierre de sesión 
  const logout = () => {
    console.log("cerrar sesion exitoso");
    setUser(null);
    localStorage.removeItem('authUser');
    navigate('/InicioSesion', { replace: true });
  };

  const rol = (data) => {
    if (data.rol === 0) {
        // El usuario es un administrador
        setValorRol(0);
    } else {
        // El usuario es un usuario normal
        setValorRol(1);;
    }
  };

  if (estaCargando) {
    return <div>Cargando...</div>;
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, rol, valorRol }}>
      {children}
    </AuthContext.Provider>
  );
}

// acceder al contexto de autenticación
export function useAuth() {
  return useContext(AuthContext);
}