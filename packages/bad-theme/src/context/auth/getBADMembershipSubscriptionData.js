import { fetchDataHandler } from "../index";

export const getBADMembershipSubscriptionData = async ({
  state,
  category,
  type,
}) => {
  // console.log("getBADMembershipSubscriptionData triggered");

  const year = new Date().getFullYear(); // get current year
  let sig_type = type;
  if (type === "Full:DERMPATHPRO") sig_type = "Full:DermpathPRO"; // 📌 overwrite
  let path =
    state.auth.APP_HOST +
    `/catalogue/lookup/membershiptype?search=${category}:${type}::${year}`;
  if (category === "SIG")
    path =
      state.auth.APP_HOST +
      `/catalogue/lookup/membershiptype?search=${category}:${sig_type}:${year}`;

  console.log("⭐️ ", path);
  try {
    const data = await fetchDataHandler({ path, state });

    const result = await data.json();

    if (result.success) {
      const membershipData = result.data[0] ? result.data[0] : null;

      return membershipData;
    }
  } catch (error) {
    console.log("error", error);
  }
};
