import { useEffect, useRef } from "react";

export default function useClickOutside(ref, handler, enabled = true) {
  const savedHandler = useRef(handler);

  useEffect(() => {
    savedHandler.current = handler;
  }, [handler]);

  useEffect(() => {
    if (!enabled) return;

    const listener = (event) => {
      if (!ref.current || ref.current.contains(event.target)  || event.key === "Tab") return;
      savedHandler.current(event);
    };

    document.addEventListener("mousedown", listener);
    return () => {
      document.removeEventListener("mousedown", listener);
    };
  }, [ref, enabled]);
}
