import {
  getUserDataByContactId,
  setFetchAction,
  fetchDataHandler,
} from "../index";

export const updateProfileAction = async ({
  state,
  dispatch,
  data,
  isActiveUser,
}) => {
  // console.log("updateProfileAction triggered");
  const { contactid } = isActiveUser;

  const path = state.auth.APP_HOST + `/catalogue/data/contacts(${contactid})`;

  setFetchAction({ dispatch, isFetching: true });
  // --------------------------------------------------------------------------
  // 📌 STEP: Log onto the API server and get the Bearer token
  // --------------------------------------------------------------------------

  try {
    const respose = await fetchDataHandler({
      path,
      method: "PATCH",
      body: data,
      headers: {
        "Content-Type": "application/json",
        "if-Match": "*",
      },
      state,
    });
    const responseData = await respose.json();
    if (!responseData) throw new Error("Error updating profile.");

    if (responseData.success) {
      // console.log("⬇️ profile details successfully updated ⬇️ "); // debug
      // update user profile in context
      await getUserDataByContactId({
        state,
        dispatch,
        contactid,
      });

      return responseData;
    }
  } catch (error) {
    // console.log("error", error);
  } finally {
    setFetchAction({ dispatch, isFetching: false });
  }
};
