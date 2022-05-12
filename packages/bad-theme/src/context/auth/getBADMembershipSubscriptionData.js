import { authenticateAppAction } from "../index";

export const getBADMembershipSubscriptionData = async ({
  state,
  category,
  type,
  dispatch,
  refreshJWT,
}) => {
  // console.log("getBADMembershipSubscriptionData triggered");

  const year = new Date().getFullYear(); // get current year
  let sig_type = type;
  if (type === "Full:DERMPATHPRO") sig_type = "Full:DermpathPRO";
  let URL =
    state.auth.APP_HOST +
    `/catalogue/lookup/membershiptype?search=${category}:${type}::${year}`;
  if (category === "SIG")
    URL =
      state.auth.APP_HOST +
      `/catalogue/lookup/membershiptype?search=${category}:${sig_type}:${year}`;
  console.log("URL", URL);
  const jwt = await authenticateAppAction({ state, dispatch, refreshJWT });

  const requestOptions = {
    method: "GET",
    headers: { Authorization: `Bearer ${jwt}` },
  };

  try {
    const data = await fetch(URL, requestOptions);
    const result = await data.json();

    if (result.success) {
      const membershipData = result.data[0] ? result.data[0] : null;

      return membershipData;
    }
  } catch (error) {
    // console.log("error", error);
  }
};
