import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getCitasEnEspera } from "../api/citas.api"; 
import { getHistorialByPaciente, createHistorial } from "../api/history.api";
import { getPatient } from "../api/patient.api";

function History() {
  const [user, setUser] = useState({ nombre: "Invitado", rol: "OPTOMETRA" });
  const [menuOpen, setMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Estado para Sala de Espera
  const [waitingList, setWaitingList] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [selectedCitaId, setSelectedCitaId] = useState(null);
  const [showExamForm, setShowExamForm] = useState(false);

  // Estado para el formulario de examen
  const [personalBackground, setPersonalBackground] = useState({
    personalHistory: "",
    familyHistory: "",
    ocularHistory: "",
    surgicalHistory: "",
    medications: "",
    allergies: "",
    observations: "",
  });
  const [eyeExam, setEyeExam] = useState({
    appointmentId: "",
    examDate: new Date().toISOString().slice(0, 16),
    appointmentReason: "",
    diagnosis: "",
    visualAcuity: {
      rightEye: { closeupVision: "", distantVision: "" },
      leftEye: { closeupVision: "", distantVision: "" },
      tool: "Snellen",
      observations: "",
    },
    motorStatus: {
      coverTestSC: "",
      coverTestCC: "",
      ppc: "",
      closeupVision: "",
      dominantEye: "DERECHO",
      observations: "",
    },
    externalEyeExam: {
      rightEye: {
        pupil: "",
        conjunctiva: "",
        cristallineLens: "",
        anteriorChamber: "",
        eyelids: "",
        cornea: "",
        lacrimalPuncta: "",
        iris: "",
      },
      leftEye: {
        pupil: "",
        conjunctiva: "",
        cristallineLens: "",
        anteriorChamber: "",
        eyelids: "",
        cornea: "",
        lacrimalPuncta: "",
        iris: "",
      },
      observations: "",
    },
    ophthalmoscopy: {
      rightEye: {
        opticDisc: "",
        cupping: "",
        macula: "",
        rav: "",
        media: "",
        fovealBrightness: "",
      },
      leftEye: {
        opticDisc: "",
        cupping: "",
        macula: "",
        rav: "",
        media: "",
        fovealBrightness: "",
      },
      observations: "",
    },
    keratometry: {
      rightEye: { horizontal: "", vertical: "", axis: "", sights: "", astigmatism: "" },
      leftEye: { horizontal: "", vertical: "", axis: "", sights: "", astigmatism: "" },
    },
    refraction: {
      staticRetinoscopy: {
        rightEye: { horizontal: "", vertical: "", axis: "" },
        leftEye: { horizontal: "", vertical: "", axis: "" },
      },
      dynamicRetinoscopy: {
        rightEye: { horizontal: "", vertical: "", axis: "" },
        leftEye: { horizontal: "", vertical: "", axis: "" },
      },
      subjective: {
        rightEye: { horizontal: "", vertical: "", axis: "" },
        leftEye: { horizontal: "", vertical: "", axis: "" },
      },
    },
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
  useEffect(() => {
  const inicializarVista = async () => {
    try {
      await loadWaitingList();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  inicializarVista();
}, []);

  const handleLogout = () => {
    localStorage.clear();
  };

  // Cargar citas en estado LISTA_PARA_ATENCION
const loadWaitingList = async () => {
  try {
    console.log("1. Solicitando citas en espera al backend...");
    const citasEnEspera = await getCitasEnEspera(); 
    console.log("2. Citas recibidas desde el back:", citasEnEspera);

    if (!citasEnEspera || citasEnEspera.length === 0) {
      setWaitingList([]);
      return;
    }

    const enriched = await Promise.all(
      citasEnEspera.map(async (cita) => {
        try {
          if (!cita.patientId) {
            return { ...cita, patient: { nombre: "Sin documento", apellido: "" } };
          }
          
          // Creamos una carrera: si el servicio de pacientes tarda más de 1500ms, abortamos la consulta de ese paciente
          const patientPromise = getPatient(cita.patientId); // o getPatientById según la opción que elegiste
          const timeoutPromise = new Promise((_, reject) => 
            setTimeout(() => reject(new Error("Timeout")), 1500)
          );

          // Ejecutamos la que responda primero
          const patient = await Promise.race([patientPromise, timeoutPromise]);
          return { ...cita, patient };

        } catch (pError) {
          console.warn(`No se pudo enriquecer la cita ${cita.id} a tiempo:`, pError.message);
          // Si el microservicio de pacientes se cuelga, inventamos datos para que el médico vea la cita en la tabla
          return { 
            ...cita, 
            patient: { nombre: "Paciente", apellido: `Doc: ${cita.patientId} (Lento/Error)` } 
          };
        }
      })
    );
    console.log("3. Lista de espera enriquecida con éxito:", enriched);
    setWaitingList(enriched);
  } catch (error) {
    console.error("Error crítico cargando la sala de espera virtual:", error);
    setWaitingList([]);
  }
};

  // Atender paciente
  const handleAtender = async (cita, patient) => {
    setSelectedPatient(patient);
    setSelectedCitaId(cita.id);
    setShowExamForm(true);
    
    const pacienteKey = patient?.documento ?? patient?.id;
    try {
      const historial = await getHistorialByPaciente(pacienteKey);
      setHistoryList(historial?.eyeExams || []);
    } catch (error) {
      console.error("Error cargando historial:", error);
      setHistoryList([]);
    }
  };

  // Guardar historial
  const handleSaveHistory = async () => {
    const pacienteKey = selectedPatient?.documento ?? selectedPatient?.id;
    if (!pacienteKey) {
      alert("No se pudo guardar: el paciente no tiene identificador válido.");
      return;
    }

    const payload = {
      pacienteId: pacienteKey,
      personalBackground: {
        personalHistory: personalBackground.personalHistory,
        familyHistory: personalBackground.familyHistory,
        ocularHistory: personalBackground.ocularHistory,
        surgicalHistory: personalBackground.surgicalHistory,
        medications: personalBackground.medications,
        allergies: personalBackground.allergies,
        observations: personalBackground.observations,
      },
      eyeExam: {
        appointmentId: eyeExam.appointmentId || selectedCitaId || "",
        examDate: eyeExam.examDate,
        appointmentReason: eyeExam.appointmentReason,
        diagnosis: eyeExam.diagnosis,
        visualAcuity: {
          rightEye: {
            closeupVision: eyeExam.visualAcuity.rightEye.closeupVision,
            distantVision: eyeExam.visualAcuity.rightEye.distantVision,
          },
          leftEye: {
            closeupVision: eyeExam.visualAcuity.leftEye.closeupVision,
            distantVision: eyeExam.visualAcuity.leftEye.distantVision,
          },
          tool: eyeExam.visualAcuity.tool || "Snellen",
          observations: eyeExam.visualAcuity.observations,
        },
        motorStatus: {
          coverTestSC: eyeExam.motorStatus.coverTestSC,
          coverTestCC: eyeExam.motorStatus.coverTestCC,
          ppc: eyeExam.motorStatus.ppc,
          closeupVision: eyeExam.motorStatus.closeupVision,
          dominantEye: eyeExam.motorStatus.dominantEye,
          observations: eyeExam.motorStatus.observations,
        },
        externalEyeExam: {
          rightEye: {
            pupil: eyeExam.externalEyeExam.rightEye.pupil,
            conjunctiva: eyeExam.externalEyeExam.rightEye.conjunctiva,
            cristallineLens: eyeExam.externalEyeExam.rightEye.cristallineLens,
            anteriorChamber: eyeExam.externalEyeExam.rightEye.anteriorChamber,
            eyelids: eyeExam.externalEyeExam.rightEye.eyelids,
            cornea: eyeExam.externalEyeExam.rightEye.cornea,
            lacrimalPuncta: eyeExam.externalEyeExam.rightEye.lacrimalPuncta,
            iris: eyeExam.externalEyeExam.rightEye.iris,
          },
          leftEye: {
            pupil: eyeExam.externalEyeExam.leftEye.pupil,
            conjunctiva: eyeExam.externalEyeExam.leftEye.conjunctiva,
            cristallineLens: eyeExam.externalEyeExam.leftEye.cristallineLens,
            anteriorChamber: eyeExam.externalEyeExam.leftEye.anteriorChamber,
            eyelids: eyeExam.externalEyeExam.leftEye.eyelids,
            cornea: eyeExam.externalEyeExam.leftEye.cornea,
            lacrimalPuncta: eyeExam.externalEyeExam.leftEye.lacrimalPuncta,
            iris: eyeExam.externalEyeExam.leftEye.iris,
          },
          observations: eyeExam.externalEyeExam.observations,
        },
        ophthalmoscopy: {
          rightEye: {
            opticDisc: eyeExam.ophthalmoscopy.rightEye.opticDisc,
            cupping: eyeExam.ophthalmoscopy.rightEye.cupping,
            macula: eyeExam.ophthalmoscopy.rightEye.macula,
            rav: eyeExam.ophthalmoscopy.rightEye.rav,
            media: eyeExam.ophthalmoscopy.rightEye.media,
            fovealBrightness: eyeExam.ophthalmoscopy.rightEye.fovealBrightness,
          },
          leftEye: {
            opticDisc: eyeExam.ophthalmoscopy.leftEye.opticDisc,
            cupping: eyeExam.ophthalmoscopy.leftEye.cupping,
            macula: eyeExam.ophthalmoscopy.leftEye.macula,
            rav: eyeExam.ophthalmoscopy.leftEye.rav,
            media: eyeExam.ophthalmoscopy.leftEye.media,
            fovealBrightness: eyeExam.ophthalmoscopy.leftEye.fovealBrightness,
          },
          observations: eyeExam.ophthalmoscopy.observations,
        },
        keratometry: {
          rightEye: {
            horizontal: eyeExam.keratometry.rightEye.horizontal,
            vertical: eyeExam.keratometry.rightEye.vertical,
            axis: eyeExam.keratometry.rightEye.axis,
            sights: eyeExam.keratometry.rightEye.sights,
            astigmatism: eyeExam.keratometry.rightEye.astigmatism,
          },
          leftEye: {
            horizontal: eyeExam.keratometry.leftEye.horizontal,
            vertical: eyeExam.keratometry.leftEye.vertical,
            axis: eyeExam.keratometry.leftEye.axis,
            sights: eyeExam.keratometry.leftEye.sights,
            astigmatism: eyeExam.keratometry.leftEye.astigmatism,
          },
        },
        refraction: {
          staticRetinoscopy: {
            rightEye: {
              horizontal: eyeExam.refraction.staticRetinoscopy.rightEye.horizontal,
              vertical: eyeExam.refraction.staticRetinoscopy.rightEye.vertical,
              axis: eyeExam.refraction.staticRetinoscopy.rightEye.axis,
            },
            leftEye: {
              horizontal: eyeExam.refraction.staticRetinoscopy.leftEye.horizontal,
              vertical: eyeExam.refraction.staticRetinoscopy.leftEye.vertical,
              axis: eyeExam.refraction.staticRetinoscopy.leftEye.axis,
            },
          },
          dynamicRetinoscopy: {
            rightEye: {
              horizontal: eyeExam.refraction.dynamicRetinoscopy.rightEye.horizontal,
              vertical: eyeExam.refraction.dynamicRetinoscopy.rightEye.vertical,
              axis: eyeExam.refraction.dynamicRetinoscopy.rightEye.axis,
            },
            leftEye: {
              horizontal: eyeExam.refraction.dynamicRetinoscopy.leftEye.horizontal,
              vertical: eyeExam.refraction.dynamicRetinoscopy.leftEye.vertical,
              axis: eyeExam.refraction.dynamicRetinoscopy.leftEye.axis,
            },
          },
          subjective: {
            rightEye: {
              horizontal: eyeExam.refraction.subjective.rightEye.horizontal,
              vertical: eyeExam.refraction.subjective.rightEye.vertical,
              axis: eyeExam.refraction.subjective.rightEye.axis,
            },
            leftEye: {
              horizontal: eyeExam.refraction.subjective.leftEye.horizontal,
              vertical: eyeExam.refraction.subjective.leftEye.vertical,
              axis: eyeExam.refraction.subjective.leftEye.axis,
            },
          },
        },
        rx: {
          prescriptionRE: eyeExam.rx.prescriptionRE,
          prescriptionLE: eyeExam.rx.prescriptionLE,
          paramMounting: eyeExam.rx.paramMounting,
          lensType: eyeExam.rx.lensType,
          pupillaryDistance: eyeExam.rx.pupillaryDistance,
          observations: eyeExam.rx.observations,
        },
      },
    };

    try {
      console.log("Payload historial:", payload);
      await createHistorial(payload);
      alert("Historial guardado exitosamente");
      setShowExamForm(false);
      setSelectedPatient(null);
      setSelectedCitaId(null);
      resetForm();
      loadWaitingList();
    } catch (error) {
      console.error("Error guardando historial:", error);
      if (error?.response) {
        console.error("Response status:", error.response.status);
        console.error("Response data:", error.response.data);
        alert(`Error al guardar el historial: ${error.response.status} - ${JSON.stringify(error.response.data)}`);
      } else {
        alert("Error al guardar el historial: comprobar conexión o CORS (ver consola)");
      }
    }
  };

  const resetForm = () => {
    setPersonalBackground({
      personalHistory: "",
      familyHistory: "",
      ocularHistory: "",
      surgicalHistory: "",
      medications: "",
      allergies: "",
      observations: "",
    });
    setEyeExam({
      appointmentId: "",
      examDate: new Date().toISOString().slice(0, 16),
      appointmentReason: "",
      diagnosis: "",
      visualAcuity: {
        rightEye: { closeupVision: "", distantVision: "" },
        leftEye: { closeupVision: "", distantVision: "" },
        tool: "Snellen",
        observations: "",
      },
      motorStatus: {
        coverTestSC: "",
        coverTestCC: "",
        ppc: "",
        closeupVision: "",
        dominantEye: "",
        observations: "",
      },
      externalEyeExam: {
        rightEye: {
          pupil: "",
          conjunctiva: "",
          cristallineLens: "",
          anteriorChamber: "",
          eyelids: "",
          cornea: "",
          lacrimalPuncta: "",
          iris: "",
        },
        leftEye: {
          pupil: "",
          conjunctiva: "",
          cristallineLens: "",
          anteriorChamber: "",
          eyelids: "",
          cornea: "",
          lacrimalPuncta: "",
          iris: "",
        },
        observations: "",
      },
      ophthalmoscopy: {
        rightEye: {
          opticDisc: "",
          cupping: "",
          macula: "",
          rav: "",
          media: "",
          fovealBrightness: "",
        },
        leftEye: {
          opticDisc: "",
          cupping: "",
          macula: "",
          rav: "",
          media: "",
          fovealBrightness: "",
        },
        observations: "",
      },
      keratometry: {
        rightEye: { horizontal: "", vertical: "", axis: "", sights: "", astigmatism: "" },
        leftEye: { horizontal: "", vertical: "", axis: "", sights: "", astigmatism: "" },
      },
      refraction: {
        staticRetinoscopy: {
          rightEye: { horizontal: "", vertical: "", axis: "" },
          leftEye: { horizontal: "", vertical: "", axis: "" },
        },
        dynamicRetinoscopy: {
          rightEye: { horizontal: "", vertical: "", axis: "" },
          leftEye: { horizontal: "", vertical: "", axis: "" },
        },
        subjective: {
          rightEye: { horizontal: "", vertical: "", axis: "" },
          leftEye: { horizontal: "", vertical: "", axis: "" },
        },
      },
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

  const handleInputChange = (path, value) => {
    if (path[0] === "personalBackground") {
      setPersonalBackground((prev) => ({
        ...prev,
        [path[1]]: value,
      }));
      return;
    }

    setEyeExam((prev) => {
      const next = JSON.parse(JSON.stringify(prev));
      let node = next;
      for (let i = 0; i < path.length - 1; i += 1) {
        node = node[path[i]];
      }
      node[path[path.length - 1]] = value;
      return next;
    });
  };

  if (loading) {
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
                <div style={{ display: "grid", gap: "12px" }}>
                  <input
                    type="text"
                    value={personalBackground.personalHistory}
                    onChange={(e) => handleInputChange(["personalBackground", "personalHistory"], e.target.value)}
                    style={{ width: "100%", padding: "10px", border: "1px solid #e2e8f0", borderRadius: "8px", fontSize: "14px" }}
                    placeholder="Antecedentes personales"
                  />
                  <input
                    type="text"
                    value={personalBackground.familyHistory}
                    onChange={(e) => handleInputChange(["personalBackground", "familyHistory"], e.target.value)}
                    style={{ width: "100%", padding: "10px", border: "1px solid #e2e8f0", borderRadius: "8px", fontSize: "14px" }}
                    placeholder="Antecedentes familiares"
                  />
                  <input
                    type="text"
                    value={personalBackground.ocularHistory}
                    onChange={(e) => handleInputChange(["personalBackground", "ocularHistory"], e.target.value)}
                    style={{ width: "100%", padding: "10px", border: "1px solid #e2e8f0", borderRadius: "8px", fontSize: "14px" }}
                    placeholder="Antecedentes oculares"
                  />
                  <input
                    type="text"
                    value={personalBackground.surgicalHistory}
                    onChange={(e) => handleInputChange(["personalBackground", "surgicalHistory"], e.target.value)}
                    style={{ width: "100%", padding: "10px", border: "1px solid #e2e8f0", borderRadius: "8px", fontSize: "14px" }}
                    placeholder="Antecedentes quirúrgicos"
                  />
                  <input
                    type="text"
                    value={personalBackground.medications}
                    onChange={(e) => handleInputChange(["personalBackground", "medications"], e.target.value)}
                    style={{ width: "100%", padding: "10px", border: "1px solid #e2e8f0", borderRadius: "8px", fontSize: "14px" }}
                    placeholder="Medicaciones"
                  />
                  <input
                    type="text"
                    value={personalBackground.allergies}
                    onChange={(e) => handleInputChange(["personalBackground", "allergies"], e.target.value)}
                    style={{ width: "100%", padding: "10px", border: "1px solid #e2e8f0", borderRadius: "8px", fontSize: "14px" }}
                    placeholder="Alergias"
                  />
                  <textarea
                    rows="3"
                    value={personalBackground.observations}
                    onChange={(e) => handleInputChange(["personalBackground", "observations"], e.target.value)}
                    style={{ width: "100%", padding: "12px", border: "1px solid #e2e8f0", borderRadius: "8px", fontSize: "14px", fontFamily: "inherit" }}
                    placeholder="Observaciones generales"
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "24px" }}>
                <div>
                  <label style={{ display: "block", fontWeight: 500, marginBottom: "8px", color: "#0a2540" }}>
                    ID de la Cita
                  </label>
                  <input
                    type="text"
                    value={eyeExam.appointmentId || selectedCitaId || ""}
                    onChange={(e) => handleInputChange(["appointmentId"], e.target.value)}
                    style={{ width: "100%", padding: "10px", border: "1px solid #e2e8f0", borderRadius: "8px", fontSize: "14px" }}
                    placeholder="UUID de la cita"
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontWeight: 500, marginBottom: "8px", color: "#0a2540" }}>
                    Fecha del examen
                  </label>
                  <input
                    type="datetime-local"
                    value={eyeExam.examDate}
                    onChange={(e) => handleInputChange(["examDate"], e.target.value)}
                    style={{ width: "100%", padding: "10px", border: "1px solid #e2e8f0", borderRadius: "8px", fontSize: "14px" }}
                  />
                </div>
              </div>

              {/* Motivo de Consulta y Diagnóstico */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "24px" }}>
                <div>
                  <label style={{ display: "block", fontWeight: 500, marginBottom: "8px", color: "#0a2540" }}>
                    Motivo de Consulta
                  </label>
                  <input
                    type="text"
                    value={eyeExam.appointmentReason}
                    onChange={(e) => handleInputChange(["appointmentReason"], e.target.value)}
                    style={{
                      width: "100%", padding: "10px", border: "1px solid #e2e8f0",
                      borderRadius: "8px", fontSize: "14px",
                    }}
                    placeholder="Visión borrosa, fatiga ocular..."
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontWeight: 500, marginBottom: "8px", color: "#0a2540" }}>
                    Diagnóstico
                  </label>
                  <input
                    type="text"
                    value={eyeExam.diagnosis}
                    onChange={(e) => handleInputChange(["diagnosis"], e.target.value)}
                    style={{
                      width: "100%", padding: "10px", border: "1px solid #e2e8f0",
                      borderRadius: "8px", fontSize: "14px",
                    }}
                    placeholder="Diagnóstico del paciente"
                  />
                </div>
              </div>

              {/* Agudeza Visual */}
              <div style={{ marginBottom: "24px" }}>
                <h3 style={{ fontSize: "16px", marginBottom: "12px", color: "#0a2540" }}>Agudeza Visual</h3>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "12px" }}>
                  <input type="text" placeholder="OD Cerca" value={eyeExam.visualAcuity.rightEye.closeupVision}
                    onChange={(e) => handleInputChange(["visualAcuity", "rightEye", "closeupVision"], e.target.value)}
                    style={{ padding: "8px", border: "1px solid #e2e8f0", borderRadius: "6px" }} />
                  <input type="text" placeholder="OI Cerca" value={eyeExam.visualAcuity.leftEye.closeupVision}
                    onChange={(e) => handleInputChange(["visualAcuity", "leftEye", "closeupVision"], e.target.value)}
                    style={{ padding: "8px", border: "1px solid #e2e8f0", borderRadius: "6px" }} />
                  <input type="text" placeholder="OD Distancia" value={eyeExam.visualAcuity.rightEye.distantVision}
                    onChange={(e) => handleInputChange(["visualAcuity", "rightEye", "distantVision"], e.target.value)}
                    style={{ padding: "8px", border: "1px solid #e2e8f0", borderRadius: "6px" }} />
                  <input type="text" placeholder="OI Distancia" value={eyeExam.visualAcuity.leftEye.distantVision}
                    onChange={(e) => handleInputChange(["visualAcuity", "leftEye", "distantVision"], e.target.value)}
                    style={{ padding: "8px", border: "1px solid #e2e8f0", borderRadius: "6px" }} />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <input type="text" placeholder="Herramienta (ej: Snellen)" value={eyeExam.visualAcuity.tool}
                    onChange={(e) => handleInputChange(["visualAcuity", "tool"], e.target.value)}
                    style={{ padding: "8px", border: "1px solid #e2e8f0", borderRadius: "6px" }} />
                  <input type="text" placeholder="Observaciones agudeza" value={eyeExam.visualAcuity.observations}
                    onChange={(e) => handleInputChange(["visualAcuity", "observations"], e.target.value)}
                    style={{ padding: "8px", border: "1px solid #e2e8f0", borderRadius: "6px" }} />
                </div>
              </div>

              {/* Estado Motor */}
              <div style={{ marginBottom: "24px" }}>
                <h3 style={{ fontSize: "16px", marginBottom: "12px", color: "#0a2540" }}>Estado Motor</h3>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "12px" }}>
                  <input type="text" placeholder="Cover Test SC" value={eyeExam.motorStatus.coverTestSC}
                    onChange={(e) => handleInputChange(["motorStatus", "coverTestSC"], e.target.value)}
                    style={{ padding: "8px", border: "1px solid #e2e8f0", borderRadius: "6px" }} />
                  <input type="text" placeholder="Cover Test CC" value={eyeExam.motorStatus.coverTestCC}
                    onChange={(e) => handleInputChange(["motorStatus", "coverTestCC"], e.target.value)}
                    style={{ padding: "8px", border: "1px solid #e2e8f0", borderRadius: "6px" }} />
                  <input type="text" placeholder="PPC" value={eyeExam.motorStatus.ppc}
                    onChange={(e) => handleInputChange(["motorStatus", "ppc"], e.target.value)}
                    style={{ padding: "8px", border: "1px solid #e2e8f0", borderRadius: "6px" }} />
                  <input type="text" placeholder="Closeup Vision" value={eyeExam.motorStatus.closeupVision}
                    onChange={(e) => handleInputChange(["motorStatus", "closeupVision"], e.target.value)}
                    style={{ padding: "8px", border: "1px solid #e2e8f0", borderRadius: "6px" }} />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <select value={eyeExam.motorStatus.dominantEye}
                    onChange={(e) => handleInputChange(["motorStatus", "dominantEye"], e.target.value)}
                    style={{ padding: "8px", border: "1px solid #e2e8f0", borderRadius: "6px" }}>
                    <option value="">Selecciona ojo dominante</option>
                    <option value="DERECHO">DERECHO</option>
                    <option value="IZQUIERDO">IZQUIERDO</option>
                  </select>
                  <input type="text" placeholder="Observaciones motor" value={eyeExam.motorStatus.observations}
                    onChange={(e) => handleInputChange(["motorStatus", "observations"], e.target.value)}
                    style={{ padding: "8px", border: "1px solid #e2e8f0", borderRadius: "6px" }} />
                </div>
              </div>

              {/* Examen Ocular Externo */}
              <div style={{ marginBottom: "24px" }}>
                <h3 style={{ fontSize: "16px", marginBottom: "12px", color: "#0a2540" }}>Examen Ocular Externo</h3>
                <div style={{ background: "#f9fafb", padding: "12px", borderRadius: "6px", marginBottom: "12px" }}>
                  <p style={{ fontWeight: 500, marginBottom: "8px" }}>OD (Ojo Derecho)</p>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                    <input type="text" placeholder="Pupila" value={eyeExam.externalEyeExam.rightEye.pupil}
                      onChange={(e) => handleInputChange(["externalEyeExam", "rightEye", "pupil"], e.target.value)}
                      style={{ padding: "6px", border: "1px solid #e2e8f0", borderRadius: "4px", fontSize: "12px" }} />
                    <input type="text" placeholder="Conjuntiva" value={eyeExam.externalEyeExam.rightEye.conjunctiva}
                      onChange={(e) => handleInputChange(["externalEyeExam", "rightEye", "conjunctiva"], e.target.value)}
                      style={{ padding: "6px", border: "1px solid #e2e8f0", borderRadius: "4px", fontSize: "12px" }} />
                    <input type="text" placeholder="Cristalino" value={eyeExam.externalEyeExam.rightEye.cristallineLens}
                      onChange={(e) => handleInputChange(["externalEyeExam", "rightEye", "cristallineLens"], e.target.value)}
                      style={{ padding: "6px", border: "1px solid #e2e8f0", borderRadius: "4px", fontSize: "12px" }} />
                    <input type="text" placeholder="Cámara anterior" value={eyeExam.externalEyeExam.rightEye.anteriorChamber}
                      onChange={(e) => handleInputChange(["externalEyeExam", "rightEye", "anteriorChamber"], e.target.value)}
                      style={{ padding: "6px", border: "1px solid #e2e8f0", borderRadius: "4px", fontSize: "12px" }} />
                    <input type="text" placeholder="Párpados" value={eyeExam.externalEyeExam.rightEye.eyelids}
                      onChange={(e) => handleInputChange(["externalEyeExam", "rightEye", "eyelids"], e.target.value)}
                      style={{ padding: "6px", border: "1px solid #e2e8f0", borderRadius: "4px", fontSize: "12px" }} />
                    <input type="text" placeholder="Córnea" value={eyeExam.externalEyeExam.rightEye.cornea}
                      onChange={(e) => handleInputChange(["externalEyeExam", "rightEye", "cornea"], e.target.value)}
                      style={{ padding: "6px", border: "1px solid #e2e8f0", borderRadius: "4px", fontSize: "12px" }} />
                    <input type="text" placeholder="Puntualacrimal" value={eyeExam.externalEyeExam.rightEye.lacrimalPuncta}
                      onChange={(e) => handleInputChange(["externalEyeExam", "rightEye", "lacrimalPuncta"], e.target.value)}
                      style={{ padding: "6px", border: "1px solid #e2e8f0", borderRadius: "4px", fontSize: "12px" }} />
                    <input type="text" placeholder="Iris" value={eyeExam.externalEyeExam.rightEye.iris}
                      onChange={(e) => handleInputChange(["externalEyeExam", "rightEye", "iris"], e.target.value)}
                      style={{ padding: "6px", border: "1px solid #e2e8f0", borderRadius: "4px", fontSize: "12px" }} />
                  </div>
                </div>
                <div style={{ background: "#f9fafb", padding: "12px", borderRadius: "6px", marginBottom: "12px" }}>
                  <p style={{ fontWeight: 500, marginBottom: "8px" }}>OI (Ojo Izquierdo)</p>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                    <input type="text" placeholder="Pupila" value={eyeExam.externalEyeExam.leftEye.pupil}
                      onChange={(e) => handleInputChange(["externalEyeExam", "leftEye", "pupil"], e.target.value)}
                      style={{ padding: "6px", border: "1px solid #e2e8f0", borderRadius: "4px", fontSize: "12px" }} />
                    <input type="text" placeholder="Conjuntiva" value={eyeExam.externalEyeExam.leftEye.conjunctiva}
                      onChange={(e) => handleInputChange(["externalEyeExam", "leftEye", "conjunctiva"], e.target.value)}
                      style={{ padding: "6px", border: "1px solid #e2e8f0", borderRadius: "4px", fontSize: "12px" }} />
                    <input type="text" placeholder="Cristalino" value={eyeExam.externalEyeExam.leftEye.cristallineLens}
                      onChange={(e) => handleInputChange(["externalEyeExam", "leftEye", "cristallineLens"], e.target.value)}
                      style={{ padding: "6px", border: "1px solid #e2e8f0", borderRadius: "4px", fontSize: "12px" }} />
                    <input type="text" placeholder="Cámara anterior" value={eyeExam.externalEyeExam.leftEye.anteriorChamber}
                      onChange={(e) => handleInputChange(["externalEyeExam", "leftEye", "anteriorChamber"], e.target.value)}
                      style={{ padding: "6px", border: "1px solid #e2e8f0", borderRadius: "4px", fontSize: "12px" }} />
                    <input type="text" placeholder="Párpados" value={eyeExam.externalEyeExam.leftEye.eyelids}
                      onChange={(e) => handleInputChange(["externalEyeExam", "leftEye", "eyelids"], e.target.value)}
                      style={{ padding: "6px", border: "1px solid #e2e8f0", borderRadius: "4px", fontSize: "12px" }} />
                    <input type="text" placeholder="Córnea" value={eyeExam.externalEyeExam.leftEye.cornea}
                      onChange={(e) => handleInputChange(["externalEyeExam", "leftEye", "cornea"], e.target.value)}
                      style={{ padding: "6px", border: "1px solid #e2e8f0", borderRadius: "4px", fontSize: "12px" }} />
                    <input type="text" placeholder="Puntualacrimal" value={eyeExam.externalEyeExam.leftEye.lacrimalPuncta}
                      onChange={(e) => handleInputChange(["externalEyeExam", "leftEye", "lacrimalPuncta"], e.target.value)}
                      style={{ padding: "6px", border: "1px solid #e2e8f0", borderRadius: "4px", fontSize: "12px" }} />
                    <input type="text" placeholder="Iris" value={eyeExam.externalEyeExam.leftEye.iris}
                      onChange={(e) => handleInputChange(["externalEyeExam", "leftEye", "iris"], e.target.value)}
                      style={{ padding: "6px", border: "1px solid #e2e8f0", borderRadius: "4px", fontSize: "12px" }} />
                  </div>
                </div>
                <input type="text" placeholder="Observaciones examen externo" value={eyeExam.externalEyeExam.observations}
                  onChange={(e) => handleInputChange(["externalEyeExam", "observations"], e.target.value)}
                  style={{ width: "100%", padding: "8px", border: "1px solid #e2e8f0", borderRadius: "6px" }} />
              </div>

              {/* Oftalmoscopía */}
              <div style={{ marginBottom: "24px" }}>
                <h3 style={{ fontSize: "16px", marginBottom: "12px", color: "#0a2540" }}>Oftalmoscopía</h3>
                <div style={{ background: "#f9fafb", padding: "12px", borderRadius: "6px", marginBottom: "12px" }}>
                  <p style={{ fontWeight: 500, marginBottom: "8px" }}>OD</p>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px" }}>
                    <input type="text" placeholder="Disco óptico" value={eyeExam.ophthalmoscopy.rightEye.opticDisc}
                      onChange={(e) => handleInputChange(["ophthalmoscopy", "rightEye", "opticDisc"], e.target.value)}
                      style={{ padding: "6px", border: "1px solid #e2e8f0", borderRadius: "4px", fontSize: "12px" }} />
                    <input type="text" placeholder="Cupping" value={eyeExam.ophthalmoscopy.rightEye.cupping}
                      onChange={(e) => handleInputChange(["ophthalmoscopy", "rightEye", "cupping"], e.target.value)}
                      style={{ padding: "6px", border: "1px solid #e2e8f0", borderRadius: "4px", fontSize: "12px" }} />
                    <input type="text" placeholder="Mácula" value={eyeExam.ophthalmoscopy.rightEye.macula}
                      onChange={(e) => handleInputChange(["ophthalmoscopy", "rightEye", "macula"], e.target.value)}
                      style={{ padding: "6px", border: "1px solid #e2e8f0", borderRadius: "4px", fontSize: "12px" }} />
                    <input type="text" placeholder="RAV" value={eyeExam.ophthalmoscopy.rightEye.rav}
                      onChange={(e) => handleInputChange(["ophthalmoscopy", "rightEye", "rav"], e.target.value)}
                      style={{ padding: "6px", border: "1px solid #e2e8f0", borderRadius: "4px", fontSize: "12px" }} />
                    <input type="text" placeholder="Media" value={eyeExam.ophthalmoscopy.rightEye.media}
                      onChange={(e) => handleInputChange(["ophthalmoscopy", "rightEye", "media"], e.target.value)}
                      style={{ padding: "6px", border: "1px solid #e2e8f0", borderRadius: "4px", fontSize: "12px" }} />
                    <input type="text" placeholder="Brillo foveal" value={eyeExam.ophthalmoscopy.rightEye.fovealBrightness}
                      onChange={(e) => handleInputChange(["ophthalmoscopy", "rightEye", "fovealBrightness"], e.target.value)}
                      style={{ padding: "6px", border: "1px solid #e2e8f0", borderRadius: "4px", fontSize: "12px" }} />
                  </div>
                </div>
                <div style={{ background: "#f9fafb", padding: "12px", borderRadius: "6px", marginBottom: "12px" }}>
                  <p style={{ fontWeight: 500, marginBottom: "8px" }}>OI</p>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px" }}>
                    <input type="text" placeholder="Disco óptico" value={eyeExam.ophthalmoscopy.leftEye.opticDisc}
                      onChange={(e) => handleInputChange(["ophthalmoscopy", "leftEye", "opticDisc"], e.target.value)}
                      style={{ padding: "6px", border: "1px solid #e2e8f0", borderRadius: "4px", fontSize: "12px" }} />
                    <input type="text" placeholder="Cupping" value={eyeExam.ophthalmoscopy.leftEye.cupping}
                      onChange={(e) => handleInputChange(["ophthalmoscopy", "leftEye", "cupping"], e.target.value)}
                      style={{ padding: "6px", border: "1px solid #e2e8f0", borderRadius: "4px", fontSize: "12px" }} />
                    <input type="text" placeholder="Mácula" value={eyeExam.ophthalmoscopy.leftEye.macula}
                      onChange={(e) => handleInputChange(["ophthalmoscopy", "leftEye", "macula"], e.target.value)}
                      style={{ padding: "6px", border: "1px solid #e2e8f0", borderRadius: "4px", fontSize: "12px" }} />
                    <input type="text" placeholder="RAV" value={eyeExam.ophthalmoscopy.leftEye.rav}
                      onChange={(e) => handleInputChange(["ophthalmoscopy", "leftEye", "rav"], e.target.value)}
                      style={{ padding: "6px", border: "1px solid #e2e8f0", borderRadius: "4px", fontSize: "12px" }} />
                    <input type="text" placeholder="Media" value={eyeExam.ophthalmoscopy.leftEye.media}
                      onChange={(e) => handleInputChange(["ophthalmoscopy", "leftEye", "media"], e.target.value)}
                      style={{ padding: "6px", border: "1px solid #e2e8f0", borderRadius: "4px", fontSize: "12px" }} />
                    <input type="text" placeholder="Brillo foveal" value={eyeExam.ophthalmoscopy.leftEye.fovealBrightness}
                      onChange={(e) => handleInputChange(["ophthalmoscopy", "leftEye", "fovealBrightness"], e.target.value)}
                      style={{ padding: "6px", border: "1px solid #e2e8f0", borderRadius: "4px", fontSize: "12px" }} />
                  </div>
                </div>
                <input type="text" placeholder="Observaciones oftalmoscopía" value={eyeExam.ophthalmoscopy.observations}
                  onChange={(e) => handleInputChange(["ophthalmoscopy", "observations"], e.target.value)}
                  style={{ width: "100%", padding: "8px", border: "1px solid #e2e8f0", borderRadius: "6px" }} />
              </div>

              {/* Queratometría */}
              <div style={{ marginBottom: "24px" }}>
                <h3 style={{ fontSize: "16px", marginBottom: "12px", color: "#0a2540" }}>Queratometría</h3>
                <div style={{ background: "#f9fafb", padding: "12px", borderRadius: "6px", marginBottom: "12px" }}>
                  <p style={{ fontWeight: 500, marginBottom: "8px" }}>OD</p>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px" }}>
                    <input type="text" placeholder="Horizontal" value={eyeExam.keratometry.rightEye.horizontal}
                      onChange={(e) => handleInputChange(["keratometry", "rightEye", "horizontal"], e.target.value)}
                      style={{ padding: "6px", border: "1px solid #e2e8f0", borderRadius: "4px", fontSize: "12px" }} />
                    <input type="text" placeholder="Vertical" value={eyeExam.keratometry.rightEye.vertical}
                      onChange={(e) => handleInputChange(["keratometry", "rightEye", "vertical"], e.target.value)}
                      style={{ padding: "6px", border: "1px solid #e2e8f0", borderRadius: "4px", fontSize: "12px" }} />
                    <input type="text" placeholder="Eje" value={eyeExam.keratometry.rightEye.axis}
                      onChange={(e) => handleInputChange(["keratometry", "rightEye", "axis"], e.target.value)}
                      style={{ padding: "6px", border: "1px solid #e2e8f0", borderRadius: "4px", fontSize: "12px" }} />
                    <input type="text" placeholder="Miras" value={eyeExam.keratometry.rightEye.sights}
                      onChange={(e) => handleInputChange(["keratometry", "rightEye", "sights"], e.target.value)}
                      style={{ padding: "6px", border: "1px solid #e2e8f0", borderRadius: "4px", fontSize: "12px" }} />
                    <input type="text" placeholder="Astigmatismo" value={eyeExam.keratometry.rightEye.astigmatism}
                      onChange={(e) => handleInputChange(["keratometry", "rightEye", "astigmatism"], e.target.value)}
                      style={{ padding: "6px", border: "1px solid #e2e8f0", borderRadius: "4px", fontSize: "12px" }} />
                  </div>
                </div>
                <div style={{ background: "#f9fafb", padding: "12px", borderRadius: "6px", marginBottom: "12px" }}>
                  <p style={{ fontWeight: 500, marginBottom: "8px" }}>OI</p>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px" }}>
                    <input type="text" placeholder="Horizontal" value={eyeExam.keratometry.leftEye.horizontal}
                      onChange={(e) => handleInputChange(["keratometry", "leftEye", "horizontal"], e.target.value)}
                      style={{ padding: "6px", border: "1px solid #e2e8f0", borderRadius: "4px", fontSize: "12px" }} />
                    <input type="text" placeholder="Vertical" value={eyeExam.keratometry.leftEye.vertical}
                      onChange={(e) => handleInputChange(["keratometry", "leftEye", "vertical"], e.target.value)}
                      style={{ padding: "6px", border: "1px solid #e2e8f0", borderRadius: "4px", fontSize: "12px" }} />
                    <input type="text" placeholder="Eje" value={eyeExam.keratometry.leftEye.axis}
                      onChange={(e) => handleInputChange(["keratometry", "leftEye", "axis"], e.target.value)}
                      style={{ padding: "6px", border: "1px solid #e2e8f0", borderRadius: "4px", fontSize: "12px" }} />
                    <input type="text" placeholder="Miras" value={eyeExam.keratometry.leftEye.sights}
                      onChange={(e) => handleInputChange(["keratometry", "leftEye", "sights"], e.target.value)}
                      style={{ padding: "6px", border: "1px solid #e2e8f0", borderRadius: "4px", fontSize: "12px" }} />
                    <input type="text" placeholder="Astigmatismo" value={eyeExam.keratometry.leftEye.astigmatism}
                      onChange={(e) => handleInputChange(["keratometry", "leftEye", "astigmatism"], e.target.value)}
                      style={{ padding: "6px", border: "1px solid #e2e8f0", borderRadius: "4px", fontSize: "12px" }} />
                  </div>
                </div>
              </div>

              {/* Refracción */}
              <div style={{ marginBottom: "24px" }}>
                <h3 style={{ fontSize: "16px", marginBottom: "12px", color: "#0a2540" }}>Refracción</h3>
                
                <div style={{ marginBottom: "16px" }}>
                  <h4 style={{ fontSize: "14px", marginBottom: "8px", color: "#64748b" }}>Retinoscopia Estática</h4>
                  <div style={{ background: "#f9fafb", padding: "12px", borderRadius: "6px", marginBottom: "8px" }}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px" }}>
                      <input type="text" placeholder="OD Horizontal" value={eyeExam.refraction.staticRetinoscopy.rightEye.horizontal}
                        onChange={(e) => handleInputChange(["refraction", "staticRetinoscopy", "rightEye", "horizontal"], e.target.value)}
                        style={{ padding: "6px", border: "1px solid #e2e8f0", borderRadius: "4px", fontSize: "12px" }} />
                      <input type="text" placeholder="OD Vertical" value={eyeExam.refraction.staticRetinoscopy.rightEye.vertical}
                        onChange={(e) => handleInputChange(["refraction", "staticRetinoscopy", "rightEye", "vertical"], e.target.value)}
                        style={{ padding: "6px", border: "1px solid #e2e8f0", borderRadius: "4px", fontSize: "12px" }} />
                      <input type="text" placeholder="OD Eje" value={eyeExam.refraction.staticRetinoscopy.rightEye.axis}
                        onChange={(e) => handleInputChange(["refraction", "staticRetinoscopy", "rightEye", "axis"], e.target.value)}
                        style={{ padding: "6px", border: "1px solid #e2e8f0", borderRadius: "4px", fontSize: "12px" }} />
                      <input type="text" placeholder="OI Horizontal" value={eyeExam.refraction.staticRetinoscopy.leftEye.horizontal}
                        onChange={(e) => handleInputChange(["refraction", "staticRetinoscopy", "leftEye", "horizontal"], e.target.value)}
                        style={{ padding: "6px", border: "1px solid #e2e8f0", borderRadius: "4px", fontSize: "12px" }} />
                      <input type="text" placeholder="OI Vertical" value={eyeExam.refraction.staticRetinoscopy.leftEye.vertical}
                        onChange={(e) => handleInputChange(["refraction", "staticRetinoscopy", "leftEye", "vertical"], e.target.value)}
                        style={{ padding: "6px", border: "1px solid #e2e8f0", borderRadius: "4px", fontSize: "12px" }} />
                      <input type="text" placeholder="OI Eje" value={eyeExam.refraction.staticRetinoscopy.leftEye.axis}
                        onChange={(e) => handleInputChange(["refraction", "staticRetinoscopy", "leftEye", "axis"], e.target.value)}
                        style={{ padding: "6px", border: "1px solid #e2e8f0", borderRadius: "4px", fontSize: "12px" }} />
                    </div>
                  </div>
                </div>

                <div style={{ marginBottom: "16px" }}>
                  <h4 style={{ fontSize: "14px", marginBottom: "8px", color: "#64748b" }}>Retinoscopia Dinámica</h4>
                  <div style={{ background: "#f9fafb", padding: "12px", borderRadius: "6px", marginBottom: "8px" }}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px" }}>
                      <input type="text" placeholder="OD Horizontal" value={eyeExam.refraction.dynamicRetinoscopy.rightEye.horizontal}
                        onChange={(e) => handleInputChange(["refraction", "dynamicRetinoscopy", "rightEye", "horizontal"], e.target.value)}
                        style={{ padding: "6px", border: "1px solid #e2e8f0", borderRadius: "4px", fontSize: "12px" }} />
                      <input type="text" placeholder="OD Vertical" value={eyeExam.refraction.dynamicRetinoscopy.rightEye.vertical}
                        onChange={(e) => handleInputChange(["refraction", "dynamicRetinoscopy", "rightEye", "vertical"], e.target.value)}
                        style={{ padding: "6px", border: "1px solid #e2e8f0", borderRadius: "4px", fontSize: "12px" }} />
                      <input type="text" placeholder="OD Eje" value={eyeExam.refraction.dynamicRetinoscopy.rightEye.axis}
                        onChange={(e) => handleInputChange(["refraction", "dynamicRetinoscopy", "rightEye", "axis"], e.target.value)}
                        style={{ padding: "6px", border: "1px solid #e2e8f0", borderRadius: "4px", fontSize: "12px" }} />
                      <input type="text" placeholder="OI Horizontal" value={eyeExam.refraction.dynamicRetinoscopy.leftEye.horizontal}
                        onChange={(e) => handleInputChange(["refraction", "dynamicRetinoscopy", "leftEye", "horizontal"], e.target.value)}
                        style={{ padding: "6px", border: "1px solid #e2e8f0", borderRadius: "4px", fontSize: "12px" }} />
                      <input type="text" placeholder="OI Vertical" value={eyeExam.refraction.dynamicRetinoscopy.leftEye.vertical}
                        onChange={(e) => handleInputChange(["refraction", "dynamicRetinoscopy", "leftEye", "vertical"], e.target.value)}
                        style={{ padding: "6px", border: "1px solid #e2e8f0", borderRadius: "4px", fontSize: "12px" }} />
                      <input type="text" placeholder="OI Eje" value={eyeExam.refraction.dynamicRetinoscopy.leftEye.axis}
                        onChange={(e) => handleInputChange(["refraction", "dynamicRetinoscopy", "leftEye", "axis"], e.target.value)}
                        style={{ padding: "6px", border: "1px solid #e2e8f0", borderRadius: "4px", fontSize: "12px" }} />
                    </div>
                  </div>
                </div>

                <div>
                  <h4 style={{ fontSize: "14px", marginBottom: "8px", color: "#64748b" }}>Subjetiva</h4>
                  <div style={{ background: "#f9fafb", padding: "12px", borderRadius: "6px" }}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px" }}>
                      <input type="text" placeholder="OD Horizontal" value={eyeExam.refraction.subjective.rightEye.horizontal}
                        onChange={(e) => handleInputChange(["refraction", "subjective", "rightEye", "horizontal"], e.target.value)}
                        style={{ padding: "6px", border: "1px solid #e2e8f0", borderRadius: "4px", fontSize: "12px" }} />
                      <input type="text" placeholder="OD Vertical" value={eyeExam.refraction.subjective.rightEye.vertical}
                        onChange={(e) => handleInputChange(["refraction", "subjective", "rightEye", "vertical"], e.target.value)}
                        style={{ padding: "6px", border: "1px solid #e2e8f0", borderRadius: "4px", fontSize: "12px" }} />
                      <input type="text" placeholder="OD Eje" value={eyeExam.refraction.subjective.rightEye.axis}
                        onChange={(e) => handleInputChange(["refraction", "subjective", "rightEye", "axis"], e.target.value)}
                        style={{ padding: "6px", border: "1px solid #e2e8f0", borderRadius: "4px", fontSize: "12px" }} />
                      <input type="text" placeholder="OI Horizontal" value={eyeExam.refraction.subjective.leftEye.horizontal}
                        onChange={(e) => handleInputChange(["refraction", "subjective", "leftEye", "horizontal"], e.target.value)}
                        style={{ padding: "6px", border: "1px solid #e2e8f0", borderRadius: "4px", fontSize: "12px" }} />
                      <input type="text" placeholder="OI Vertical" value={eyeExam.refraction.subjective.leftEye.vertical}
                        onChange={(e) => handleInputChange(["refraction", "subjective", "leftEye", "vertical"], e.target.value)}
                        style={{ padding: "6px", border: "1px solid #e2e8f0", borderRadius: "4px", fontSize: "12px" }} />
                      <input type="text" placeholder="OI Eje" value={eyeExam.refraction.subjective.leftEye.axis}
                        onChange={(e) => handleInputChange(["refraction", "subjective", "leftEye", "axis"], e.target.value)}
                        style={{ padding: "6px", border: "1px solid #e2e8f0", borderRadius: "4px", fontSize: "12px" }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Fórmula Final (Rx) */}
              <div style={{ marginBottom: "24px" }}>
                <h3 style={{ fontSize: "16px", marginBottom: "12px", color: "#0a2540" }}>Fórmula Final (Rx)</h3>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "12px" }}>
                  <input type="text" placeholder="Prescripción OD" value={eyeExam.rx.prescriptionRE}
                    onChange={(e) => handleInputChange(["rx", "prescriptionRE"], e.target.value)}
                    style={{ padding: "8px", border: "1px solid #e2e8f0", borderRadius: "6px" }} />
                  <input type="text" placeholder="Prescripción OI" value={eyeExam.rx.prescriptionLE}
                    onChange={(e) => handleInputChange(["rx", "prescriptionLE"], e.target.value)}
                    style={{ padding: "8px", border: "1px solid #e2e8f0", borderRadius: "6px" }} />
                  <input type="text" placeholder="Montaje de parámetros" value={eyeExam.rx.paramMounting}
                    onChange={(e) => handleInputChange(["rx", "paramMounting"], e.target.value)}
                    style={{ padding: "8px", border: "1px solid #e2e8f0", borderRadius: "6px" }} />
                  <input type="text" placeholder="Tipo de lente" value={eyeExam.rx.lensType}
                    onChange={(e) => handleInputChange(["rx", "lensType"], e.target.value)}
                    style={{ padding: "8px", border: "1px solid #e2e8f0", borderRadius: "6px" }} />
                  <input type="text" placeholder="Distancia pupilar" value={eyeExam.rx.pupillaryDistance}
                    onChange={(e) => handleInputChange(["rx", "pupillaryDistance"], e.target.value)}
                    style={{ padding: "8px", border: "1px solid #e2e8f0", borderRadius: "6px" }} />
                </div>
                <textarea
                  rows="3"
                  placeholder="Observaciones de la prescripción"
                  value={eyeExam.rx.observations}
                  onChange={(e) => handleInputChange(["rx", "observations"], e.target.value)}
                  style={{ width: "100%", padding: "10px", border: "1px solid #e2e8f0", borderRadius: "8px", fontFamily: "inherit" }}
                />
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