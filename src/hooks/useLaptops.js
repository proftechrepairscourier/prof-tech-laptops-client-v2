import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { API_URL } from '../config.js';

export function useLaptops(params = {}, deps = []) {
  const [laptops, setLaptops] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const query = new URLSearchParams();
      Object.entries(params).forEach(([k, v]) => {
        if (v !== undefined && v !== null && v !== '') query.append(k, v);
      });
      const { data } = await axios.get(`${API_URL}/laptops?${query.toString()}`);
      setLaptops(data.laptops);
      setPagination(data.pagination);
    } catch (err) {
      setError(err.message || 'Failed to load');
    } finally {
      setLoading(false);
    }
  }, [JSON.stringify(params)]);

  useEffect(() => { load(); }, [load, ...deps]);

  return { laptops, pagination, loading, error, reload: load };
}