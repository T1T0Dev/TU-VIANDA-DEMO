import { useAuth} from "../context/AuthContext.jsx";
import { Navigate } from "react-router-dom"; // IMPORTANTE: componente con N mayúscula

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth(); // Obtener el estado de autenticación desde el contexto
  if (!isAuthenticated) {
    // Redirigir declarativamente con el componente Navigate
    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedRoute;
