import { fetchDataHandler } from "../index";

export const getBADMembershipSubscriptionData = async ({
  state,
  category,
  type,
}) => {
  // console.log("getBADMembershipSubscriptionData triggered");

  // --------------------------------------------------------------------------------
  // ⚠️ All applications will be for 2022 in DEV & UAT STAGING
  // --------------------------------------------------------------------------------
  let year = new Date().getFullYear();

  let sig_type = type;
  let path =
    state.auth.APP_HOST +
    `/catalogue/lookup/membershiptype?search=${category}:${type}::${year}`;
  if (category === "SIG")
    path =
      state.auth.APP_HOST +
      `/catalogue/lookup/membershiptype?search=${category}:${sig_type}:${year}`;

  console.log("⭐️ url 👉 ", path);

  try {
    let data = await fetchDataHandler({ path, state });
    let result = await data.json();

    if (result.success) {
      const membershipData = result.data[0] ? result.data[0] : null;

      return membershipData;
    }
  } catch (error) {
    console.log("error", error);
  }
};
