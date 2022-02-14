import { authenticateAppAction } from "../index";

export const getBADMembershipSubscriptionId = async ({
  state,
  category,
  type,
}) => {
  console.log("getBADMembershipSubscriptionId triggered");

  const year = new Date().getFullYear(); // get current year
  const URL =
    state.auth.APP_HOST +
    `/catalogue/lookup/membershiptype?search=${category}:${type}::${year}`;
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
      const membershipId = result.data[0]
        ? result.data[0].core_membershipsubscriptionplanid
        : null;
      console.log("⏬ Application ID ⏬");
      console.log(membershipId);

      return membershipId;
    }
  } catch (error) {
    console.log("error", error);
  }
};
