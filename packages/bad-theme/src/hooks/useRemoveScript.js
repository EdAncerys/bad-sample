import { useEffect } from "react";

export const useRemoveScript = ({ source }) => {
  // --------------------------------------------------------------------------------
  // 📌  Script remover.
  // --------------------------------------------------------------------------------

  useEffect(() => {
    // 📌 get all scriopts in document object
    const scripts = document.querySelectorAll("script");

    scripts.forEach((script) => {
      if (script.src.includes(source)) {
        // 📌 remove script from document object
        script.remove();
      }
    });
  }, [source]);
};
