import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function ProtectedRoute({ children }) {
  const { admin, loading } = useAuth();
  if (loading) return <div className="p-8 text-center text-sm text-slate-500">Loading…</div>;
  if (!admin) return <Navigate to="/admin/login" replace />;
  return children;
}