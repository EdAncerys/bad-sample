import { useEffect } from "react";

export const useRemoveScript = ({ source }) => {
  // --------------------------------------------------------------------------------
  // 📌  Script remover.
  // --------------------------------------------------------------------------------

  useEffect(() => {
    if (!source) return;
    // 📌 get all scriopts in document object
    const scripts = document.querySelectorAll("script");
    console.log("🐞 source", source); // debug

    scripts.forEach((script) => {
      if (script.src.includes(source)) {
        // 📌 remove script from document object
        script.remove();
      }
    });
  }, [source]);
};
