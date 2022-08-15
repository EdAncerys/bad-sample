import { useEffect } from "react";

export const useWpImageScrip = ({ inputs }) => {
  // --------------------------------------------------------------------------------
  // 📌  Script loader.
  // --------------------------------------------------------------------------------
  // inputs as dependencies to trigger re-render when inputs change

  useEffect(() => {
    // get all divs with class "wp-caption"
    const wpCaptions = document.querySelectorAll(".wp-caption");

    if (!wpCaptions) return;
    // add margin "auto" to wpCaptions container to center images
    wpCaptions.forEach((wpCaption) => {
      wpCaption.style.margin = "auto";
      // if class "wp-caption-text" exists, add text alignment "center"
      if (wpCaption.querySelector(".wp-caption-text")) {
        wpCaption.querySelector(".wp-caption-text").style.textAlign = "center";
      }
    });

    // fet all img elements with class "size-full" and add style width "auto"
    const fullImages = document.querySelectorAll(".size-full");
    fullImages.forEach((fullImage) => {
      fullImage.style.width = "auto";
    });
  }, [inputs]);
};
