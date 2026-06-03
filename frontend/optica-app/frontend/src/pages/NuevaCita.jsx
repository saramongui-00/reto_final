import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createCita } from "../api/citas.api";

export default function NuevaCita() {
  const [user, setUser] = useState({ nombre: "Invitado", rol: "OPTOMETRA" });
  const [menuOpen, setMenuOpen] = useState(false);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [patientId, setPatientId] = useState("");
  const [banner, setBanner] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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
    navigate("/login");
  };

  const clearForm = () => {
    setDate("");
    setTime("");
    setPatientId("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setBanner(null);
    setLoading(true);
    const appointment = time ? `${time}:00` : "00:00:00";
    const payload = { date, appointment, patientId };

    try {
      const data = await createCita(payload);
      clearForm();
      setBanner({ type: "success", text: "Cita creada correctamente." });
      setTimeout(() => setBanner(null), 4000);
    } catch (err) {
      console.error("createCita error:", err);
      
      const status = err.response?.status; 
      
      if (status === 400 || status === 500) {
        setBanner({ type: "error", text: "Error: El paciente con ese documento no existe en el sistema" });
      } else {
        const detail = err.response?.data?.message || err.message || 'Error al comunicarse con el servidor.';
        setBanner({ type: "error", text: `Error: ${detail}` });
      }
    } finally {
      setLoading(false);
    }
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
                onMouseEnter={(e) => { e.target.style.background = "rgba(255,255,255,0.25)"; e.target.style.paddingLeft = "24px"; }}
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
        </nav>
      </div>

      {menuOpen && (
        <div onClick={() => setMenuOpen(false)} style={{
          position: "fixed", top: "60px", left: "0",
          width: "100%", height: "calc(100vh - 60px)",
          background: "rgba(0,0,0,0.3)", zIndex: "99",
        }} />
      )}

      {/* Contenido principal */}
      <div style={{ padding: "30px 40px", maxWidth: "800px", margin: "0 auto" }}>
        <h1 style={{
          fontFamily: "'Playfair Display', serif",
          color: "#0a2540", fontSize: "26px",
          marginBottom: "24px",
        }}>
          Nueva Cita
        </h1>

        {/* Banner de notificaciones */}
        {banner && (
          <div style={{
            background: banner.type === "success" ? "#d4edda" : "#fee2e2",
            color: banner.type === "success" ? "#155724" : "#991b1b",
            padding: "12px 16px", borderRadius: "8px", marginBottom: "20px",
            border: `1px solid ${banner.type === "success" ? "#c3e6cb" : "#fecaca"}`,
          }}>
            {banner.text}
          </div>
        )}

        {/* Formulario de creación */}
        <div style={{ background: "white", borderRadius: "12px", padding: "24px" }}>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: "block", fontWeight: 500, marginBottom: "8px", color: "#0a2540" }}>
                Fecha
              </label>
              <input 
                type="date" 
                value={date} 
                onChange={(e) => setDate(e.target.value)} 
                required
                style={{
                  width: "100%", padding: "10px",
                  border: "1px solid #e2e8f0", borderRadius: "8px",
                  fontSize: "14px"
                }}
              />
            </div>

            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: "block", fontWeight: 500, marginBottom: "8px", color: "#0a2540" }}>
                Hora
              </label>
              <input 
                type="time" 
                value={time} 
                onChange={(e) => setTime(e.target.value)} 
                required
                style={{
                  width: "100%", padding: "10px",
                  border: "1px solid #e2e8f0", borderRadius: "8px",
                  fontSize: "14px"
                }}
              />
            </div>

            <div style={{ marginBottom: "24px" }}>
              <label style={{ display: "block", fontWeight: 500, marginBottom: "8px", color: "#0a2540" }}>
                Documento del Paciente
              </label>
              <input 
                type="text" 
                value={patientId} 
                onChange={(e) => setPatientId(e.target.value)} 
                required
                placeholder="Ingrese el documento del paciente"
                style={{
                  width: "100%", padding: "10px",
                  border: "1px solid #e2e8f0", borderRadius: "8px",
                  fontSize: "14px"
                }}
              />
            </div>

            <div style={{ display: "flex", gap: "16px" }}>
              <button 
                type="submit" 
                disabled={loading}
                style={{
                  flex: 1, padding: "12px", background: "#28a745",
                  color: "white", border: "none", borderRadius: "8px",
                  cursor: "pointer", fontWeight: 500, fontSize: "16px",
                  opacity: loading ? 0.7 : 1,
                }}
                onMouseEnter={e => !loading && (e.target.style.background = "#218838")}
                onMouseLeave={e => !loading && (e.target.style.background = "#28a745")}
              >
                {loading ? "Guardando..." : "Agendar Cita"}
              </button>
              
              <button 
                type="button"
                onClick={() => {
                  clearForm();
                  setBanner(null);
                }}
                style={{
                  flex: 1, padding: "12px", background: "#6c757d",
                  color: "white", border: "none", borderRadius: "8px",
                  cursor: "pointer", fontWeight: 500, fontSize: "16px",
                }}
                onMouseEnter={e => e.target.style.background = "#5a6268"}
                onMouseLeave={e => e.target.style.background = "#6c757d"}
              >
                Limpiar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}