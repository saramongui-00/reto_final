import { createContext, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = (data) => {
    // 1. Guarda el token (si tu DTO de Java usa 'jwt' o 'token', aquí se aseguran ambos)
    localStorage.setItem("token", data.token || data.jwt);
    
    // 2. Si el backend manda 'username', lo guarda como 'nombre' en el localStorage
    localStorage.setItem("nombre", data.username || data.nombre);
    
    // 3. Si el backend manda 'role', lo guarda como 'rol' en el localStorage
    localStorage.setItem("rol", data.role || data.rol);
    
    setUser(data);
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};