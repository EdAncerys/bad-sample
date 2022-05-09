import { useLayoutEffect } from "react";

export const useImage = ({ urlPath }) => {
  // --------------------------------------------------------------------------------
  // 📌 Resize images on load
  // --------------------------------------------------------------------------------

  useLayoutEffect(() => {
    // get all img in container post-content and resize them
    const images = document.querySelectorAll(".post-content img");
    // add listener to DOM and update state if dom changes

    if (!images.length) return;
  }, [urlPath]);
};
