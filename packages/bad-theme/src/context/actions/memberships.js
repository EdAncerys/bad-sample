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

export const validateMembershipFormAction = async ({
  state,
  actions,
  setData,
  applicationData,
}) => {
  const handleSetInputData = ({ data, name }) => {
    setData((prevFormData) => ({
      ...prevFormData,
      [name]: data[name],
    }));
  };

  // ⏬ validate inputs
  if (!state.source.memberships)
    await getMembershipDataAction({ state, actions });
  const membershipTypes = Object.values(state.source.memberships);

  if (!membershipTypes) return null;
  if (!applicationData) return null;

  membershipTypes.map((membership) => {
    // validate application type against store object
    const applicationType =
      membership.acf.category_types === applicationData[0].bad_categorytype ||
      membership.acf.category_types === applicationData[0]._bad_sigid_value;

    if (applicationType) {
      const applicationForm = membership.acf;
      // console.log(applicationForm); // debug

      Object.keys(applicationForm).map((keyName) => {
        handleSetInputData({ data: applicationForm, name: keyName });
      });
    }
  });
};

export const handleApplyForMembershipAction = async ({
  state,
  actions,
  dispatch,
  applicationData,
  isActiveUser,
  category,
  type,
  path,
  membershipApplication,
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
      membershipApplication: { ...membershipData, ...membershipApplication },
      data: {
        bad_organisedfor: category === "BAD" ? "810170000" : "810170001", // BAD members category
        core_membershipsubscriptionplanid:
          membershipData.core_membershipsubscriptionplanid, // type of membership for application
        bad_applicationfor: "810170000", // silent assignment
      },
    });

    if (isActiveUser)
      setGoToAction({
        path: path || `/membership/step-1-the-process/`,
        actions,
      });
  } catch (error) {
    console.log("ERROR: ", error);
  }
};
