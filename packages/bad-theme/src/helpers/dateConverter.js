export const dateConverter = ({ date, dateFormat, isDynamics }) => {
  // --------------------------------------------------------------------------------
  // 📌  Format date string to desired dateFormat
  // --------------------------------------------------------------------------------

  // 💰  date: string
  let formatedDate = "";
  if (date.match(/^\d{2}\/\d{2}\/\d{4}$/)) {
    // if Dynamics date confert date string in valid date format from dd/mm/yyyy to yyyy-mm-dd
    // convert date string to yyyy-mm-dd
    formatedDate = new Date(
      `${date.substring(6, 10)}-${date.substring(3, 5)}-${date.substring(0, 2)}`
    );
  } else {
    formatedDate = new Date(date);
  }
  // if date is not valid return null
  if (isNaN(formatedDate.getTime())) return null;
  // cehck if format is dd/mm/yyyy
  date = date.split("/");
  date = `${date[2]}-${date[1]}-${date[0]}`;
  formatedDate = new Date(date);

  let year = formatedDate.getFullYear();
  let month = formatedDate.getMonth() + 1;
  let day = formatedDate.getDate();

  //  if dateFormat "DD/MM/YYYY"
  if (dateFormat === "DD/MM/YYYY") return `${day}/${month}/${year}`;
  if (dateFormat === "YYYY-MM-DD") return `${year}/${month}/${date}`;

  //  if dateFormat is not provided, default to "YYYY/MM/DD"
  return `${year}/${month}/${day}`;
};
