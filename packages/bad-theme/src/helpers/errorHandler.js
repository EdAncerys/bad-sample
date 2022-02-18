import { useRef, useEffect } from "react";

export const errorHandler = ({ id }) => {
  if (!id) return null;

  const error = document.querySelector(`#${id}`);
  if (error) error.classList.remove("d-none");

  setTimeout(
    () => {
      if (error) error.classList.add("d-none");
    },

    3000
  );
};
