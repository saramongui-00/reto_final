import { Navigate } from "react-router-dom";

function PrivateRoute({ children, rolesPermitidos }) {
  // === MODO PRUEBA ===
  const token = "mock-token";
  const rol = "OPTOMETRA";  // o "SECRETARIO"

  if (!token) {
    return <Navigate to="/" />;
  }

  if (rolesPermitidos && !rolesPermitidos.includes(rol)) {
    return <Navigate to="/user" />;
  }

  return children;
}

export default PrivateRoute;