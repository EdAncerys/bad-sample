export const applicationTypeHandler = ({ subs }) => {
  // --------------------------------------------------------------------------------
  // 📌  This function is used to determine the type of application for workforce panel
  // --------------------------------------------------------------------------------
  let type = "";

  subs?.filter((app) => {
    let isStudent =
      app?.core_name?.includes("Student") &&
      app?.statecode === "Active" &&
      app?.bad_organisedfor === "BAD";

    if (isStudent) type = "Student";
  });

  subs?.filter((app) => {
    let isOrdinary =
      app?.core_name?.includes("Ordinary") &&
      app?.statecode === "Active" &&
      app?.bad_organisedfor === "BAD";

    if (isOrdinary) type = "Ordinary";
  });

  subs?.filter((app) => {
    let isOrdinary =
      app?.core_name?.includes("Ordinary SAS") &&
      app?.statecode === "Active" &&
      app?.bad_organisedfor === "BAD";

    if (isOrdinary) type = "Ordinary"; // ⚠️ Ordinary SAS is treated as Ordinary
  });

  subs?.filter((app) => {
    let isOrdinary =
      app?.core_name?.includes("Honorary") &&
      app?.statecode === "Active" &&
      app?.bad_organisedfor === "BAD";

    if (isOrdinary) type = "Ordinary"; // ⚠️ Honorary is treated as Ordinary
  });

  subs?.filter((app) => {
    let isOrdinary =
      app?.core_name?.includes("Trainee") &&
      app?.statecode === "Active" &&
      app?.bad_organisedfor === "BAD";

    if (isOrdinary) type = "Trainee";
  });

  subs?.filter((app) => {
    let isOrdinary =
      app?.core_name?.includes("Associate") &&
      app?.statecode === "Active" &&
      app?.bad_organisedfor === "BAD";

    if (isOrdinary) type = "Junior"; // ⚠️ Associate is treated as Junior
  });

  subs?.filter((app) => {
    let isOrdinary =
      app?.core_name?.includes("Overseas") &&
      app?.statecode === "Active" &&
      app?.bad_organisedfor === "BAD";

    if (isOrdinary) type = "Junior"; // ⚠️ Oversees is treated as Junior
  });

  subs?.filter((app) => {
    let isOrdinary =
      app?.core_name?.includes("Associate Overseas") &&
      app?.statecode === "Active" &&
      app?.bad_organisedfor === "BAD";

    if (isOrdinary) type = "Associate Overseas"; // ⚠️ Honorary is treated as Ordinary
  });

  subs?.filter((app) => {
    let isOrdinary =
      app?.core_name?.includes("Junior") &&
      app?.statecode === "Active" &&
      app?.bad_organisedfor === "BAD";

    if (isOrdinary) type = "Junior";
  });

  return type;
};
