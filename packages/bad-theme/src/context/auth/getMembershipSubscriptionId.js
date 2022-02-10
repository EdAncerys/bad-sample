import { authenticateAppAction } from "../index";

export const getMembershipSubscriptionId = async ({
  state,
  category,
  type,
}) => {
  console.log("getMembershipSubscriptionId triggered");

  const year = new Date("01.01.2021").getFullYear(); // get current year
  const URL =
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
      const membershipId = result.data.core_membershipsubscriptionplanid;
      console.log("⏬ Application ID ⏬");
      console.log(membershipId);

      return membershipId || "ef2fac54-3ed3-ea11-a812-000d3a4a1557"; // dummy default value
    }
  } catch (error) {
    console.log("error", error);
  }
};
