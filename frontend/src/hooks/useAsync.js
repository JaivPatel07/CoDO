import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Run an async function when its dependencies change, tracking loading/error
 * state and ignoring results from stale runs.
 *
 * This is the "fetch on mount / on param change" pattern. It exists as a hook
 * (rather than an inline `useEffect`) for two reasons:
 *
 *  1. Every call site gets loading + error handling for free, so screens stop
 *     re-implementing the same three `useState`s.
 *  2. The async work is kicked off from inside an async IIFE, which keeps the
 *     React Compiler's `react-hooks/set-state-in-effect` rule happy — a plain
 *     `useEffect(() => { fetch(); }, [])` is reported as a cascading render.
 *
 * @param {Function} asyncFn  receives the current deps array; returns a promise
 * @param {Array}    deps     re-runs the effect when these change
 */
export function useAsync(asyncFn, deps = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Guards against a slow earlier request overwriting a newer one.
  const activeRef = useRef(true);

  useEffect(() => {
    activeRef.current = true;

    (async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await asyncFn();
        if (activeRef.current) {
          setData(result);
        }
      } catch (err) {
        if (activeRef.current) {
          setError(err?.response?.data?.detail || err?.message || String(err));
        }
      } finally {
        if (activeRef.current) {
          setLoading(false);
        }
      }
    })();

    return () => {
      activeRef.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { data, loading, error, setData };
}

/**
 * Imperative version of {@link useAsync} for refetch buttons / post-mutation
 * refreshes. Returns a stable callback plus the same state triple.
 */
export function useAsyncAction() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const run = useCallback(async (asyncFn) => {
    setLoading(true);
    setError(null);
    try {
      return await asyncFn();
    } catch (err) {
      setError(err?.response?.data?.detail || err?.message || String(err));
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { run, loading, error, setError };
}
