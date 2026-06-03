import { useState } from "react";
import { loginRequest } from "../api/auth.api";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

function Login() {
  // 🔥 CAMBIO 1: Cambiamos 'user' por 'username' para que coincida con el DTO de Spring Boot
  const [form, setForm] = useState({ identifier: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // 🔥 Validamos con 'username'
    if (!form.identifier.trim() || !form.password.trim()) {
      setError("Por favor completa todos los campos");
      return;
    }

    setLoading(true);
    try {
      const data = await loginRequest(form);
      
      // Aquí tu hook 'useAuth' recibe la data y guarda el token en el localStorage
      login(data);

      // 🔥 CAMBIO 2: Spring Boot devuelve 'role'. Usamos una alternativa por si acaso.
      const userRole = data.role || data.rol; 

      if (userRole === "OPTOMETRA") {
        navigate("/dashboard");
      } else {
        navigate("/user"); 
      }
    } catch (err) {
      // Si el backend responde con un error específico, lo mostramos, si no, el genérico
      setError(err.response?.data?.message || "Credenciales inválidas o error de conexión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      fontFamily: "'DM Sans', sans-serif",
      background: "#f0f4f8",
    }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Playfair+Display:wght@600&display=swap" rel="stylesheet" />

      {/* Panel izquierdo */}
      <div style={{
        width: "45%",
        background: "linear-gradient(160deg, #0a2540 0%, #1a3a5c 60%, #0d5c8f 100%)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "60px",
        position: "relative",
        overflow: "hidden",
      }}>
        {/* Círculos decorativos */}
        <div style={{
          position: "absolute", width: "400px", height: "400px",
          borderRadius: "50%", border: "1px solid rgba(255,255,255,0.07)",
          top: "-100px", right: "-100px",
        }} />
        <div style={{
          position: "absolute", width: "250px", height: "250px",
          borderRadius: "50%", border: "1px solid rgba(255,255,255,0.05)",
          bottom: "80px", left: "-60px",
        }} />
        <div style={{
          position: "absolute", width: "120px", height: "120px",
          borderRadius: "50%", background: "rgba(99,179,237,0.08)",
          bottom: "200px", right: "60px",
        }} />

        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: "10px",
            background: "rgba(255,255,255,0.08)", borderRadius: "50px",
            padding: "8px 16px", marginBottom: "48px",
          }}>
            <div style={{
              width: "8px", height: "8px", borderRadius: "50%",
              background: "#63b3ed",
            }} />
            <span style={{ color: "#a0c4e4", fontSize: "13px", letterSpacing: "0.5px" }}>
              Sistema Óptica
            </span>
          </div>

          <h1 style={{
            fontFamily: "'Playfair Display', serif",
            color: "white", fontSize: "42px",
            lineHeight: "1.2", marginBottom: "20px",
            fontWeight: 600,
          }}>
            Optica ISIS
          </h1>

          <p style={{
            color: "rgba(255,255,255,0.5)", fontSize: "15px",
            lineHeight: "1.7", maxWidth: "320px",
          }}>
            Plataforma integral para la gestión de citas, pacientes e historiales clínicos oftalmológicos.
          </p>

          <div style={{
            marginTop: "60px", display: "flex", gap: "32px",
          }}>
            {[["Citas", "Agendamiento"], ["Pacientes", "Registros"], ["Historial", "Clínico"]].map(([num, label]) => (
              <div key={num}>
                <div style={{ color: "#63b3ed", fontSize: "18px", fontWeight: 600 }}>{num}</div>
                <div style={{ color: "rgba(255,255,255,0.4)", fontSize: "12px", marginTop: "2px" }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Panel derecho */}
      <div style={{
        flex: 1, display: "flex", alignItems: "center",
        justifyContent: "center", padding: "60px",
      }}>
        <div style={{ width: "100%", maxWidth: "380px" }}>
          <h2 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "28px", color: "#0a2540",
            marginBottom: "8px", fontWeight: 600,
          }}>
            Bienvenido
          </h2>
          <p style={{ color: "#64748b", fontSize: "14px", marginBottom: "36px" }}>
            Ingresa tus credenciales para continuar
          </p>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: "20px" }}>
              <label style={{
                display: "block", fontSize: "12px", fontWeight: 500,
                color: "#475569", marginBottom: "8px", letterSpacing: "0.5px",
                textTransform: "uppercase",
              }}>
                Usuario
              </label>
              <input
                type="text"
                placeholder="usuario"
                style={{
                  width: "100%", padding: "12px 16px",
                  border: "1.5px solid #e2e8f0", borderRadius: "10px",
                  fontSize: "15px", color: "#0a2540",
                  outline: "none", boxSizing: "border-box",
                  transition: "border-color 0.2s",
                  background: "white",
                }}
                onFocus={e => e.target.style.borderColor = "#0d5c8f"}
                onBlur={e => e.target.style.borderColor = "#e2e8f0"}
                // 🔥 Aseguramos que actualice 'username' en el estado
                onChange={(e) => setForm({ ...form, identifier: e.target.value })}
              />
            </div>

            <div style={{ marginBottom: "28px" }}>
              <label style={{
                display: "block", fontSize: "12px", fontWeight: 500,
                color: "#475569", marginBottom: "8px", letterSpacing: "0.5px",
                textTransform: "uppercase",
              }}>
                Contraseña
              </label>
              <div style={{ position: "relative" }}>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  style={{
                    width: "100%", padding: "12px 16px", paddingRight: "44px",
                    border: "1.5px solid #e2e8f0", borderRadius: "10px",
                    fontSize: "15px", color: "#0a2540",
                    outline: "none", boxSizing: "border-box",
                    transition: "border-color 0.2s",
                    background: "white",
                  }}
                  onFocus={e => e.target.style.borderColor = "#0d5c8f"}
                  onBlur={e => e.target.style.borderColor = "#e2e8f0"}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                  style={{
                    position: "absolute",
                    right: "10px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    border: "none",
                    background: "transparent",
                    color: "#64748b",
                    cursor: "pointer",
                    fontSize: "16px",
                    padding: "4px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {showPassword ? "∎" : "◌"}
                </button>
              </div>
            </div>

            {error && (
              <div style={{
                background: "#fff5f5", border: "1px solid #fed7d7",
                borderRadius: "8px", padding: "10px 14px",
                color: "#c53030", fontSize: "13px", marginBottom: "20px",
              }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%", padding: "13px",
                background: loading ? "#94a3b8" : "#0a2540",
                color: "white", border: "none",
                borderRadius: "10px", fontSize: "15px",
                fontWeight: 500, cursor: loading ? "not-allowed" : "pointer",
                transition: "background 0.2s, transform 0.1s",
                fontFamily: "'DM Sans', sans-serif",
              }}
              onMouseEnter={e => { if (!loading) e.target.style.background = "#0d5c8f" }}
              onMouseLeave={e => { if (!loading) e.target.style.background = "#0a2540" }}
            >
              {loading ? "Ingresando..." : "Ingresar"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;