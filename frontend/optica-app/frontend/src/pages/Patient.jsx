import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  getPatient,
  getAllPatients,
  createPatient,
  updatePatient,
  deletePatient,
  getSexos,
  getEstadosCiviles,
} from "../api/patient.api";

function Patient() {
  const [user, setUser] = useState({ nombre: "Invitado", rol: "OPTOMETRA" });
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const [searchDoc, setSearchDoc] = useState("");
  const [searchResult, setSearchResult] = useState(null);
  const [searchError, setSearchError] = useState("");
  const [patients, setPatients] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [sexos, setSexos] = useState([]);
  const [estadosCiviles, setEstadosCiviles] = useState([]);

  const [formData, setFormData] = useState({
    documento: "",
    nombres: "",
    apellidos: "",
    sexo: "M",
    fechaNacimiento: "",
    estadoCivil: "SOLTERO",
    ocupacion: "",
    departamento: "",
    ciudad: "",
    direccion: "",
    correoElectronico: "",
    telefono: "",
    eps: "",
    acudiente: {
      nombre: "",
      telefono: "",
      parentesco: "",
      correo: "",
    },
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUser({ id: payload.id, nombre: payload.nombre, rol: payload.rol });
      } catch (error) {
        console.warn("Token inválido en localStorage:", error);
      }
    }
    loadEnums();
    loadPatients();
  }, [page]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const loadEnums = async () => {
    const sexosData = await getSexos();
    const estadosData = await getEstadosCiviles();
    setSexos(sexosData);
    setEstadosCiviles(estadosData);
  };

  const loadPatients = async () => {
    const data = await getAllPatients(page, 10);
    setPatients(data.data);
    setTotal(data.total);
  };

  const handleSearch = async () => {
    setSearchError("");
    try {
      const data = await getPatient(searchDoc);
      setSearchResult(data);
    } catch (err) {
      setSearchError(err.response?.data?.error || "Paciente no encontrado");
      setSearchResult(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updatePatient(editingId, formData);
        alert("Paciente actualizado");
      } else {
        await createPatient(formData);
        alert("Paciente creado");
      }
      setShowForm(false);
      resetForm();
      loadPatients();
    } catch (err) {
      alert(err.response?.data?.error || "Error al guardar");
    }
  };

  const handleDelete = async (id) => {
    if (confirm("¿Eliminar este paciente?")) {
      await deletePatient(id);
      loadPatients();
    }
  };

  const handleEdit = (patient) => {
    setFormData({
      documento: patient.documento,
      nombres: patient.nombres,
      apellidos: patient.apellidos,
      sexo: patient.sexo,
      fechaNacimiento: patient.fechaNacimiento,
      estadoCivil: patient.estadoCivil,
      ocupacion: patient.ocupacion || "",
      departamento: patient.departamento || "",
      ciudad: patient.ciudad || "",
      direccion: patient.direccion || "",
      correoElectronico: patient.correoElectronico,
      telefono: patient.telefono,
      eps: patient.eps || "",
      acudiente: patient.acudiente || {
        nombre: "",
        telefono: "",
        parentesco: "",
        correo: "",
      },
    });
    setEditingId(patient.id);
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      documento: "",
      nombres: "",
      apellidos: "",
      sexo: "M",
      fechaNacimiento: "",
      estadoCivil: "SOLTERO",
      ocupacion: "",
      departamento: "",
      ciudad: "",
      direccion: "",
      correoElectronico: "",
      telefono: "",
      eps: "",
      acudiente: {
        nombre: "",
        telefono: "",
        parentesco: "",
        correo: "",
      },
    });
    setEditingId(null);
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
        <nav style={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          padding: "20px 0",
        }}>
          {user.rol?.toLowerCase() === "optometra" && (
            <>
              <button
                onClick={() => { navigate("/users"); setMenuOpen(false); }}
                style={{
                  background: "none", border: "none",
                  color: "rgba(255,255,255,0.8)", padding: "12px 20px",
                  fontSize: "14px", cursor: "pointer", textAlign: "left",
                }}
                onMouseEnter={(e) => { e.target.style.background = "rgba(255,255,255,0.1)"; e.target.style.color = "white"; e.target.style.paddingLeft = "24px"; }}
                onMouseLeave={(e) => { e.target.style.background = "none"; e.target.style.color = "rgba(255,255,255,0.8)"; e.target.style.paddingLeft = "20px"; }}
              >
                Gestionar Usuarios
              </button>
              <button
                onClick={() => { navigate("/appointments"); setMenuOpen(false); }}
                style={{
                  background: "none", border: "none",
                  color: "rgba(255,255,255,0.8)", padding: "12px 20px",
                  fontSize: "14px", cursor: "pointer", textAlign: "left",
                }}
                onMouseEnter={(e) => { e.target.style.background = "rgba(255,255,255,0.1)"; e.target.style.color = "white"; e.target.style.paddingLeft = "24px"; }}
                onMouseLeave={(e) => { e.target.style.background = "none"; e.target.style.color = "rgba(255,255,255,0.8)"; e.target.style.paddingLeft = "20px"; }}
              >
                Gestionar Citas
              </button>
              <button
                onClick={() => { navigate("/patient"); setMenuOpen(false); }}
                style={{
                  background: "none", border: "none",
                  color: "rgba(255,255,255,0.8)", padding: "12px 20px",
                  fontSize: "14px", cursor: "pointer", textAlign: "left",
                }}
                onMouseEnter={(e) => { e.target.style.background = "rgba(255,255,255,0.1)"; e.target.style.color = "white"; e.target.style.paddingLeft = "24px"; }}
                onMouseLeave={(e) => { e.target.style.background = "none"; e.target.style.color = "rgba(255,255,255,0.8)"; e.target.style.paddingLeft = "20px"; }}
              >
                Gestionar Pacientes
              </button>
            </>
          )}
          {user.rol?.toLowerCase() === "secretario" && (
            <>
              <button
                onClick={() => { navigate("/users"); setMenuOpen(false); }}
                style={{
                  background: "none", border: "none",
                  color: "rgba(255,255,255,0.8)", padding: "12px 20px",
                  fontSize: "14px", cursor: "pointer", textAlign: "left",
                }}
                onMouseEnter={(e) => { e.target.style.background = "rgba(255,255,255,0.1)"; e.target.style.color = "white"; e.target.style.paddingLeft = "24px"; }}
                onMouseLeave={(e) => { e.target.style.background = "none"; e.target.style.color = "rgba(255,255,255,0.8)"; e.target.style.paddingLeft = "20px"; }}
              >
                Consultar Usuarios
              </button>
              <button
                onClick={() => { navigate("/appointments"); setMenuOpen(false); }}
                style={{
                  background: "none", border: "none",
                  color: "rgba(255,255,255,0.8)", padding: "12px 20px",
                  fontSize: "14px", cursor: "pointer", textAlign: "left",
                }}
                onMouseEnter={(e) => { e.target.style.background = "rgba(255,255,255,0.1)"; e.target.style.color = "white"; e.target.style.paddingLeft = "24px"; }}
                onMouseLeave={(e) => { e.target.style.background = "none"; e.target.style.color = "rgba(255,255,255,0.8)"; e.target.style.paddingLeft = "20px"; }}
              >
                Consultar Citas
              </button>
              <button
                onClick={() => { navigate("/patient"); setMenuOpen(false); }}
                style={{
                  background: "none", border: "none",
                  color: "rgba(255,255,255,0.8)", padding: "12px 20px",
                  fontSize: "14px", cursor: "pointer", textAlign: "left",
                }}
                onMouseEnter={(e) => { e.target.style.background = "rgba(255,255,255,0.1)"; e.target.style.color = "white"; e.target.style.paddingLeft = "24px"; }}
                onMouseLeave={(e) => { e.target.style.background = "none"; e.target.style.color = "rgba(255,255,255,0.8)"; e.target.style.paddingLeft = "20px"; }}
              >
                Consultar Pacientes
              </button>
            </>
          )}
        </nav>
      </div>

      {menuOpen && (
        <div
          onClick={() => setMenuOpen(false)}
          style={{
            position: "fixed", top: "60px", left: "0",
            width: "100%", height: "calc(100vh - 60px)",
            background: "rgba(0,0,0,0.3)", zIndex: "99",
          }}
        />
      )}

      {/* Contenido principal */}
      <div style={{ padding: "30px 40px", maxWidth: "1400px", margin: "0 auto" }}>
        <h1 style={{
          fontFamily: "'Playfair Display', serif",
          color: "#0a2540", fontSize: "26px",
          marginBottom: "24px",
        }}>
          Gestión de Pacientes
        </h1>

        {/* Buscar por documento */}
        <div style={{
          background: "white", borderRadius: "12px",
          padding: "20px", marginBottom: "24px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
        }}>
          <h3 style={{ fontSize: "16px", marginBottom: "16px", color: "#0a2540" }}>Buscar por Documento</h3>
          <div style={{ display: "flex", gap: "12px" }}>
            <input
              type="text"
              placeholder="Documento"
              value={searchDoc}
              onChange={(e) => setSearchDoc(e.target.value)}
              style={{
                flex: 1, padding: "10px 14px",
                border: "1px solid #e2e8f0", borderRadius: "8px",
                fontSize: "14px", outline: "none",
              }}
              onFocus={e => e.target.style.borderColor = "#0d5c8f"}
              onBlur={e => e.target.style.borderColor = "#e2e8f0"}
            />
            <button
              onClick={handleSearch}
              style={{
                padding: "8px 20px", background: "#0a2540",
                color: "white", border: "none", borderRadius: "8px",
                cursor: "pointer", fontSize: "14px", fontWeight: 500,
              }}
              onMouseEnter={e => e.target.style.background = "#0d5c8f"}
              onMouseLeave={e => e.target.style.background = "#0a2540"}
            >
              Buscar
            </button>
          </div>
          {searchError && <p style={{ color: "#c53030", fontSize: "13px", marginTop: "12px" }}>{searchError}</p>}
          {searchResult && (
            <div style={{ marginTop: "16px", padding: "12px", background: "#f8fafc", borderRadius: "8px" }}>
              <p><strong>{searchResult.nombres} {searchResult.apellidos}</strong></p>
              <p style={{ fontSize: "13px", color: "#64748b" }}>Documento: {searchResult.documento} | Correo: {searchResult.correoElectronico}</p>
            </div>
          )}
        </div>

        {/* Botón nuevo paciente */}
        <button
          onClick={() => { resetForm(); setShowForm(!showForm); }}
          style={{
            padding: "10px 20px", background: "#28a745", color: "white",
            border: "none", borderRadius: "8px", cursor: "pointer",
            fontSize: "14px", fontWeight: 500, marginBottom: "24px",
          }}
          onMouseEnter={e => e.target.style.background = "#218838"}
          onMouseLeave={e => e.target.style.background = "#28a745"}
        >
          {showForm ? "Cancelar" : "Nuevo Paciente"}
        </button>

        {/* Formulario */}
        {showForm && (
          <form onSubmit={handleSubmit} style={{
            background: "white", borderRadius: "12px",
            padding: "24px", marginBottom: "24px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
          }}>
            <h3 style={{ fontSize: "18px", marginBottom: "20px", color: "#0a2540" }}>
              {editingId ? "Editar Paciente" : "Nuevo Paciente"}
            </h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "16px" }}>
              <input type="text" placeholder="Documento *" value={formData.documento} onChange={(e) => setFormData({ ...formData, documento: e.target.value })} required style={{ padding: "10px", border: "1px solid #e2e8f0", borderRadius: "8px" }} />
              <input type="text" placeholder="Nombres *" value={formData.nombres} onChange={(e) => setFormData({ ...formData, nombres: e.target.value })} required style={{ padding: "10px", border: "1px solid #e2e8f0", borderRadius: "8px" }} />
              <input type="text" placeholder="Apellidos *" value={formData.apellidos} onChange={(e) => setFormData({ ...formData, apellidos: e.target.value })} required style={{ padding: "10px", border: "1px solid #e2e8f0", borderRadius: "8px" }} />
              <select value={formData.sexo} onChange={(e) => setFormData({ ...formData, sexo: e.target.value })} style={{ padding: "10px", border: "1px solid #e2e8f0", borderRadius: "8px" }}>
                {sexos.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
              <input type="date" placeholder="Fecha Nacimiento *" value={formData.fechaNacimiento} onChange={(e) => setFormData({ ...formData, fechaNacimiento: e.target.value })} required style={{ padding: "10px", border: "1px solid #e2e8f0", borderRadius: "8px" }} />
              <select value={formData.estadoCivil} onChange={(e) => setFormData({ ...formData, estadoCivil: e.target.value })} style={{ padding: "10px", border: "1px solid #e2e8f0", borderRadius: "8px" }}>
                {estadosCiviles.map(e => <option key={e.value} value={e.value}>{e.label}</option>)}
              </select>
              <input type="text" placeholder="Ocupación" value={formData.ocupacion} onChange={(e) => setFormData({ ...formData, ocupacion: e.target.value })} style={{ padding: "10px", border: "1px solid #e2e8f0", borderRadius: "8px" }} />
              <input type="text" placeholder="Departamento" value={formData.departamento} onChange={(e) => setFormData({ ...formData, departamento: e.target.value })} style={{ padding: "10px", border: "1px solid #e2e8f0", borderRadius: "8px" }} />
              <input type="text" placeholder="Ciudad" value={formData.ciudad} onChange={(e) => setFormData({ ...formData, ciudad: e.target.value })} style={{ padding: "10px", border: "1px solid #e2e8f0", borderRadius: "8px" }} />
              <input type="text" placeholder="Dirección" value={formData.direccion} onChange={(e) => setFormData({ ...formData, direccion: e.target.value })} style={{ padding: "10px", border: "1px solid #e2e8f0", borderRadius: "8px" }} />
              <input type="email" placeholder="Correo *" value={formData.correoElectronico} onChange={(e) => setFormData({ ...formData, correoElectronico: e.target.value })} required style={{ padding: "10px", border: "1px solid #e2e8f0", borderRadius: "8px" }} />
              <input type="text" placeholder="Teléfono *" value={formData.telefono} onChange={(e) => setFormData({ ...formData, telefono: e.target.value })} required style={{ padding: "10px", border: "1px solid #e2e8f0", borderRadius: "8px" }} />
              <input type="text" placeholder="EPS" value={formData.eps} onChange={(e) => setFormData({ ...formData, eps: e.target.value })} style={{ padding: "10px", border: "1px solid #e2e8f0", borderRadius: "8px" }} />
            </div>

            <h4 style={{ marginTop: "20px", marginBottom: "12px", fontSize: "15px", color: "#0a2540" }}>Acudiente (opcional)</h4>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "16px" }}>
              <input type="text" placeholder="Nombre" value={formData.acudiente.nombre} onChange={(e) => setFormData({ ...formData, acudiente: { ...formData.acudiente, nombre: e.target.value } })} style={{ padding: "10px", border: "1px solid #e2e8f0", borderRadius: "8px" }} />
              <input type="text" placeholder="Teléfono" value={formData.acudiente.telefono} onChange={(e) => setFormData({ ...formData, acudiente: { ...formData.acudiente, telefono: e.target.value } })} style={{ padding: "10px", border: "1px solid #e2e8f0", borderRadius: "8px" }} />
              <input type="text" placeholder="Parentesco" value={formData.acudiente.parentesco} onChange={(e) => setFormData({ ...formData, acudiente: { ...formData.acudiente, parentesco: e.target.value } })} style={{ padding: "10px", border: "1px solid #e2e8f0", borderRadius: "8px" }} />
              <input type="email" placeholder="Correo" value={formData.acudiente.correo} onChange={(e) => setFormData({ ...formData, acudiente: { ...formData.acudiente, correo: e.target.value } })} style={{ padding: "10px", border: "1px solid #e2e8f0", borderRadius: "8px" }} />
            </div>

            <button type="submit" style={{
              marginTop: "24px", padding: "10px 24px", background: "#0a2540",
              color: "white", border: "none", borderRadius: "8px", cursor: "pointer",
            }} onMouseEnter={e => e.target.style.background = "#0d5c8f"}
               onMouseLeave={e => e.target.style.background = "#0a2540"}>
              {editingId ? "Actualizar" : "Guardar"}
            </button>
          </form>
        )}

        {/* Tabla de pacientes */}
        <div style={{ background: "white", borderRadius: "12px", overflow: "auto", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#f8fafc", borderBottom: "1px solid #e2e8f0" }}>
                <th style={{ padding: "14px", textAlign: "left", fontSize: "13px", color: "#0a2540" }}>ID</th>
                <th style={{ padding: "14px", textAlign: "left", fontSize: "13px", color: "#0a2540" }}>Documento</th>
                <th style={{ padding: "14px", textAlign: "left", fontSize: "13px", color: "#0a2540" }}>Nombre</th>
                <th style={{ padding: "14px", textAlign: "left", fontSize: "13px", color: "#0a2540" }}>Correo</th>
                <th style={{ padding: "14px", textAlign: "left", fontSize: "13px", color: "#0a2540" }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {patients.map(p => (
                <tr key={p.id} style={{ borderBottom: "1px solid #e2e8f0" }}>
                  <td style={{ padding: "12px", fontSize: "14px" }}>{p.id}</td>
                  <td style={{ padding: "12px", fontSize: "14px" }}>{p.documento}</td>
                  <td style={{ padding: "12px", fontSize: "14px" }}>{p.nombres} {p.apellidos}</td>
                  <td style={{ padding: "12px", fontSize: "14px" }}>{p.correoElectronico}</td>
                  <td style={{ padding: "12px" }}>
                    <button onClick={() => handleEdit(p)} style={{ marginRight: "8px", padding: "4px 12px", background: "#ffc107", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "12px" }}>Editar</button>
                    <button onClick={() => handleDelete(p.id)} style={{ padding: "4px 12px", background: "#dc3545", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "12px" }}>Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Paginación */}
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: "24px" }}>
          <button disabled={page === 1} onClick={() => setPage(p => p - 1)} style={{ padding: "8px 16px", background: "#6c757d", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", opacity: page === 1 ? 0.5 : 1 }}>Anterior</button>
          <span style={{ fontSize: "14px", color: "#64748b" }}>Página {page} de {Math.ceil(total / 10)}</span>
          <button disabled={page >= Math.ceil(total / 10)} onClick={() => setPage(p => p + 1)} style={{ padding: "8px 16px", background: "#6c757d", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", opacity: page >= Math.ceil(total / 10) ? 0.5 : 1 }}>Siguiente</button>
        </div>
      </div>
    </div>
  );
}

export default Patient;