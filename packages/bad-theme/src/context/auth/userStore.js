import {
  authenticateAppAction,
  setFetchAction,
  setApplicationDataAction,
  setLoginModalAction,
} from "../index";

export const setUserStoreAction = async ({
  state,
  dispatch,
  applicationData,
  isActiveUser,
  data,
}) => {
  console.log("setUserStoreAction triggered");
  if (!isActiveUser) {
    // validate if isActiveUser 🤖
    setLoginModalAction({ dispatch, loginModalAction: true });
    return null;
  }

  setFetchAction({ dispatch, isFetching: true });

  try {
    const { contactid } = isActiveUser;

    if (!contactid)
      throw new Error("Cannot set user store. Contactid is missing.");

    let storeApplication = applicationData;

    if (!storeApplication) {
      // ⏬⏬  get application record from store ⏬⏬
      storeApplication = await getUserStoreAction({ state, isActiveUser });
    }
    if (!storeApplication) {
      // ⏬⏬  get application record from Dynamics ⏬⏬
      storeApplication = await getDynamicsApplicationAction({
        state,
        contactid,
      });
    }
    if (!storeApplication) {
      // ⏬⏬  creat application record in Dynamics ⏬⏬
      const newApplicationRecord = await createDynamicsApplicationAction({
        state,
        contactid,
      });
      storeApplication = newApplicationRecord;
    }

    // 🤖 update object with user input data
    const updatedMembershipData = updateMembershipApplication({
      storeApplication,
      data,
    });

    const URL = state.auth.APP_HOST + `/store/${contactid}/applications`;
    const jwt = await authenticateAppAction({ state });

    const getCircularReplacer = () => {
      const seen = new WeakSet();
      return (key, value) => {
        if (typeof value === "object" && value !== null) {
          if (seen.has(value)) {
            return;
          }
          seen.add(value);
        }
        return value;
      };
    };

    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwt}`,
      },
      body: JSON.stringify(updatedMembershipData, getCircularReplacer()),
    };

    const response = await fetch(URL, requestOptions);
    console.log("response", response);
    console.log("requestOptions", requestOptions);

    const userStore = await response.json();
    console.log("userStore", userStore);

    if (userStore.success)
      setApplicationDataAction({
        dispatch,
        applicationData: updatedMembershipData,
      });
  } catch (error) {
    console.log("error", error);
  } finally {
    setFetchAction({ dispatch, isFetching: false });
  }
};

export const getUserStoreAction = async ({ state, isActiveUser }) => {
  console.log("getUserStoreAction triggered");

  try {
    const { contactid } = isActiveUser;
    if (!contactid)
      throw new Error("Cannot set user store. Contactid is missing.");

    const URL = state.auth.APP_HOST + `/store/${contactid}/applications`;
    const jwt = await authenticateAppAction({ state });

    const requestOptions = {
      method: "GET",
      headers: { Authorization: `Bearer ${jwt}` },
    };

    const response = await fetch(URL, requestOptions);
    const userStore = await response.json();

    if (userStore.success) {
      console.log("⏬ Membership Record ⏬");
      console.log(userStore.data);
      return userStore.data;
    } else {
      console.log("⏬ Membership Record Not Found ⏬");
      return null;
    }
  } catch (error) {
    console.log("error", error);
  }
};

export const createDynamicsApplicationAction = async ({ state, contactid }) => {
  console.log("createDynamicsApplicationAction triggered");

  // ⏬⏬  create application record in dynamics ⏬⏬
  const URL = state.auth.APP_HOST + `/applications/new/${contactid}`;
  const jwt = await authenticateAppAction({ state });

  const requestOptions = {
    method: "GET",
    headers: {
      Authorization: `Bearer ${jwt}`,
    },
  };

  try {
    const data = await fetch(URL, requestOptions);
    const result = await data.json();

    // console.log("createDynamicsApplicationAction result", result); // debug

    if (result.success) {
      return result.data;
    } else {
      return null;
    }
  } catch (error) {
    console.log("error", error);
  }
};

export const getDynamicsApplicationAction = async ({ state, contactid }) => {
  console.log("getDynamicsApplicationAction triggered");

  // ⏬⏬  create application record in dynamics ⏬⏬
  const URL = state.auth.APP_HOST + `/applications/current/${contactid}`;
  const jwt = await authenticateAppAction({ state });

  const requestOptions = {
    method: "GET",
    headers: {
      Authorization: `Bearer ${jwt}`,
    },
  };

  try {
    const data = await fetch(URL, requestOptions);
    const result = await data.json();

    // console.log("createDynamicsApplicationAction result", result); // debug

    if (result.success) {
      return result.data;
    } else {
      return null;
    }
  } catch (error) {
    console.log("error", error);
  }
};

export const setCompleteUserApplicationAction = async ({
  state,
  isActiveUser,
}) => {
  console.log("setCompleteUserApplicationAction triggered");

  try {
    const { contactid } = isActiveUser;
    if (!contactid)
      throw new Error("Cannot set user store. Contactid is missing.");

    const URL = state.auth.APP_HOST + `/applications/new/${contactid}`;
    const jwt = await authenticateAppAction({ state });

    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwt}`,
      },
    };

    const response = await fetch(URL, requestOptions);
    const userStore = await response.json();

    if (userStore.success) {
      console.log("⏬ Membership Successfully Created ⏬");
      console.log(userStore);
      return userStore.data;
    } else {
      console.log("⏬ Faild to Create Membership Record ⏬");
      return null;
    }
  } catch (error) {
    console.log("error", error);
  }
};

