import { useState, useEffect } from "react";
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
    loadEnums();
    loadPatients();
  }, [page]);

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
    <div style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
      <h1>Gestión de Pacientes</h1>

      {/* Buscar por documento */}
      <div style={{ border: "1px solid #ddd", padding: "15px", marginBottom: "20px", borderRadius: "8px" }}>
        <h3>Buscar por Documento</h3>
        <div style={{ display: "flex", gap: "10px" }}>
          <input
            type="text"
            placeholder="Documento"
            value={searchDoc}
            onChange={(e) => setSearchDoc(e.target.value)}
            style={{ flex: 1, padding: "8px" }}
          />
          <button onClick={handleSearch} style={{ padding: "8px 16px", background: "#007bff", color: "white", border: "none", borderRadius: "4px" }}>
            Buscar
          </button>
        </div>
        {searchError && <p style={{ color: "red", marginTop: "10px" }}>{searchError}</p>}
        {searchResult && (
          <div style={{ marginTop: "10px", padding: "10px", background: "#f0f0f0", borderRadius: "4px" }}>
            <p>
              <strong>{searchResult.nombres} {searchResult.apellidos}</strong>
            </p>
            <p>Documento: {searchResult.documento}</p>
            <p>Correo: {searchResult.correoElectronico}</p>
          </div>
        )}
      </div>

      {/* Botón nuevo paciente */}
      <button
        onClick={() => {
          resetForm();
          setShowForm(!showForm);
        }}
        style={{ padding: "8px 16px", background: "#28a745", color: "white", border: "none", borderRadius: "4px", marginBottom: "20px" }}
      >
        {showForm ? "Cancelar" : "Nuevo Paciente"}
      </button>

      {/* Formulario */}
      {showForm && (
        <form onSubmit={handleSubmit} style={{ border: "1px solid #ddd", padding: "15px", borderRadius: "8px", marginBottom: "20px" }}>
          <h3>{editingId ? "Editar Paciente" : "Nuevo Paciente"}</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
            <input type="text" placeholder="Documento *" value={formData.documento} onChange={(e) => setFormData({ ...formData, documento: e.target.value })} required />
            <input type="text" placeholder="Nombres *" value={formData.nombres} onChange={(e) => setFormData({ ...formData, nombres: e.target.value })} required />
            <input type="text" placeholder="Apellidos *" value={formData.apellidos} onChange={(e) => setFormData({ ...formData, apellidos: e.target.value })} required />
            <select value={formData.sexo} onChange={(e) => setFormData({ ...formData, sexo: e.target.value })}>
              {sexos.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
            <input type="date" placeholder="Fecha Nacimiento *" value={formData.fechaNacimiento} onChange={(e) => setFormData({ ...formData, fechaNacimiento: e.target.value })} required />
            <select value={formData.estadoCivil} onChange={(e) => setFormData({ ...formData, estadoCivil: e.target.value })}>
              {estadosCiviles.map((e) => (
                <option key={e.value} value={e.value}>{e.label}</option>
              ))}
            </select>
            <input type="text" placeholder="Ocupación" value={formData.ocupacion} onChange={(e) => setFormData({ ...formData, ocupacion: e.target.value })} />
            <input type="text" placeholder="Departamento" value={formData.departamento} onChange={(e) => setFormData({ ...formData, departamento: e.target.value })} />
            <input type="text" placeholder="Ciudad" value={formData.ciudad} onChange={(e) => setFormData({ ...formData, ciudad: e.target.value })} />
            <input type="text" placeholder="Dirección" value={formData.direccion} onChange={(e) => setFormData({ ...formData, direccion: e.target.value })} />
            <input type="email" placeholder="Correo *" value={formData.correoElectronico} onChange={(e) => setFormData({ ...formData, correoElectronico: e.target.value })} required />
            <input type="text" placeholder="Teléfono *" value={formData.telefono} onChange={(e) => setFormData({ ...formData, telefono: e.target.value })} required />
            <input type="text" placeholder="EPS" value={formData.eps} onChange={(e) => setFormData({ ...formData, eps: e.target.value })} />
          </div>

          <h4 style={{ marginTop: "15px" }}>Acudiente (opcional)</h4>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
            <input type="text" placeholder="Nombre" value={formData.acudiente.nombre} onChange={(e) => setFormData({ ...formData, acudiente: { ...formData.acudiente, nombre: e.target.value } })} />
            <input type="text" placeholder="Teléfono" value={formData.acudiente.telefono} onChange={(e) => setFormData({ ...formData, acudiente: { ...formData.acudiente, telefono: e.target.value } })} />
            <input type="text" placeholder="Parentesco" value={formData.acudiente.parentesco} onChange={(e) => setFormData({ ...formData, acudiente: { ...formData.acudiente, parentesco: e.target.value } })} />
            <input type="email" placeholder="Correo" value={formData.acudiente.correo} onChange={(e) => setFormData({ ...formData, acudiente: { ...formData.acudiente, correo: e.target.value } })} />
          </div>

          <button type="submit" style={{ marginTop: "15px", padding: "8px 16px", background: "#007bff", color: "white", border: "none", borderRadius: "4px" }}>
            {editingId ? "Actualizar" : "Guardar"}
          </button>
        </form>
      )}

      {/* Lista de pacientes */}
      <h3>Lista de Pacientes</h3>
      <table style={{ width: "100%", borderCollapse: "collapse", background: "white" }}>
        <thead>
          <tr style={{ background: "#007bff", color: "white" }}>
            <th style={{ padding: "10px", border: "1px solid #ddd" }}>ID</th>
            <th style={{ padding: "10px", border: "1px solid #ddd" }}>Documento</th>
            <th style={{ padding: "10px", border: "1px solid #ddd" }}>Nombre</th>
            <th style={{ padding: "10px", border: "1px solid #ddd" }}>Correo</th>
            <th style={{ padding: "10px", border: "1px solid #ddd" }}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {patients.map((p) => (
            <tr key={p.id}>
              <td style={{ padding: "8px", border: "1px solid #ddd" }}>{p.id}</td>
              <td style={{ padding: "8px", border: "1px solid #ddd" }}>{p.documento}</td>
              <td style={{ padding: "8px", border: "1px solid #ddd" }}>{p.nombres} {p.apellidos}</td>
              <td style={{ padding: "8px", border: "1px solid #ddd" }}>{p.correoElectronico}</td>
              <td style={{ padding: "8px", border: "1px solid #ddd" }}>
                <button onClick={() => handleEdit(p)} style={{ marginRight: "5px", padding: "4px 8px", background: "#ffc107", border: "none", borderRadius: "4px" }}>Editar</button>
                <button onClick={() => handleDelete(p.id)} style={{ padding: "4px 8px", background: "#dc3545", color: "white", border: "none", borderRadius: "4px" }}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Paginación */}
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: "20px" }}>
        <button disabled={page === 1} onClick={() => setPage((p) => p - 1)} style={{ padding: "8px 16px", background: "#6c757d", color: "white", border: "none", borderRadius: "4px", opacity: page === 1 ? 0.5 : 1 }}>
          Anterior
        </button>
        <span>Página {page} de {Math.ceil(total / 10)}</span>
        <button disabled={page >= Math.ceil(total / 10)} onClick={() => setPage((p) => p + 1)} style={{ padding: "8px 16px", background: "#6c757d", color: "white", border: "none", borderRadius: "4px", opacity: page >= Math.ceil(total / 10) ? 0.5 : 1 }}>
          Siguiente
        </button>
      </div>
    </div>
  );
}

export default Patient;