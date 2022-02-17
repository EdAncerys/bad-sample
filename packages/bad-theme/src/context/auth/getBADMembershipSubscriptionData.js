import { authenticateAppAction } from "../index";

export const getBADMembershipSubscriptionData = async ({
  state,
  category,
  type,
}) => {
  console.log("getBADMembershipSubscriptionData triggered");

  const year = new Date().getFullYear(); // get current year
  let URL =
    state.auth.APP_HOST +
    `/catalogue/lookup/membershiptype?search=${category}:${type}::${year}`;
  if (category === "SIG")
    URL =
      state.auth.APP_HOST +
      `/catalogue/lookup/membershiptype?search=${category}:${type}:${year}`;

  const jwt = await authenticateAppAction({ state });

  console.log(URL);

  const requestOptions = {
    method: "GET",
    headers: { Authorization: `Bearer ${jwt}` },
  };

  try {
    const data = await fetch(URL, requestOptions);
    const result = await data.json();

    if (result.success) {
      const membershipData = result.data[0] ? result.data[0] : null;
      console.log("⏬ Application ID ⏬");
      console.log(membershipData.core_membershipsubscriptionplanid);

      return membershipData;
    }
  } catch (error) {
    console.log("error", error);
  }
};