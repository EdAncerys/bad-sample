import {
  getBADMembershipSubscriptionData,
  setUserStoreAction,
  setGoToAction,
} from "../index";

export const getMembershipDataAction = async ({ state, actions }) => {
  const path = `/memberships/`;
  await actions.source.fetch(path); // fetch membership application data
  const memberships = state.source.get(path);
  const { totalPages, page, next } = memberships; // check if memberships have multiple pages
  // fetch memberships via wp API page by page
  let isThereNextPage = next;
  while (isThereNextPage) {
    await actions.source.fetch(isThereNextPage); // fetch next page
    const nextPage = state.source.get(isThereNextPage).next; // check ifNext page & set next page
    isThereNextPage = nextPage;
  }
};

export const handleApplyForMembershipAction = async ({
  state,
  actions,
  dispatch,
  applicationData,
  isActiveUser,
  category,
  type,
}) => {
  try {
    // ⏬ get appropriate membership ID
    const membershipData = await getBADMembershipSubscriptionData({
      state,
      category,
      type,
    });
    if (!membershipData) throw new Error("Failed to get membership data");

    // ⏬ create user application record in Store
    await setUserStoreAction({
      state,
      dispatch,
      applicationData,
      isActiveUser,
      membershipApplication: membershipData,
      data: {
        bad_organisedfor: category === "BAD" ? "810170000" : "810170001", // BAD members category
        core_membershipsubscriptionplanid:
          membershipData.core_membershipsubscriptionplanid, // type of membership for application
        bad_applicationfor: "810170000", // silent assignment
      },
    });

    if (isActiveUser)
      setGoToAction({ path: `/membership/step-1-the-process/`, actions });
  } catch (error) {
    console.log("ERROR: ", error);
  }
};
