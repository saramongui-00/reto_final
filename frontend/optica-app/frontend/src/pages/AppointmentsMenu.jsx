import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function AppointmentsMenu() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState({ nombre: "Invitado", rol: "SECRETARIO" });

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        const parsed = JSON.parse(userData);
        setUser(parsed);
      } catch (e) {
        console.error("Error parsing user data");
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div style={{
      minHeight: "100vh", background: "#f0f4f8",
      fontFamily: "'DM Sans', sans-serif",
    }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Playfair+Display:wght@600&display=swap" rel="stylesheet" />

      {/* Navbar */}
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
        <nav style={{ display: "flex", flexDirection: "column", gap: "10px", padding: "20px 0" }}>
          {user.rol?.toLowerCase() === "optometra" && (
            <>
              <button onClick={() => { navigate("/users"); setMenuOpen(false); }}
                style={{ background: "none", border: "none", color: "rgba(255,255,255,0.8)", padding: "12px 20px", fontSize: "14px", cursor: "pointer", textAlign: "left" }}
                onMouseEnter={(e) => { e.target.style.background = "rgba(255,255,255,0.1)"; e.target.style.color = "white"; e.target.style.paddingLeft = "24px"; }}
                onMouseLeave={(e) => { e.target.style.background = "none"; e.target.style.color = "rgba(255,255,255,0.8)"; e.target.style.paddingLeft = "20px"; }}>
                Gestionar Usuarios
              </button>
              <button onClick={() => { navigate("/appointments"); setMenuOpen(false); }}
                style={{ background: "rgba(255,255,255,0.15)", border: "none", color: "white", padding: "12px 20px", fontSize: "14px", cursor: "pointer", textAlign: "left" }}
                onMouseEnter={(e) => { e.target.style.background = "rgba(255,255,255,0.25)"; e.target.style.color = "white"; e.target.style.paddingLeft = "24px"; }}
                onMouseLeave={(e) => { e.target.style.background = "rgba(255,255,255,0.15)"; e.target.style.paddingLeft = "20px"; }}>
                Gestionar Citas
              </button>
              <button onClick={() => { navigate("/patient"); setMenuOpen(false); }}
                style={{ background: "none", border: "none", color: "rgba(255,255,255,0.8)", padding: "12px 20px", fontSize: "14px", cursor: "pointer", textAlign: "left" }}
                onMouseEnter={(e) => { e.target.style.background = "rgba(255,255,255,0.1)"; e.target.style.color = "white"; e.target.style.paddingLeft = "24px"; }}
                onMouseLeave={(e) => { e.target.style.background = "none"; e.target.style.color = "rgba(255,255,255,0.8)"; e.target.style.paddingLeft = "20px"; }}>
                Gestionar Pacientes
              </button>
              <button onClick={() => { navigate("/history"); setMenuOpen(false); }}
                style={{ background: "none", border: "none", color: "rgba(255,255,255,0.8)", padding: "12px 20px", fontSize: "14px", cursor: "pointer", textAlign: "left" }}
                onMouseEnter={(e) => { e.target.style.background = "rgba(255,255,255,0.1)"; e.target.style.color = "white"; e.target.style.paddingLeft = "24px"; }}
                onMouseLeave={(e) => { e.target.style.background = "none"; e.target.style.color = "rgba(255,255,255,0.8)"; e.target.style.paddingLeft = "20px"; }}>
                Consulta Médica
              </button>
            </>
          )}
          {user.rol?.toLowerCase() === "secretario" && (
            <>
              <button onClick={() => { navigate("/appointments"); setMenuOpen(false); }}
                style={{ background: "rgba(255,255,255,0.15)", border: "none", color: "white", padding: "12px 20px", fontSize: "14px", cursor: "pointer", textAlign: "left" }}
                onMouseEnter={(e) => { e.target.style.background = "rgba(255,255,255,0.25)"; e.target.style.color = "white"; e.target.style.paddingLeft = "24px"; }}
                onMouseLeave={(e) => { e.target.style.background = "rgba(255,255,255,0.15)"; e.target.style.paddingLeft = "20px"; }}>
                Gestionar Citas
              </button>
              <button onClick={() => { navigate("/patient"); setMenuOpen(false); }}
                style={{ background: "none", border: "none", color: "rgba(255,255,255,0.8)", padding: "12px 20px", fontSize: "14px", cursor: "pointer", textAlign: "left" }}
                onMouseEnter={(e) => { e.target.style.background = "rgba(255,255,255,0.1)"; e.target.style.color = "white"; e.target.style.paddingLeft = "24px"; }}
                onMouseLeave={(e) => { e.target.style.background = "none"; e.target.style.color = "rgba(255,255,255,0.8)"; e.target.style.paddingLeft = "20px"; }}>
                Gestionar Pacientes
              </button>
            </>
          )}
        </nav>
      </div>

      {menuOpen && (
        <div onClick={() => setMenuOpen(false)} style={{
          position: "fixed", top: "60px", left: "0",
          width: "100%", height: "calc(100vh - 60px)",
          background: "rgba(0,0,0,0.3)", zIndex: "99",
        }} />
      )}

      {/* Contenido principal - Dos opciones */}
      <div style={{ padding: "60px 40px", maxWidth: "1200px", margin: "0 auto" }}>
        <h1 style={{
          fontFamily: "'Playfair Display', serif",
          color: "#0a2540", fontSize: "32px",
          marginBottom: "16px", textAlign: "center",
        }}>
          Gestión de Citas
        </h1>
        <p style={{
          textAlign: "center", color: "#64748b",
          marginBottom: "48px", fontSize: "16px",
        }}>
          Seleccione una opción para continuar
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "40px", maxWidth: "900px", margin: "0 auto" }}>
          {/* Opción 1: Crear Cita */}
          <div
            onClick={() => navigate("/citas/nueva")}
            style={{
              background: "white", borderRadius: "16px", padding: "48px 32px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
              cursor: "pointer", transition: "all 0.3s ease",
              border: "2px solid transparent",
              textAlign: "center",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.12)";
              e.currentTarget.style.transform = "translateY(-4px)";
              e.currentTarget.style.borderColor = "#0d5c8f";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.08)";
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.borderColor = "transparent";
            }}
          >
            <div style={{
              fontSize: "56px", marginBottom: "20px",
              background: "linear-gradient(135deg, #0a2540 0%, #0d5c8f 100%)",
              width: "80px", height: "80px", borderRadius: "50%",
              display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto 20px auto",
            }}>
              <span style={{ fontSize: "40px" }}>📝</span>
            </div>
            <h2 style={{ fontSize: "24px", color: "#0a2540", marginBottom: "12px", fontFamily: "'Playfair Display', serif" }}>
              Crear Cita
            </h2>
            <p style={{ fontSize: "14px", color: "#64748b", lineHeight: "1.6", marginBottom: "16px" }}>
              Agendar una nueva cita para un paciente
            </p>
            <span style={{
              display: "inline-block", fontSize: "13px", color: "#0d5c8f",
              fontWeight: 500, marginTop: "8px",
            }}>
              Crear nueva →
            </span>
          </div>

          {/* Opción 2: Consultar Citas */}
          <div
            onClick={() => navigate("/citas/agenda")}
            style={{
              background: "white", borderRadius: "16px", padding: "48px 32px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
              cursor: "pointer", transition: "all 0.3s ease",
              border: "2px solid transparent",
              textAlign: "center",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.12)";
              e.currentTarget.style.transform = "translateY(-4px)";
              e.currentTarget.style.borderColor = "#0d5c8f";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.08)";
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.borderColor = "transparent";
            }}
          >
            <div style={{
              fontSize: "56px", marginBottom: "20px",
              background: "linear-gradient(135deg, #0a2540 0%, #0d5c8f 100%)",
              width: "80px", height: "80px", borderRadius: "50%",
              display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto 20px auto",
            }}>
              <span style={{ fontSize: "40px" }}>📅</span>
            </div>
            <h2 style={{ fontSize: "24px", color: "#0a2540", marginBottom: "12px", fontFamily: "'Playfair Display', serif" }}>
              Consultar Citas
            </h2>
            <p style={{ fontSize: "14px", color: "#64748b", lineHeight: "1.6", marginBottom: "16px" }}>
              Ver, buscar y administrar el calendario de citas
            </p>
            <span style={{
              display: "inline-block", fontSize: "13px", color: "#0d5c8f",
              fontWeight: 500, marginTop: "8px",
            }}>
              Ver agenda →
            </span>
          </div>
        </div>

        {/* Información adicional */}
        <div style={{
          marginTop: "60px", textAlign: "center",
          padding: "20px", background: "white",
          borderRadius: "12px", maxWidth: "600px",
          margin: "60px auto 0 auto",
        }}>
          <p style={{ fontSize: "13px", color: "#64748b" }}>
            💡 Las citas pueden ser programadas con hasta 30 días de anticipación.
            <br />
            Recuerde verificar la disponibilidad del paciente antes de agendar.
          </p>
        </div>
      </div>
    </div>
  );
}

export default AppointmentsMenu;