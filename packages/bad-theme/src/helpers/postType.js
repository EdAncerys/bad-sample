import { colors } from "../config/colors";
export const postTypeHandler = ({ type }) => {
  if (!type) return "";
  let name = type;
  let color = colors.green;

  if (type === "derm_groups_charity") {
    name = "See Dermatology Groups & Charities";
  }
  if (type === "covid_19") {
    name = "See in COVID 19";
  }
  if (type === "pils") {
    name = "See in PILS";
    color = colors.red;
  }
  if (type === "post") {
    name = "See in Posts";
    color = colors.black;
  }
  if (type === "guidelines_standards") {
    name = "See in Guidelines & Standards";
  }
  if (type === "events") {
    name = "Events";
    color = colors.turquoise;
  }
  if (type === "page") {
    name = "Page";
    color = colors.blue;
  }
  if (type === "videos") {
    name = "Videos";
    color = colors.blue;
  }

  return { name, color };
};
