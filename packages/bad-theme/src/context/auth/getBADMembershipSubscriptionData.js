import { fetchDataHandler } from "../index";

export const getBADMembershipSubscriptionData = async ({
  state,
  category,
  type,
  dispatch,
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

  console.log("⭐️ url 👉 ", path);

  try {
    let data = await fetchDataHandler({ path, state });
    let result = await data.json();

    // --------------------------------------------------------------------------------
    // ⚠️ If data returned from API replace application with last year application
    // --------------------------------------------------------------------------------
    if (result?.data?.length === 0) {
      console.log("⭐️ No data returned from API. Fetch prev year application");
      console.log("⭐️ ", result?.data);
      let dateType = category === "SIG" ? ":" + year - 1 : "::" + year - 1; // date type for query with prefix of : or ::

      const newPath =
        state.auth.APP_HOST +
        `/catalogue/lookup/membershiptype?search=${category}:${type}${dateType}`;
      console.log("⭐️ newPath", newPath);

      data = await fetchDataHandler({ newPath, state });
      result = await data.json();
    }

    if (result.success) {
      const membershipData = result.data[0] ? result.data[0] : null;

      return membershipData;
    }
  } catch (error) {
    console.log("error", error);
  }
};
