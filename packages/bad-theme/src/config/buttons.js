import { colors } from "./colors";

export const blueBtn = {
  fontSize: 15,
  color: colors.white,
  backgroundColor: colors.primary,
  padding: `0.75em`,
  borderRadius: 10,
  border: "none",
  cursor: "pointer",
};
export const transparentBtn = {
  ...blueBtn,
  color: colors.primary,
  backgroundColor: "transparent",
  border: `1px solid ${colors.primary}`,
};
export const dropDownBtn = {
  ...blueBtn,
  color: colors.black,
  backgroundColor: colors.lightSilver,
  width: 150,
};

export const capsBtn = {
  fontSize: 12,
  fontWeight: "bold",
  width: "fit-content",
  letterSpacing: 2,
  color: colors.darkGrey,
  backgroundColor: "transparent",
  textTransform: "uppercase",
  paddingBottom: 3,
  borderBottom: `1px solid ${colors.darkGrey}`,
  cursor: "pointer",
};
