import { useEffect } from "react";

export const useWpImageScrip = ({ inputs }) => {
  // --------------------------------------------------------------------------------
  // 📌  Script loader.
  // --------------------------------------------------------------------------------
  // inputs as dependencies to trigger re-render when inputs change

  useEffect(() => {
    // get all divs with class "wp-caption"
    const wpCaptions = document.querySelectorAll(".wp-caption");

    // map & log class names of each div
    wpCaptions.forEach((wpCaption) => {
      // get class name of div
      const className = wpCaption.className;

      // if class name includes "-props-css" the add style to the div element margin: "auto"
      if (className.includes("-props-css")) {
        wpCaption.style.margin = "auto";
      }
    });

    // loop through each div
  }, [inputs]);
};
