import { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { API_URL } from '../config.js';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('pt_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      axios
        .get(`${API_URL}/auth/me`, { headers: { Authorization: `Bearer ${token}` } })
        .then((r) => setAdmin(r.data.admin))
        .catch(() => {
          localStorage.removeItem('pt_token');
          setToken(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [token]);

  const login = async (email, password) => {
    const { data } = await axios.post(`${API_URL}/auth/login`, { email, password });
    localStorage.setItem('pt_token', data.token);
    setToken(data.token);
    setAdmin(data.admin);
    return data;
  };

  const logout = () => {
    localStorage.removeItem('pt_token');
    setToken(null);
    setAdmin(null);
  };

  return (
    <AuthContext.Provider value={{ admin, token, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);