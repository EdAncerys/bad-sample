import { useEffect } from "react";

export const useScript = ({ url }) => {
  // --------------------------------------------------------------------------------
  // 📌  Script loader.
  // --------------------------------------------------------------------------------

  useEffect(() => {
    const script = document.createElement("script");

    // 📌 check if script is already loaded if so return
    if (document.querySelector(`script[src="${url}"]`)) return;

    script.src = url;
    script.async = true;

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [url]);
};
