import { createContext, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = (data) => {
    console.log("🔒 Datos recibidos en el Login:", data);
    // 1. Guarda el token (si tu DTO de Java usa 'jwt' o 'token', aquí se aseguran ambos)
    localStorage.setItem("token", data.token || data.jwt);
  localStorage.setItem("nombre", data.nombreCompleto || data.nombre); // El nombre de la persona (Ej: "Juan Pérez")
  localStorage.setItem("username", data.username || data.identifier); // El nombre de usuario (Ej: "juan99")
  localStorage.setItem("rol", data.role || data.rol);
  localStorage.setItem("userId", data.id || data.userId || data.idUsuario); // El ID del usuario (Ej: "123")

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