export const colors = {
  primary: "#1F335E",
  secondary: "#34BE82",
  blue: "#3882CD",
  ocean: "#3882CD",
  yellow: "#F2F013",
  white: "#FFFF",
  darkGrey: "#404040",
  black: "#212529",
  softBlack: "#454545",
  danger: "#A9333A",
  silver: "#ced4da",
  lightSilver: "#F0F1F4",
  darkSilver: "#A2A2A2",
  silverFillOne: "#F5F6F7",
  silverFillTwo: "#E3E7EA",
  textMain: "#707070",
  textBlack: "#171717",
  shade: "rgba(0, 0, 0, 0.25)",
  shadeIntense: "rgba(0, 0, 0, 0.5)",

  turquoise: "#17A2B8",
};

export const blueBtn = {
  fontSize: 15,
  color: colors.white,
  backgroundColor: colors.primary,
  textTransform: "uppercase",
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
  borderRadius: 10,
};
export const dropDownBtn = {
  ...blueBtn,
  color: colors.black,
  backgroundColor: colors.lightSilver,
  padding: `0.75em`,
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
