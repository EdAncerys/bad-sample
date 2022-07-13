export const errorHandler = ({ id, time }) => {
  if (!id) return null;

  const error = document.querySelector(`#${id}`);
  if (error) error.classList.remove("d-none");

  setTimeout(
    () => {
      if (error) error.classList.add("d-none");
    },

    time || 3000
  );
};

export const errorMessage = ({ id, time, message }) => {
  if (!id) return null;
  let errorMessage = "Mandatory field";
  if (message) errorMessage = message;

  const error = document.querySelector(`#${id}`);
  // add inner html to error message div
  if (error) {
    error.innerHTML = errorMessage;
    error.classList.remove("d-none");
  }

  setTimeout(
    () => {
      // remove error message inner html
      if (error) {
        error.innerHTML = "";
        error.classList.add("d-none");
      }
    },

    time || 3000
  );
};
