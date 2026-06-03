import { useEffect, useState } from "react";
import { getAllUsers, updateUser, deleteUser, updateUserStatus } from "../api/user.api";
import { getUser } from "../api/user.api";
import { useNavigate } from "react-router-dom";

function Users() {
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [showStatusConfirmModal, setShowStatusConfirmModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [userToChangeStatus, setUserToChangeStatus] = useState(null);
  const [formData, setFormData] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      getUser(payload.id).then(setCurrentUser);
    }
  }, []);

  useEffect(() => {
    if (currentUser) {
      getAllUsers().then((data) => {
        setUsers(data);
        setLoading(false);
      }).catch(() => {
        setLoading(false);
      });
    }
  }, [currentUser]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const openEditModal = (user) => {
    setEditingUser(user);
    setFormData({
      nombre: user.nombre,
      user: user.user,
      email: user.email,
      celular: user.celular,
      rol: user.rol,
    });
    setShowEditModal(true);
  };

  const closeEditModal = () => {
    setShowEditModal(false);
    setEditingUser(null);
    setFormData({});
  };

  const handleSaveEdit = () => {
    setShowConfirmModal(true);
  };

  const confirmSaveEdit = async () => {
    try {
      await updateUser(editingUser.id, formData);
      const updatedUsers = users.map((u) =>
        u.id === editingUser.id ? { ...u, ...formData } : u
      );
      setUsers(updatedUsers);
      setShowConfirmModal(false);
      closeEditModal();
    } catch (error) {
      console.error("Error al actualizar usuario:", error);
      setShowConfirmModal(false);
    }
  };

  const cancelConfirm = () => {
    setShowConfirmModal(false);
  };

  const handleDeleteUser = (userId) => {
    setUserToDelete(userId);
    setShowDeleteConfirmModal(true);
  };

  const confirmDeleteUser = async () => {
    try {
      await deleteUser(userToDelete);
      setUsers(users.filter((u) => u.id !== userToDelete));
      setShowDeleteConfirmModal(false);
      setUserToDelete(null);
    } catch (error) {
      console.error("Error al eliminar usuario:", error);
      setShowDeleteConfirmModal(false);
    }
  };

  const cancelDeleteConfirm = () => {
    setShowDeleteConfirmModal(false);
    setUserToDelete(null);
  };

  const handleToggleStatus = (user) => {
    setUserToChangeStatus(user);
    setShowStatusConfirmModal(true);
  };

  const confirmStatusChange = async () => {
    const newStatus = userToChangeStatus.estado === "activo" ? "inactivo" : "activo";
    try {
      await updateUserStatus(userToChangeStatus.id, newStatus);
      const updatedUsers = users.map((u) =>
        u.id === userToChangeStatus.id ? { ...u, estado: newStatus } : u
      );
      setUsers(updatedUsers);
      setShowStatusConfirmModal(false);
      setUserToChangeStatus(null);
    } catch (error) {
      console.error("Error al cambiar estado:", error);
      setShowStatusConfirmModal(false);
    }
  };

  const cancelStatusConfirm = () => {
    setShowStatusConfirmModal(false);
    setUserToChangeStatus(null);
  };

  if (!currentUser || loading) return (
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
            {currentUser.nombre}
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
          {currentUser.rol?.toLowerCase() === "optometra" && (
            <>
              <button
                onClick={() => {
                  navigate("/user");
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
                Mi Perfil
              </button>
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

          {currentUser.rol?.toLowerCase() === "secretario" && (
            <>
              <button
                onClick={() => {
                  navigate("/user");
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
                Mi Perfil
              </button>
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
        minHeight: "calc(100vh - 60px)",
      }}>
        <h1 style={{
          fontFamily: "'Playfair Display', serif",
          color: "#0a2540", fontSize: "26px",
          marginBottom: "24px",
        }}>
          Usuarios
        </h1>

        {users.length === 0 ? (
          <div style={{
            background: "white",
            borderRadius: "14px",
            padding: "40px",
            textAlign: "center",
            color: "#64748b",
          }}>
            No hay usuarios registrados
          </div>
        ) : (
          <div style={{
            background: "white",
            borderRadius: "14px",
            overflowX: "auto",
            boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
          }}>
            <table style={{
              width: "100%",
              borderCollapse: "collapse",
            }}>
              <thead>
                <tr style={{
                  borderBottom: "2px solid #e2e8f0",
                  background: "#f8fafc",
                }}>
                  <th style={{
                    padding: "16px 20px",
                    textAlign: "left",
                    color: "#475569",
                    fontSize: "13px",
                    fontWeight: 600,
                    textTransform: "uppercase",
                  }}>
                    Nombre
                  </th>
                  <th style={{
                    padding: "16px 20px",
                    textAlign: "left",
                    color: "#475569",
                    fontSize: "13px",
                    fontWeight: 600,
                    textTransform: "uppercase",
                  }}>
                    Usuario
                  </th>
                  <th style={{
                    padding: "16px 20px",
                    textAlign: "left",
                    color: "#475569",
                    fontSize: "13px",
                    fontWeight: 600,
                    textTransform: "uppercase",
                  }}>
                    Email
                  </th>
                  <th style={{
                    padding: "16px 20px",
                    textAlign: "left",
                    color: "#475569",
                    fontSize: "13px",
                    fontWeight: 600,
                    textTransform: "uppercase",
                  }}>
                    Celular
                  </th>
                  <th style={{
                    padding: "16px 20px",
                    textAlign: "left",
                    color: "#475569",
                    fontSize: "13px",
                    fontWeight: 600,
                    textTransform: "uppercase",
                  }}>
                    Rol
                  </th>
                  <th style={{
                    padding: "16px 20px",
                    textAlign: "left",
                    color: "#475569",
                    fontSize: "13px",
                    fontWeight: 600,
                    textTransform: "uppercase",
                  }}>
                    Estado
                  </th>
                  <th style={{
                    padding: "16px 20px",
                    textAlign: "left",
                    color: "#475569",
                    fontSize: "13px",
                    fontWeight: 600,
                    textTransform: "uppercase",
                  }}>
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr
                    key={user.id}
                    style={{
                      borderBottom: "1px solid #f1f5f9",
                      transition: "background 0.2s",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "#f8fafc";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "transparent";
                    }}
                  >
                    <td style={{
                      padding: "16px 20px",
                      color: "#0a2540",
                      fontSize: "14px",
                      fontWeight: 500,
                    }}>
                      {user.nombre}
                    </td>
                    <td style={{
                      padding: "16px 20px",
                      color: "#64748b",
                      fontSize: "14px",
                    }}>
                      {user.user}
                    </td>
                    <td style={{
                      padding: "16px 20px",
                      color: "#64748b",
                      fontSize: "14px",
                    }}>
                      {user.email}
                    </td>
                    <td style={{
                      padding: "16px 20px",
                      color: "#64748b",
                      fontSize: "14px",
                    }}>
                      {user.celular}
                    </td>
                    <td style={{
                      padding: "16px 20px",
                      color: "#0d5c8f",
                      fontSize: "14px",
                      fontWeight: 500,
                    }}>
                      {user.rol}
                    </td>
                    <td style={{
                      padding: "16px 20px",
                      fontSize: "14px",
                    }}>
                      <button
                        onClick={() => currentUser.rol?.toLowerCase() !== "secretario" && handleToggleStatus(user)}
                        disabled={currentUser.rol?.toLowerCase() === "secretario"}
                        style={{
                          display: "inline-block",
                          padding: "4px 12px",
                          borderRadius: "6px",
                          border: "none",
                          background: user.estado === "activo" ? "#d1fae5" : "#f3f4f6",
                          color: user.estado === "activo" ? "#065f46" : "#6b7280",
                          fontSize: "13px",
                          fontWeight: 500,
                          cursor: currentUser.rol?.toLowerCase() === "secretario" ? "not-allowed" : "pointer",
                          opacity: currentUser.rol?.toLowerCase() === "secretario" ? 0.5 : 1,
                          transition: "all 0.2s",
                          textTransform: "capitalize",
                        }}
                        onMouseEnter={(e) => {
                          if (currentUser.rol?.toLowerCase() !== "secretario") {
                            e.target.style.opacity = "0.8";
                            e.target.style.transform = "scale(1.05)";
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (currentUser.rol?.toLowerCase() !== "secretario") {
                            e.target.style.opacity = "1";
                            e.target.style.transform = "scale(1)";
                          }
                        }}
                      >
                        {user.estado}
                      </button>
                    </td>
                    <td style={{
                      padding: "16px 20px",
                      fontSize: "14px",
                      display: "flex",
                      gap: "8px",
                    }}>
                      {currentUser.rol?.toLowerCase() !== "secretario" && (
                        <>
                          <button
                            onClick={() => openEditModal(user)}
                            style={{
                              background: "#3b82f6",
                              color: "white",
                              border: "none",
                              padding: "6px 12px",
                              borderRadius: "6px",
                              fontSize: "12px",
                              cursor: "pointer",
                              transition: "background 0.2s",
                            }}
                            onMouseEnter={(e) => {
                              e.target.style.background = "#2563eb";
                            }}
                            onMouseLeave={(e) => {
                              e.target.style.background = "#3b82f6";
                            }}
                          >
                            ✎ Editar
                          </button>
                          <button
                            onClick={() => handleDeleteUser(user.id)}
                            style={{
                              background: "#ef4444",
                              color: "white",
                              border: "none",
                              padding: "6px 12px",
                              borderRadius: "6px",
                              fontSize: "12px",
                              cursor: "pointer",
                              transition: "background 0.2s",
                            }}
                            onMouseEnter={(e) => {
                              e.target.style.background = "#dc2626";
                            }}
                            onMouseLeave={(e) => {
                              e.target.style.background = "#ef4444";
                            }}
                          >
                            🗑 Eliminar
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal para editar usuario */}
      {showEditModal && (
        <div style={{
          position: "fixed",
          top: "0",
          left: "0",
          width: "100%",
          height: "100%",
          background: "rgba(0,0,0,0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: "1000",
        }}>
          <div style={{
            background: "white",
            borderRadius: "14px",
            padding: "40px",
            maxWidth: "500px",
            width: "90%",
            boxShadow: "0 20px 25px rgba(0,0,0,0.15)",
          }}>
            <h2 style={{
              fontFamily: "'Playfair Display', serif",
              color: "#0a2540",
              fontSize: "22px",
              marginBottom: "24px",
            }}>
              Editar Usuario
            </h2>

            {["nombre", "user", "email", "celular", "rol"].map((field) => (
              <div key={field} style={{ marginBottom: "16px" }}>
                <label style={{
                  display: "block",
                  color: "#475569",
                  fontSize: "13px",
                  fontWeight: 600,
                  marginBottom: "6px",
                  textTransform: "capitalize",
                }}>
                  {field}
                </label>
                {field === "rol" ? (
                  <select
                    value={formData[field] || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, [field]: e.target.value })
                    }
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      border: "1px solid #cbd5e1",
                      borderRadius: "8px",
                      fontSize: "14px",
                      fontFamily: "'DM Sans', sans-serif",
                      boxSizing: "border-box",
                      cursor: "pointer",
                    }}
                  >
                    <option value="">Selecciona un rol</option>
                    <option value="optometra">Optometra</option>
                    <option value="secretario">Secretario</option>
                  </select>
                ) : (
                  <input
                    type="text"
                    value={formData[field] || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, [field]: e.target.value })
                    }
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      border: "1px solid #cbd5e1",
                      borderRadius: "8px",
                      fontSize: "14px",
                      fontFamily: "'DM Sans', sans-serif",
                      boxSizing: "border-box",
                    }}
                  />
                )}
              </div>
            ))}

            <div style={{
              display: "flex",
              gap: "12px",
              marginTop: "28px",
            }}>
              <button
                onClick={handleSaveEdit}
                style={{
                  flex: 1,
                  background: "#0a2540",
                  color: "white",
                  border: "none",
                  padding: "11px 24px",
                  borderRadius: "8px",
                  fontSize: "14px",
                  cursor: "pointer",
                  fontFamily: "'DM Sans', sans-serif",
                  fontWeight: 600,
                  transition: "background 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = "#0f3a54";
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = "#0a2540";
                }}
              >
                Guardar cambios
              </button>
              <button
                onClick={closeEditModal}
                style={{
                  flex: 1,
                  background: "#e2e8f0",
                  color: "#475569",
                  border: "none",
                  padding: "11px 24px",
                  borderRadius: "8px",
                  fontSize: "14px",
                  cursor: "pointer",
                  fontFamily: "'DM Sans', sans-serif",
                  fontWeight: 600,
                  transition: "background 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = "#cbd5e1";
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = "#e2e8f0";
                }}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de confirmación */}
      {showConfirmModal && (
        <div style={{
          position: "fixed",
          top: "0",
          left: "0",
          width: "100%",
          height: "100%",
          background: "rgba(0,0,0,0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: "1001",
        }}>
          <div style={{
            background: "white",
            borderRadius: "14px",
            padding: "40px",
            maxWidth: "400px",
            width: "90%",
            boxShadow: "0 20px 25px rgba(0,0,0,0.15)",
            textAlign: "center",
          }}>
            <h2 style={{
              fontFamily: "'Playfair Display', serif",
              color: "#0a2540",
              fontSize: "20px",
              marginBottom: "16px",
            }}>
              Confirmar cambios
            </h2>
            <p style={{
              color: "#64748b",
              fontSize: "14px",
              marginBottom: "28px",
              lineHeight: "1.6",
            }}>
              ¿Estás seguro de que deseas guardar los cambios en este usuario?
            </p>

            <div style={{
              display: "flex",
              gap: "12px",
            }}>
              <button
                onClick={confirmSaveEdit}
                style={{
                  flex: 1,
                  background: "#10b981",
                  color: "white",
                  border: "none",
                  padding: "11px 24px",
                  borderRadius: "8px",
                  fontSize: "14px",
                  cursor: "pointer",
                  fontFamily: "'DM Sans', sans-serif",
                  fontWeight: 600,
                  transition: "background 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = "#059669";
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = "#10b981";
                }}
              >
                ✓ OK
              </button>
              <button
                onClick={cancelConfirm}
                style={{
                  flex: 1,
                  background: "#ef4444",
                  color: "white",
                  border: "none",
                  padding: "11px 24px",
                  borderRadius: "8px",
                  fontSize: "14px",
                  cursor: "pointer",
                  fontFamily: "'DM Sans', sans-serif",
                  fontWeight: 600,
                  transition: "background 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = "#dc2626";
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = "#ef4444";
                }}
              >
                ✗ Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de confirmación para eliminar usuario */}
      {showDeleteConfirmModal && (
        <div style={{
          position: "fixed",
          top: "0",
          left: "0",
          width: "100%",
          height: "100%",
          background: "rgba(0,0,0,0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: "1001",
        }}>
          <div style={{
            background: "white",
            borderRadius: "14px",
            padding: "40px",
            maxWidth: "400px",
            width: "90%",
            boxShadow: "0 20px 25px rgba(0,0,0,0.15)",
            textAlign: "center",
          }}>
            <h2 style={{
              fontFamily: "'Playfair Display', serif",
              color: "#0a2540",
              fontSize: "20px",
              marginBottom: "16px",
            }}>
              Eliminar usuario
            </h2>
            <p style={{
              color: "#64748b",
              fontSize: "14px",
              marginBottom: "28px",
              lineHeight: "1.6",
            }}>
              ¿Estás seguro de que deseas eliminar este usuario? Esta acción no se puede deshacer.
            </p>

            <div style={{
              display: "flex",
              gap: "12px",
            }}>
              <button
                onClick={confirmDeleteUser}
                style={{
                  flex: 1,
                  background: "#ef4444",
                  color: "white",
                  border: "none",
                  padding: "11px 24px",
                  borderRadius: "8px",
                  fontSize: "14px",
                  cursor: "pointer",
                  fontFamily: "'DM Sans', sans-serif",
                  fontWeight: 600,
                  transition: "background 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = "#dc2626";
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = "#ef4444";
                }}
              >
                🗑 Eliminar
              </button>
              <button
                onClick={cancelDeleteConfirm}
                style={{
                  flex: 1,
                  background: "#e2e8f0",
                  color: "#475569",
                  border: "none",
                  padding: "11px 24px",
                  borderRadius: "8px",
                  fontSize: "14px",
                  cursor: "pointer",
                  fontFamily: "'DM Sans', sans-serif",
                  fontWeight: 600,
                  transition: "background 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = "#cbd5e1";
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = "#e2e8f0";
                }}
              >
                ✗ Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de confirmación para cambiar estado */}
      {showStatusConfirmModal && userToChangeStatus && (
        <div style={{
          position: "fixed",
          top: "0",
          left: "0",
          width: "100%",
          height: "100%",
          background: "rgba(0,0,0,0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: "1002",
        }}>
          <div style={{
            background: "white",
            borderRadius: "14px",
            padding: "40px",
            maxWidth: "400px",
            width: "90%",
            boxShadow: "0 20px 25px rgba(0,0,0,0.15)",
            textAlign: "center",
          }}>
            <h2 style={{
              fontFamily: "'Playfair Display', serif",
              color: "#0a2540",
              fontSize: "20px",
              marginBottom: "16px",
            }}>
              Cambiar estado
            </h2>
            <p style={{
              color: "#64748b",
              fontSize: "14px",
              marginBottom: "28px",
              lineHeight: "1.6",
            }}>
              ¿Estás seguro de que deseas cambiar el estado de <strong>{userToChangeStatus.nombre}</strong> a <strong>{userToChangeStatus.estado === "activo" ? "deshabilitado" : "habilitado"}</strong>?
            </p>

            <div style={{
              display: "flex",
              gap: "12px",
            }}>
              <button
                onClick={confirmStatusChange}
                style={{
                  flex: 1,
                  background: "#10b981",
                  color: "white",
                  border: "none",
                  padding: "11px 24px",
                  borderRadius: "8px",
                  fontSize: "14px",
                  cursor: "pointer",
                  fontFamily: "'DM Sans', sans-serif",
                  fontWeight: 600,
                  transition: "background 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = "#059669";
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = "#10b981";
                }}
              >
                ✓ OK
              </button>
              <button
                onClick={cancelStatusConfirm}
                style={{
                  flex: 1,
                  background: "#ef4444",
                  color: "white",
                  border: "none",
                  padding: "11px 24px",
                  borderRadius: "8px",
                  fontSize: "14px",
                  cursor: "pointer",
                  fontFamily: "'DM Sans', sans-serif",
                  fontWeight: 600,
                  transition: "background 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = "#dc2626";
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = "#ef4444";
                }}
              >
                ✗ Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Users;
