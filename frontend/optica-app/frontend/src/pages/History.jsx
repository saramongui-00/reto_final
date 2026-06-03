import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getCitas } from "../api/appointment.api";
import { getHistorialByPaciente, createHistorial } from "../api/history.api";
import { getPatientById } from "../api/patient.api";

function History() {
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  // Estado para Sala de Espera
  const [waitingList, setWaitingList] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [selectedCitaId, setSelectedCitaId] = useState(null);
  const [showExamForm, setShowExamForm] = useState(false);

  // Estado para el formulario de examen
  const [personalBackground, setPersonalBackground] = useState("");
  const [eyeExam, setEyeExam] = useState({
    appointmentReason: "",
    diagnosis: "",
    visualAcuity: { od: "", oi: "" },
    motorStatus: { resultado: "" },
    externalEyeExam: { resultado: "" },
    ophthalmoscopy: { resultado: "" },
    keratometry: { od: "", oi: "" },
    refraction: { subjetivo: "" },
    rx: {
      prescriptionRE: "",
      prescriptionLE: "",
      paramMounting: "",
      lensType: "",
      pupillaryDistance: "",
      observations: "",
    },
  });

  // Estado para el modal de historial
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [historyList, setHistoryList] = useState([]);
  const [selectedExam, setSelectedExam] = useState(null);

  // Cargar usuario y lista de espera al iniciar
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      setUser({ id: payload.id, nombre: payload.nombre, rol: payload.rol });
    }
    loadWaitingList();
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  // Cargar citas en estado LISTA_PARA_ATENCION
  const loadWaitingList = async () => {
    try {
      const citas = await getCitas();
      const waiting = citas.filter(c => c.state === "LISTA_PARA_ATENCION");
      const enriched = await Promise.all(waiting.map(async (cita) => {
        const patient = await getPatientById(cita.patientId);
        return { ...cita, patient };
      }));
      setWaitingList(enriched);
    } catch (error) {
      console.error("Error cargando lista de espera:", error);
    }
  };

  // Atender paciente
  const handleAtender = async (cita, patient) => {
    setSelectedPatient(patient);
    setSelectedCitaId(cita.id);
    setShowExamForm(true);
    
    try {
      const historial = await getHistorialByPaciente(patient.id);
      setHistoryList(historial?.eyeExams || []);
    } catch (error) {
      console.error("Error cargando historial:", error);
      setHistoryList([]);
    }
  };

  // Guardar historial
  const handleSaveHistory = async () => {
    const payload = {
      pacienteId: selectedPatient.id,
      personalBackground: personalBackground,
      eyeExam: {
        appointmentReason: eyeExam.appointmentReason,
        diagnosis: eyeExam.diagnosis,
        visualAcuity: eyeExam.visualAcuity,
        motorStatus: eyeExam.motorStatus,
        externalEyeExam: eyeExam.externalEyeExam,
        ophthalmoscopy: eyeExam.ophthalmoscopy,
        keratometry: eyeExam.keratometry,
        refraction: eyeExam.refraction,
        rx: eyeExam.rx,
      },
    };

    try {
      await createHistorial(payload);
      alert("Historial guardado exitosamente");
      setShowExamForm(false);
      setSelectedPatient(null);
      setSelectedCitaId(null);
      resetForm();
      loadWaitingList();
    } catch (error) {
      console.error("Error guardando historial:", error);
      alert("Error al guardar el historial");
    }
  };

  const resetForm = () => {
    setPersonalBackground("");
    setEyeExam({
      appointmentReason: "",
      diagnosis: "",
      visualAcuity: { od: "", oi: "" },
      motorStatus: { resultado: "" },
      externalEyeExam: { resultado: "" },
      ophthalmoscopy: { resultado: "" },
      keratometry: { od: "", oi: "" },
      refraction: { subjetivo: "" },
      rx: {
        prescriptionRE: "",
        prescriptionLE: "",
        paramMounting: "",
        lensType: "",
        pupillaryDistance: "",
        observations: "",
      },
    });
  };

  const handleInputChange = (section, field, value) => {
    if (section === "rx") {
      setEyeExam(prev => ({
        ...prev,
        rx: { ...prev.rx, [field]: value }
      }));
    } else if (section === "visualAcuity" || section === "motorStatus" || section === "externalEyeExam" || 
               section === "ophthalmoscopy" || section === "keratometry" || section === "refraction") {
      setEyeExam(prev => ({
        ...prev,
        [section]: { ...prev[section], [field]: value }
      }));
    } else {
      setEyeExam(prev => ({ ...prev, [field]: value }));
    }
  };

  if (!user) {
    return (
      <div style={{
        minHeight: "100vh", display: "flex",
        alignItems: "center", justifyContent: "center",
        fontFamily: "'DM Sans', sans-serif", background: "#f0f4f8",
      }}>
        <div style={{ color: "#64748b" }}>Cargando...</div>
      </div>
    );
  }

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
                style={{ background: "none", border: "none", color: "rgba(255,255,255,0.8)", padding: "12px 20px", fontSize: "14px", cursor: "pointer", textAlign: "left" }}
                onMouseEnter={(e) => { e.target.style.background = "rgba(255,255,255,0.1)"; e.target.style.color = "white"; e.target.style.paddingLeft = "24px"; }}
                onMouseLeave={(e) => { e.target.style.background = "none"; e.target.style.color = "rgba(255,255,255,0.8)"; e.target.style.paddingLeft = "20px"; }}>
                Gestionar Citas
              </button>
              <button onClick={() => { navigate("/patient"); setMenuOpen(false); }}
                style={{ background: "none", border: "none", color: "rgba(255,255,255,0.8)", padding: "12px 20px", fontSize: "14px", cursor: "pointer", textAlign: "left" }}
                onMouseEnter={(e) => { e.target.style.background = "rgba(255,255,255,0.1)"; e.target.style.color = "white"; e.target.style.paddingLeft = "24px"; }}
                onMouseLeave={(e) => { e.target.style.background = "none"; e.target.style.color = "rgba(255,255,255,0.8)"; e.target.style.paddingLeft = "20px"; }}>
                Gestionar Pacientes
              </button>
              <button onClick={() => { navigate("/history"); setMenuOpen(false); }}
                style={{ background: "rgba(255,255,255,0.15)", border: "none", color: "white", padding: "12px 20px", fontSize: "14px", cursor: "pointer", textAlign: "left" }}
                onMouseEnter={(e) => { e.target.style.background = "rgba(255,255,255,0.25)"; e.target.style.paddingLeft = "24px"; }}
                onMouseLeave={(e) => { e.target.style.background = "rgba(255,255,255,0.15)"; e.target.style.paddingLeft = "20px"; }}>
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
      <div style={{ padding: "30px 40px", maxWidth: "1400px", margin: "0 auto" }}>
        {!showExamForm ? (
          // Vista 1: Sala de Espera Virtual
          <>
            <h1 style={{
              fontFamily: "'Playfair Display', serif",
              color: "#0a2540", fontSize: "26px",
              marginBottom: "24px",
            }}>
              Sala de Espera Virtual
            </h1>
            <p style={{ color: "#64748b", marginBottom: "24px" }}>
              Pacientes listos para atención
            </p>

            {waitingList.length === 0 ? (
              <div style={{
                background: "white", borderRadius: "12px", padding: "40px",
                textAlign: "center", color: "#64748b",
              }}>
                No hay pacientes en lista de espera
              </div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "20px" }}>
                {waitingList.map((item) => (
                  <div key={item.id} style={{
                    background: "white", borderRadius: "12px", padding: "20px",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
                  }}>
                    <h3 style={{ fontSize: "18px", marginBottom: "8px", color: "#0a2540" }}>
                      {item.patient?.nombres} {item.patient?.apellidos}
                    </h3>
                    <p style={{ fontSize: "13px", color: "#64748b", marginBottom: "16px" }}>
                      Documento: {item.patient?.documento}
                    </p>
                    <button
                      onClick={() => handleAtender(item, item.patient)}
                      style={{
                        width: "100%", padding: "10px", background: "#28a745",
                        color: "white", border: "none", borderRadius: "8px",
                        cursor: "pointer", fontWeight: 500,
                      }}
                      onMouseEnter={e => e.target.style.background = "#218838"}
                      onMouseLeave={e => e.target.style.background = "#28a745"}
                    >
                      Atender Paciente
                    </button>
                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          // Vista 2: Módulo de Consulta Médica
          <>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
              <h1 style={{
                fontFamily: "'Playfair Display', serif",
                color: "#0a2540", fontSize: "26px",
              }}>
                Consulta Médica
              </h1>
              <button
                onClick={() => setIsModalOpen(true)}
                style={{
                  padding: "10px 20px", background: "#0d5c8f",
                  color: "white", border: "none", borderRadius: "8px",
                  cursor: "pointer", fontWeight: 500,
                }}
                onMouseEnter={e => e.target.style.background = "#0a4a70"}
                onMouseLeave={e => e.target.style.background = "#0d5c8f"}
              >
                📋 Ver Historial Anterior
              </button>
            </div>

            <div style={{ background: "white", borderRadius: "12px", padding: "24px", marginBottom: "24px" }}>
              <h2 style={{ fontSize: "18px", marginBottom: "16px", color: "#0a2540" }}>
                Paciente: {selectedPatient?.nombres} {selectedPatient?.apellidos}
              </h2>
              
              {/* Antecedentes Personales */}
              <div style={{ marginBottom: "24px" }}>
                <label style={{ display: "block", fontWeight: 500, marginBottom: "8px", color: "#0a2540" }}>
                  Antecedentes Personales
                </label>
                <textarea
                  rows="4"
                  value={personalBackground}
                  onChange={(e) => setPersonalBackground(e.target.value)}
                  style={{
                    width: "100%", padding: "12px", border: "1px solid #e2e8f0",
                    borderRadius: "8px", fontSize: "14px", fontFamily: "inherit",
                  }}
                  placeholder="Hipertensión, diabetes, uso de lentes, cirugías previas..."
                />
              </div>

              {/* Motivo de Consulta */}
              <div style={{ marginBottom: "24px" }}>
                <label style={{ display: "block", fontWeight: 500, marginBottom: "8px", color: "#0a2540" }}>
                  Motivo de Consulta
                </label>
                <input
                  type="text"
                  value={eyeExam.appointmentReason}
                  onChange={(e) => handleInputChange(null, "appointmentReason", e.target.value)}
                  style={{
                    width: "100%", padding: "10px", border: "1px solid #e2e8f0",
                    borderRadius: "8px", fontSize: "14px",
                  }}
                  placeholder="Visión borrosa, fatiga ocular, dolor de cabeza..."
                />
              </div>

              {/* Examen Visual - Grid de campos médicos */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
                {/* Columna Izquierda */}
                <div>
                  <h3 style={{ fontSize: "16px", marginBottom: "16px", color: "#0a2540" }}>Agudeza Visual</h3>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "20px" }}>
                    <input type="text" placeholder="OD (Ojo Derecho)" value={eyeExam.visualAcuity.od}
                      onChange={(e) => handleInputChange("visualAcuity", "od", e.target.value)}
                      style={{ padding: "8px", border: "1px solid #e2e8f0", borderRadius: "6px" }} />
                    <input type="text" placeholder="OI (Ojo Izquierdo)" value={eyeExam.visualAcuity.oi}
                      onChange={(e) => handleInputChange("visualAcuity", "oi", e.target.value)}
                      style={{ padding: "8px", border: "1px solid #e2e8f0", borderRadius: "6px" }} />
                  </div>

                  <h3 style={{ fontSize: "16px", marginBottom: "16px", color: "#0a2540" }}>Queratometrías</h3>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "20px" }}>
                    <input type="text" placeholder="OD" value={eyeExam.keratometry.od}
                      onChange={(e) => handleInputChange("keratometry", "od", e.target.value)}
                      style={{ padding: "8px", border: "1px solid #e2e8f0", borderRadius: "6px" }} />
                    <input type="text" placeholder="OI" value={eyeExam.keratometry.oi}
                      onChange={(e) => handleInputChange("keratometry", "oi", e.target.value)}
                      style={{ padding: "8px", border: "1px solid #e2e8f0", borderRadius: "6px" }} />
                  </div>

                  <h3 style={{ fontSize: "16px", marginBottom: "16px", color: "#0a2540" }}>Refracción</h3>
                  <div style={{ marginBottom: "20px" }}>
                    <input type="text" placeholder="Subjetivo" value={eyeExam.refraction.subjetivo}
                      onChange={(e) => handleInputChange("refraction", "subjetivo", e.target.value)}
                      style={{ width: "100%", padding: "8px", border: "1px solid #e2e8f0", borderRadius: "6px" }} />
                  </div>

                  <h3 style={{ fontSize: "16px", marginBottom: "16px", color: "#0a2540" }}>Fórmula Final (Rx)</h3>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "12px" }}>
                    <input type="text" placeholder="Prescripción OD" value={eyeExam.rx.prescriptionRE}
                      onChange={(e) => handleInputChange("rx", "prescriptionRE", e.target.value)}
                      style={{ padding: "8px", border: "1px solid #e2e8f0", borderRadius: "6px" }} />
                    <input type="text" placeholder="Prescripción OI" value={eyeExam.rx.prescriptionLE}
                      onChange={(e) => handleInputChange("rx", "prescriptionLE", e.target.value)}
                      style={{ padding: "8px", border: "1px solid #e2e8f0", borderRadius: "6px" }} />
                  </div>
                </div>

                {/* Columna Derecha */}
                <div>
                  <h3 style={{ fontSize: "16px", marginBottom: "16px", color: "#0a2540" }}>Estado Motor</h3>
                  <div style={{ marginBottom: "20px" }}>
                    <input type="text" placeholder="Resultado" value={eyeExam.motorStatus.resultado}
                      onChange={(e) => handleInputChange("motorStatus", "resultado", e.target.value)}
                      style={{ width: "100%", padding: "8px", border: "1px solid #e2e8f0", borderRadius: "6px" }} />
                  </div>

                  <h3 style={{ fontSize: "16px", marginBottom: "16px", color: "#0a2540" }}>Examen Ocular Externo</h3>
                  <div style={{ marginBottom: "20px" }}>
                    <input type="text" placeholder="Resultado" value={eyeExam.externalEyeExam.resultado}
                      onChange={(e) => handleInputChange("externalEyeExam", "resultado", e.target.value)}
                      style={{ width: "100%", padding: "8px", border: "1px solid #e2e8f0", borderRadius: "6px" }} />
                  </div>

                  <h3 style={{ fontSize: "16px", marginBottom: "16px", color: "#0a2540" }}>Oftalmoscopía</h3>
                  <div style={{ marginBottom: "20px" }}>
                    <input type="text" placeholder="Resultado" value={eyeExam.ophthalmoscopy.resultado}
                      onChange={(e) => handleInputChange("ophthalmoscopy", "resultado", e.target.value)}
                      style={{ width: "100%", padding: "8px", border: "1px solid #e2e8f0", borderRadius: "6px" }} />
                  </div>

                  <h3 style={{ fontSize: "16px", marginBottom: "16px", color: "#0a2540" }}>Diagnóstico</h3>
                  <div style={{ marginBottom: "20px" }}>
                    <input type="text" placeholder="Diagnóstico clínico" value={eyeExam.diagnosis}
                      onChange={(e) => handleInputChange(null, "diagnosis", e.target.value)}
                      style={{ width: "100%", padding: "8px", border: "1px solid #e2e8f0", borderRadius: "6px" }} />
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "12px" }}>
                    <input type="text" placeholder="Distancia Pupilar" value={eyeExam.rx.pupillaryDistance}
                      onChange={(e) => handleInputChange("rx", "pupillaryDistance", e.target.value)}
                      style={{ padding: "8px", border: "1px solid #e2e8f0", borderRadius: "6px" }} />
                    <input type="text" placeholder="Tipo de Lente" value={eyeExam.rx.lensType}
                      onChange={(e) => handleInputChange("rx", "lensType", e.target.value)}
                      style={{ padding: "8px", border: "1px solid #e2e8f0", borderRadius: "6px" }} />
                  </div>
                </div>
              </div>

              {/* Observaciones Rx */}
              <div style={{ marginTop: "24px" }}>
                <input type="text" placeholder="Observaciones de la fórmula" value={eyeExam.rx.observations}
                  onChange={(e) => handleInputChange("rx", "observations", e.target.value)}
                  style={{ width: "100%", padding: "10px", border: "1px solid #e2e8f0", borderRadius: "8px" }} />
              </div>

              {/* Botones */}
              <div style={{ display: "flex", gap: "16px", marginTop: "32px" }}>
                <button
                  onClick={handleSaveHistory}
                  style={{
                    flex: 1, padding: "12px", background: "#28a745",
                    color: "white", border: "none", borderRadius: "8px",
                    cursor: "pointer", fontWeight: 500, fontSize: "16px",
                  }}
                  onMouseEnter={e => e.target.style.background = "#218838"}
                  onMouseLeave={e => e.target.style.background = "#28a745"}
                >
                  Guardar Historial
                </button>
                <button
                  onClick={() => {
                    setShowExamForm(false);
                    setSelectedPatient(null);
                    resetForm();
                  }}
                  style={{
                    flex: 1, padding: "12px", background: "#6c757d",
                    color: "white", border: "none", borderRadius: "8px",
                    cursor: "pointer", fontWeight: 500, fontSize: "16px",
                  }}
                  onMouseEnter={e => e.target.style.background = "#5a6268"}
                  onMouseLeave={e => e.target.style.background = "#6c757d"}
                >
                  Cancelar
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Modal de Historial Anterior */}
      {isModalOpen && (
        <div style={{
          position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
          background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center",
          justifyContent: "center", zIndex: 1000,
        }}>
          <div style={{
            background: "white", borderRadius: "16px", width: "800px",
            maxWidth: "90%", maxHeight: "80vh", overflow: "hidden",
          }}>
            <div style={{
              padding: "20px", borderBottom: "1px solid #e2e8f0",
              display: "flex", justifyContent: "space-between", alignItems: "center",
            }}>
              <h3 style={{ fontSize: "20px", fontFamily: "'Playfair Display', serif", color: "#0a2540" }}>
                Historial Anterior
              </h3>
              <button onClick={() => setIsModalOpen(false)} style={{
                background: "none", border: "none", fontSize: "24px", cursor: "pointer",
              }}>×</button>
            </div>
            <div style={{ display: "flex", height: "500px" }}>
              <div style={{ width: "40%", borderRight: "1px solid #e2e8f0", overflow: "auto" }}>
                {historyList.length === 0 ? (
                  <p style={{ padding: "20px", color: "#64748b" }}>No hay exámenes previos</p>
                ) : (
                  historyList.map((exam, idx) => (
                    <div
                      key={idx}
                      onClick={() => setSelectedExam(exam)}
                      style={{
                        padding: "12px 16px", borderBottom: "1px solid #e2e8f0",
                        cursor: "pointer", background: selectedExam === exam ? "#f0f4f8" : "white",
                      }}
                    >
                      <strong>{new Date(exam.examDate).toLocaleDateString()}</strong>
                      <p style={{ fontSize: "12px", color: "#64748b", marginTop: "4px" }}>
                        {exam.diagnosis?.substring(0, 60)}...
                      </p>
                    </div>
                  ))
                )}
              </div>
              <div style={{ width: "60%", padding: "20px", overflow: "auto" }}>
                {selectedExam ? (
                  <>
                    <h4 style={{ fontSize: "16px", marginBottom: "16px", color: "#0a2540" }}>
                      Fecha: {new Date(selectedExam.examDate).toLocaleDateString()}
                    </h4>
                    <p><strong>Diagnóstico:</strong> {selectedExam.diagnosis}</p>
                    <p><strong>Motivo:</strong> {selectedExam.appointmentReason}</p>
                    <hr style={{ margin: "16px 0" }} />
                    <h5 style={{ marginBottom: "8px" }}>Prescripción (Rx)</h5>
                    <p><strong>OD:</strong> {selectedExam.rx?.prescriptionRE}</p>
                    <p><strong>OI:</strong> {selectedExam.rx?.prescriptionLE}</p>
                    <p><strong>Lente:</strong> {selectedExam.rx?.lensType}</p>
                    <p><strong>DP:</strong> {selectedExam.rx?.pupillaryDistance}</p>
                    {selectedExam.rx?.observations && (
                      <p><strong>Observaciones:</strong> {selectedExam.rx.observations}</p>
                    )}
                  </>
                ) : (
                  <p style={{ color: "#64748b" }}>Selecciona un examen para ver detalles</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default History;