import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getCitasByPatient, searchCitasByRange, cancelCita } from "../api/citas.api";
import { prepararCita } from "../api/citas.api"; // Asegúrate de agregar esta función en tu API

export default function AgendaCitas() {
  const [user, setUser] = useState({ nombre: "Invitado", rol: "OPTOMETRA" });
  const [menuOpen, setMenuOpen] = useState(false);
  const [mode, setMode] = useState("paciente");
  const [patientId, setPatientId] = useState("");
  const [inicio, setInicio] = useState("");
  const [fin, setFin] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [confirmingId, setConfirmingId] = useState(null);
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

  const handleSearch = async (e) => {
    e && e.preventDefault();
    setLoading(true);
    setMessage(null);
    setResults([]);
    try {
      let data = [];
      if (mode === "paciente") {
        data = await getCitasByPatient(patientId);
      } else {
        data = await searchCitasByRange(inicio, fin);
      }

      if (!data || data.length === 0) {
        setMessage("No se encontraron citas para los criterios ingresados");
      } else {
        setResults(data);
      }
    } catch (err) {
      setMessage("Error al consultar las citas.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id) => {
    try {
      const updated = await cancelCita(id);
      setResults((prev) => prev.map(c => c.id === id ? { ...c, state: updated.state || 'CANCELADA' } : c));
      setMessage("Cita cancelada exitosamente");
      setTimeout(() => setMessage(null), 3000);
    } catch (err) {
      setMessage("Error al cancelar la cita.");
      setTimeout(() => setMessage(null), 4000);
    }
  };

  const handleConfirm = async (id) => {
    setConfirmingId(id);
    try {
      const updated = await prepararCita(id);
      setResults((prev) => prev.map(c => c.id === id ? { ...c, state: updated.state || 'LISTA_PARA_ATENCION' } : c));
      setMessage("Cita confirmada y lista para atención");
      setTimeout(() => setMessage(null), 3000);
    } catch (err) {
      console.error("Error al confirmar cita:", err);
      const errorMsg = err.response?.data?.message || "Error al confirmar la cita";
      setMessage(`Error: ${errorMsg}`);
      setTimeout(() => setMessage(null), 4000);
    } finally {
      setConfirmingId(null);
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
          {user.rol?.toLowerCase() === "secretario" && (
            <>
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
      <div style={{ padding: "30px 40px", maxWidth: "1200px", margin: "0 auto" }}>
        <h1 style={{
          fontFamily: "'Playfair Display', serif",
          color: "#0a2540", fontSize: "26px",
          marginBottom: "24px",
        }}>
          Gestión de Citas
        </h1>

        {/* Formulario de búsqueda */}
        <div style={{ background: "white", borderRadius: "12px", padding: "24px", marginBottom: "24px" }}>
          <form onSubmit={handleSearch}>
            <div style={{ display: "flex", gap: "24px", marginBottom: "20px", flexWrap: "wrap" }}>
              <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
                <input 
                  type="radio" 
                  name="mode" 
                  checked={mode === 'paciente'} 
                  onChange={() => setMode('paciente')} 
                />
                <span style={{ color: "#0a2540" }}>Buscar por Documento</span>
              </label>
              <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
                <input 
                  type="radio" 
                  name="mode" 
                  checked={mode === 'rango'} 
                  onChange={() => setMode('rango')} 
                />
                <span style={{ color: "#0a2540" }}>Buscar por Rango de Fechas</span>
              </label>
            </div>

            {mode === 'paciente' ? (
              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", fontWeight: 500, marginBottom: "8px", color: "#0a2540" }}>
                  Documento del Paciente
                </label>
                <input 
                  type="text" 
                  value={patientId} 
                  onChange={(e) => setPatientId(e.target.value)}
                  style={{
                    width: "100%", maxWidth: "400px", padding: "10px",
                    border: "1px solid #e2e8f0", borderRadius: "8px",
                    fontSize: "14px"
                  }}
                  placeholder="Ingrese el documento del paciente"
                />
              </div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px", maxWidth: "600px" }}>
                <div>
                  <label style={{ display: "block", fontWeight: 500, marginBottom: "8px", color: "#0a2540" }}>
                    Fecha inicio
                  </label>
                  <input 
                    type="date" 
                    value={inicio} 
                    onChange={(e) => setInicio(e.target.value)}
                    style={{
                      width: "100%", padding: "10px",
                      border: "1px solid #e2e8f0", borderRadius: "8px",
                      fontSize: "14px"
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontWeight: 500, marginBottom: "8px", color: "#0a2540" }}>
                    Fecha fin
                  </label>
                  <input 
                    type="date" 
                    value={fin} 
                    onChange={(e) => setFin(e.target.value)}
                    style={{
                      width: "100%", padding: "10px",
                      border: "1px solid #e2e8f0", borderRadius: "8px",
                      fontSize: "14px"
                    }}
                  />
                </div>
              </div>
            )}

            <button 
              type="submit" 
              disabled={loading}
              style={{
                padding: "10px 24px", background: "#0d5c8f",
                color: "white", border: "none", borderRadius: "8px",
                cursor: "pointer", fontWeight: 500, fontSize: "14px",
                opacity: loading ? 0.7 : 1,
              }}
              onMouseEnter={e => !loading && (e.target.style.background = "#0a4a70")}
              onMouseLeave={e => !loading && (e.target.style.background = "#0d5c8f")}
            >
              {loading ? 'Buscando...' : 'Buscar'}
            </button>
          </form>
        </div>

        {/* Mensajes */}
        {message && (
          <div style={{
            background: message.includes("Error") ? "#fee2e2" : "#d4edda",
            color: message.includes("Error") ? "#991b1b" : "#155724",
            padding: "12px 16px", borderRadius: "8px", marginBottom: "20px",
            border: `1px solid ${message.includes("Error") ? "#fecaca" : "#c3e6cb"}`
          }}>
            {message}
          </div>
        )}

        {/* Tabla de resultados */}
        {results.length > 0 && (
          <div style={{ background: "white", borderRadius: "12px", overflow: "auto" }}>
            <table style={{
              width: "100%", borderCollapse: "collapse",
              fontFamily: "'DM Sans', sans-serif",
            }}>
              <thead style={{ background: "#f8fafc" }}>
                <tr>
                  <th style={{ padding: "16px", textAlign: "left", color: "#0a2540", fontWeight: 600, borderBottom: "1px solid #e2e8f0" }}>Fecha</th>
                  <th style={{ padding: "16px", textAlign: "left", color: "#0a2540", fontWeight: 600, borderBottom: "1px solid #e2e8f0" }}>Hora</th>
                  <th style={{ padding: "16px", textAlign: "left", color: "#0a2540", fontWeight: 600, borderBottom: "1px solid #e2e8f0" }}>Paciente</th>
                  <th style={{ padding: "16px", textAlign: "left", color: "#0a2540", fontWeight: 600, borderBottom: "1px solid #e2e8f0" }}>Estado</th>
                  <th style={{ padding: "16px", textAlign: "left", color: "#0a2540", fontWeight: 600, borderBottom: "1px solid #e2e8f0" }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {results.map(c => (
                  <tr key={c.id} style={{ borderBottom: "1px solid #e2e8f0" }}>
                    <td style={{ padding: "16px", color: "#334155" }}>{c.date}</td>
                    <td style={{ padding: "16px", color: "#334155" }}>{c.appointment}</td>
                    <td style={{ padding: "16px", color: "#334155" }}>{c.patientId}</td>
                    <td style={{ padding: "16px" }}>
                      <span style={{
                        display: "inline-block", padding: "4px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: 500,
                        background: c.state === 'PROGRAMADA' ? '#d4edda' : c.state === 'CANCELADA' ? '#fee2e2' : c.state === 'LISTA_PARA_ATENCION' ? '#cce5ff' : '#fff3cd',
                        color: c.state === 'PROGRAMADA' ? '#155724' : c.state === 'CANCELADA' ? '#991b1b' : c.state === 'LISTA_PARA_ATENCION' ? '#004085' : '#856404',
                      }}>
                        {c.state === 'LISTA_PARA_ATENCION' ? 'LISTA PARA ATENCIÓN' : c.state}
                      </span>
                    </td>
                    <td style={{ padding: "16px" }}>
                      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                        {c.state === 'PROGRAMADA' && (
                          <>
                            <button 
                              onClick={() => handleConfirm(c.id)}
                              disabled={confirmingId === c.id}
                              style={{
                                padding: "6px 16px", background: "#28a745",
                                color: "white", border: "none", borderRadius: "6px",
                                cursor: confirmingId === c.id ? "wait" : "pointer",
                                fontSize: "13px", opacity: confirmingId === c.id ? 0.7 : 1,
                              }}
                              onMouseEnter={e => !confirmingId && (e.target.style.background = "#218838")}
                              onMouseLeave={e => !confirmingId && (e.target.style.background = "#28a745")}
                            >
                              {confirmingId === c.id ? 'Confirmando...' : 'Confirmar Cita'}
                            </button>
                            <button 
                              onClick={() => handleCancel(c.id)}
                              style={{
                                padding: "6px 16px", background: "#dc3545",
                                color: "white", border: "none", borderRadius: "6px",
                                cursor: "pointer", fontSize: "13px",
                              }}
                              onMouseEnter={e => e.target.style.background = "#c82333"}
                              onMouseLeave={e => e.target.style.background = "#dc3545"}
                            >
                              Cancelar Cita
                            </button>
                          </>
                        )}
                        {c.state === 'LISTA_PARA_ATENCION' && (
                          <button 
                            disabled
                            style={{
                              padding: "6px 16px", background: "#6c757d",
                              color: "#adb5bd", border: "none", borderRadius: "6px",
                              fontSize: "13px", cursor: "not-allowed",
                            }}
                          >
                            En Atención
                          </button>
                        )}
                        {c.state === 'CANCELADA' && (
                          <button 
                            disabled
                            style={{
                              padding: "6px 16px", background: "#6c757d",
                              color: "#adb5bd", border: "none", borderRadius: "6px",
                              fontSize: "13px", cursor: "not-allowed",
                            }}
                          >
                            Cancelada
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}