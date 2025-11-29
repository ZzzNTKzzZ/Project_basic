import { useState, useEffect } from "react";

export default function useSearch(apiUrl, query = "", type = "get", delay = 300) {
  const [result, setResult] = useState([]);
  const [error, setError] = useState(null);

  // Load static data for type "get"
  useEffect(() => {
    if (type !== "get" || !apiUrl) return;
    const controller = new AbortController();
    const signal = controller.signal;

    const loadData = async () => {
      try {
        const res = await fetch(apiUrl, { signal });
        const data = await res.json();
        setResult(data);
      } catch (err) {
        if (err.name !== "AbortError") setError(err.message);
      }
    };

    loadData();
    return () => controller.abort();
  }, [apiUrl, type]);

  // Load dynamic search / query data
  useEffect(() => {
    if (!query && type !== "get") {
      setResult([]);
      return;
    }
    const controller = new AbortController();
    const signal = controller.signal;

    const fetchUrl = type === "get" ? apiUrl : `${apiUrl}${query}`;
    const handler = setTimeout(async () => {
      try {
        const res = await fetch(fetchUrl, { signal });
        const data = await res.json();
        if (!data.error) setResult(data);
        else setError(data.error);
      } catch (err) {
        if (err.name !== "AbortError") setError(err.message);
      }
    }, delay);

    return () => {
      clearTimeout(handler);
      controller.abort();
    };
  }, [apiUrl, query, type, delay]);

  return { result, error };
}
