import { useEffect } from "react";

export const useScript = ({ url, name }) => {
  // --------------------------------------------------------------------------------
  // 📌  Script loader.
  // --------------------------------------------------------------------------------

  useEffect(() => {
    const script = document.createElement("script");

    // 📌 check if script is already loaded if so return
    if (document.querySelector(`script[src="${url}"]`)) return;

    // --------------------------------------------------------------------------------
    // 📌  If script name is passed as prop, check if script is already loaded by name.
    // --------------------------------------------------------------------------------

    let scriptLoaded = false;
    if (name) {
      const scripts = document.querySelectorAll("script"); // 📌 get all scripts from document
      const scriptArray = Array.from(scripts).find((script) =>
        script.src.includes(name)
      );

      if (scriptArray) scriptLoaded = true; // 📌 if script is found, set scriptLoaded to true
    }

    if (scriptLoaded) return;

    script.src = url;
    script.async = true;
    document.body.appendChild(script); // 📌 append script to body

    return () => {
      document.body.removeChild(script);
    };
  }, [url]);
};
