import { useEffect, useState } from "react";
import { getUser } from "../api/user.api";
import { useNavigate } from "react-router-dom";

function User() {
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      getUser(payload.id).then(setUser);
    }
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  if (!user) return (
    <div style={{
      minHeight: "100vh", display: "flex",
      alignItems: "center", justifyContent: "center",
      fontFamily: "'DM Sans', sans-serif", background: "#f0f4f8",
    }}>
      <div style={{ color: "#64748b" }}>Cargando...</div>
    </div>
  );

  return (
    <div style={{
      minHeight: "100vh", background: "#f0f4f8",
      fontFamily: "'DM Sans', sans-serif",
    }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Playfair+Display:wght@600&display=swap" rel="stylesheet" />

      <nav style={{
        background: "#0a2540", padding: "0 40px",
        height: "60px", display: "flex",
        alignItems: "center", justifyContent: "space-between",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            style={{
              background: "none",
              border: "none",
              color: "white",
              fontSize: "24px",
              cursor: "pointer",
              padding: "5px",
            }}
          >
            ☰
          </button>
          <span style={{
            fontFamily: "'Playfair Display', serif",
            color: "white", fontSize: "18px",
          }}>
            Óptica ISIS
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <span style={{ color: "rgba(255,255,255,0.6)", fontSize: "14px" }}>
            {user.nombre}
          </span>
          <button
            onClick={handleLogout}
            style={{
              background: "rgba(255,255,255,0.1)",
              border: "1px solid rgba(255,255,255,0.2)",
              color: "white", padding: "6px 16px",
              borderRadius: "6px", fontSize: "13px",
              cursor: "pointer",
            }}
          >
            Cerrar sesión
          </button>
        </div>
      </nav>

      {/* Sidebar */}
      <div style={{
        position: "fixed",
        top: "60px",
        left: "0",
        width: "250px",
        height: "calc(100vh - 60px)",
        background: "#1a3a52",
        boxShadow: "2px 0 8px rgba(0,0,0,0.15)",
        transform: menuOpen ? "translateX(0)" : "translateX(-100%)",
        transition: "transform 0.3s ease",
        zIndex: "100",
        overflow: "auto",
      }}>
        <nav style={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          padding: "20px 0",
        }}>
          {user.rol?.toLowerCase() === "optometra" && (
            <>
              <button
                onClick={() => {
                  navigate("/users");
                  setMenuOpen(false);
                }}
                style={{
                  background: "none",
                  border: "none",
                  color: "rgba(255,255,255,0.8)",
                  padding: "12px 20px",
                  fontSize: "14px",
                  cursor: "pointer",
                  textAlign: "left",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = "rgba(255,255,255,0.1)";
                  e.target.style.color = "white";
                  e.target.style.paddingLeft = "24px";
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = "none";
                  e.target.style.color = "rgba(255,255,255,0.8)";
                  e.target.style.paddingLeft = "20px";
                }}
              >
                Gestionar Usuarios
              </button>
              <button
                onClick={() => {
                  navigate("/appointments");
                  setMenuOpen(false);
                }}
                style={{
                  background: "none",
                  border: "none",
                  color: "rgba(255,255,255,0.8)",
                  padding: "12px 20px",
                  fontSize: "14px",
                  cursor: "pointer",
                  textAlign: "left",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = "rgba(255,255,255,0.1)";
                  e.target.style.color = "white";
                  e.target.style.paddingLeft = "24px";
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = "none";
                  e.target.style.color = "rgba(255,255,255,0.8)";
                  e.target.style.paddingLeft = "20px";
                }}
              >
                Gestionar Citas
              </button>
              <button
                onClick={() => {
                  navigate("/patient");
                  setMenuOpen(false);
                }}
                style={{
                  background: "none",
                  border: "none",
                  color: "rgba(255,255,255,0.8)",
                  padding: "12px 20px",
                  fontSize: "14px",
                  cursor: "pointer",
                  textAlign: "left",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = "rgba(255,255,255,0.1)";
                  e.target.style.color = "white";
                  e.target.style.paddingLeft = "24px";
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = "none";
                  e.target.style.color = "rgba(255,255,255,0.8)";
                  e.target.style.paddingLeft = "20px";
                }}
              >
                Gestionar Pacientes
              </button>
            </>
          )}

          {user.rol?.toLowerCase() === "secretario" && (
            <>
              <button
                onClick={() => {
                  navigate("/users");
                  setMenuOpen(false);
                }}
                style={{
                  background: "none",
                  border: "none",
                  color: "rgba(255,255,255,0.8)",
                  padding: "12px 20px",
                  fontSize: "14px",
                  cursor: "pointer",
                  textAlign: "left",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = "rgba(255,255,255,0.1)";
                  e.target.style.color = "white";
                  e.target.style.paddingLeft = "24px";
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = "none";
                  e.target.style.color = "rgba(255,255,255,0.8)";
                  e.target.style.paddingLeft = "20px";
                }}
              >
                Consultar Usuarios
              </button>
              <button
                onClick={() => {
                  navigate("/appointments");
                  setMenuOpen(false);
                }}
                style={{
                  background: "none",
                  border: "none",
                  color: "rgba(255,255,255,0.8)",
                  padding: "12px 20px",
                  fontSize: "14px",
                  cursor: "pointer",
                  textAlign: "left",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = "rgba(255,255,255,0.1)";
                  e.target.style.color = "white";
                  e.target.style.paddingLeft = "24px";
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = "none";
                  e.target.style.color = "rgba(255,255,255,0.8)";
                  e.target.style.paddingLeft = "20px";
                }}
              >
                Consultar Citas
              </button>
              <button
                onClick={() => {
                  navigate("/patient");
                  setMenuOpen(false);
                }}
                style={{
                  background: "none",
                  border: "none",
                  color: "rgba(255,255,255,0.8)",
                  padding: "12px 20px",
                  fontSize: "14px",
                  cursor: "pointer",
                  textAlign: "left",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = "rgba(255,255,255,0.1)";
                  e.target.style.color = "white";
                  e.target.style.paddingLeft = "24px";
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = "none";
                  e.target.style.color = "rgba(255,255,255,0.8)";
                  e.target.style.paddingLeft = "20px";
                }}
              >
                Consultar Pacientes
              </button>
            </>
          )}

          {user.rol && user.rol?.toLowerCase() !== "optometra" && user.rol?.toLowerCase() !== "secretario" && (
            <div style={{
              color: "rgba(255,255,255,0.6)",
              padding: "12px 20px",
              fontSize: "14px",
            }}>
              Rol no reconocido: {user.rol}
            </div>
          )}
        </nav>
      </div>

      {/* Overlay para cerrar sidebar */}
      {menuOpen && (
        <div
          onClick={() => setMenuOpen(false)}
          style={{
            position: "fixed",
            top: "60px",
            left: "0",
            width: "100%",
            height: "calc(100vh - 60px)",
            background: "rgba(0,0,0,0.3)",
            zIndex: "99",
          }}
        />
      )}

      <div style={{ 
        padding: "40px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "calc(100vh - 60px)",
      }}>
        <h1 style={{
          fontFamily: "'Playfair Display', serif",
          color: "#0a2540", fontSize: "26px",
          marginBottom: "24px",
          textAlign: "center",
        }}>
          Perfil de usuario
        </h1>

        <div style={{
          background: "white", borderRadius: "14px",
          padding: "28px", maxWidth: "500px", width: "100%",
          boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
        }}>
          <div style={{
            width: "56px", height: "56px", borderRadius: "50%",
            background: "#0a2540", display: "flex",
            alignItems: "center", justifyContent: "center",
            color: "white", fontSize: "20px", fontWeight: 600,
            marginBottom: "20px",
            margin: "0 auto 20px auto",
          }}>
            {user.nombre?.charAt(0).toUpperCase()}
          </div>

          {[
            ["Nombre", user.nombre],
            ["Usuario", user.user],
            ["Email", user.email],
            ["Celular", user.celular],
            ["Rol", user.rol],
            ["Estado", user.estado],
          ].map(([label, value]) => (
            <div key={label} style={{
              display: "flex", justifyContent: "space-between",
              padding: "12px 0",
              borderBottom: "1px solid #f1f5f9",
            }}>
              <span style={{ color: "#64748b", fontSize: "14px" }}>{label}</span>
              <span style={{
                color: label === "Rol" ? "#0d5c8f" : "#0a2540",
                fontSize: "14px", fontWeight: 500,
              }}>
                {value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default User;