const updateMembershipApplication = ({ storeApplication, data }) => {
  if (!data) return storeApplication;

  console.log("⏬ UPDATING Membership Record ⏬");
  let newApplicationRecord = storeApplication;

  newApplicationRecord.map((application) => {
    //⏬ step one of the application process
    if (data.bad_organisedfor && application.name === "bad_organisedfor")
      application.value = data.bad_organisedfor;
    if (
      data.core_membershipsubscriptionplanid &&
      application.name === "core_membershipsubscriptionplanid"
    )
      application.value = data.core_membershipsubscriptionplanid;
    if (data.bad_applicationfor && application.name === "bad_applicationfor")
      application.value = data.bad_applicationfor;

    //⏬ personal info of the application process
    if (data.py3_title && application.name === "py3_title")
      application.value = data.py3_title;
    if (data.py3_firstname && application.name === "py3_firstname")
      application.value = data.py3_firstname;
    if (data.py3_lastname && application.name === "py3_lastname")
      application.value = data.py3_lastname;
    if (data.py3_gender && application.name === "py3_gender")
      application.value = data.py3_gender;
    if (data.py3_email && application.name === "py3_email")
      application.value = data.py3_email;
    if (data.py3_mobilephone && application.name === "py3_mobilephone")
      application.value = data.py3_mobilephone;
    if (data.py3_address1ine1 && application.name === "py3_address1ine1")
      application.value = data.py3_address1ine1;
    if (data.py3_addressline2 && application.name === "py3_addressline2")
      application.value = data.py3_addressline2;
    if (data.py3_addresstowncity && application.name === "py3_addresstowncity")
      application.value = data.py3_addresstowncity;
    if (
      data.py3_addresscountystate &&
      application.name === "py3_addresscountystate"
    )
      application.value = data.py3_addresscountystate;
    if (
      data.py3_addresszippostalcode &&
      application.name === "py3_addresszippostalcode"
    )
      application.value = data.py3_addresszippostalcode;
    if (data.py3_addresscountry && application.name === "py3_addresscountry")
      application.value = data.py3_addresscountry;

    //⏬ category section of the application process
    if (data.py3_gmcnumber && application.name === "py3_gmcnumber")
      application.value = data.py3_gmcnumber;
    if (
      data.py3_otherregulatorybodyreference &&
      application.name === "py3_otherregulatorybodyreference"
    )
      application.value = data.py3_otherregulatorybodyreference;
    if (data.py3_ntnno && application.name === "py3_ntnno")
      application.value = data.py3_ntnno;
    if (data.bad_currentpost && application.name === "bad_currentpost")
      application.value = data.bad_currentpost;
    if (data.py3_hospitalid && application.name === "py3_hospitalid")
      application.value = data.py3_hospitalid;
    if (data.bad_proposer1 && application.name === "bad_proposer1")
      application.value = data.bad_proposer1;
    if (data.bad_proposer2 && application.name === "bad_proposer2")
      application.value = data.bad_proposer2;
    if (data.bad_mrpcqualified && application.name === "bad_mrpcqualified")
      application.value = data.bad_mrpcqualified;
    // cv input TCC
    // grade TBC
    if (
      data.py3_constitutionagreement &&
      application.name === "py3_constitutionagreement"
    )
      application.value = data.py3_constitutionagreement;
    // privacy notice TBC
  });

  //⏬ SIG section of the application process
  if (data.bad_qualifications && application.name === "bad_qualifications")
    application.value = data.bad_qualifications;
  if (
    data.bad_hasmedicallicence &&
    application.name === "bad_hasmedicallicence"
  )
    application.value = data.bad_hasmedicallicence;
  if (data.bad_isbadmember && application.name === "bad_isbadmember")
    application.value = data.bad_isbadmember;
  // location TBC
  if (
    data.bad_interestinfieldquestion &&
    application.name === "bad_interestinfieldquestion"
  )
    application.value = data.bad_interestinfieldquestion;
  // description TBC
  // specialties TBC
  // areaInterest TBC
  if (
    data.bad_includeinthebssciiemaildiscussionforum &&
    application.name === "bad_includeinthebssciiemaildiscussionforum"
  )
    application.value = data.bad_includeinthebssciiemaildiscussionforum;
  if (data.py3_email && application.name === "py3_email")
    application.value = data.py3_email;
  if (
    data.py3_constitutionagreement &&
    application.name === "py3_constitutionagreement"
  )
    application.value = data.py3_constitutionagreement;
  // notice TBC

  console.log("User Input Data ", data); // debug
  console.log("UPDATED Application Record", newApplicationRecord); // debug

  return newApplicationRecord;
};
