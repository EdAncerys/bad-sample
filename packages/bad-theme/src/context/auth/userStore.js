import {
  authenticateAppAction,
  setFetchAction,
  setApplicationDataAction,
  setLoginModalAction,
  getApplicationStatus,
} from "../index";

export const setUserStoreAction = async ({
  state,
  actions,
  dispatch,
  applicationData,
  isActiveUser,
  data,
  membershipApplication,
  dynamicsApps,
}) => {
  console.log("setUserStoreAction triggered");

  if (!isActiveUser) {
    // validate if isActiveUser 🤖
    setLoginModalAction({ dispatch, loginModalAction: true });
    return null;
  }

  if (dynamicsApps) {
    const appsData = dynamicsApps.apps.data; // get pending too approve apps data form dynamic apps
    // check if user have application pending under reviewed status
    const isPending =
      appsData.filter((item) => item.bad_approvalstatus === "Pending").length >
      0;
    // if user have application pending under reviewed status redirect to application list
    if (isPending) {
      console.log("🤖 user have application pending under reviewed status");
      if (state.auth.ENVIRONMENT !== "DEVELOPMENT") {
        // allow application list only in development env
        setGoToAction({ path: "/dashboard/", actions });
        return;
      }
    }
  }

  try {
    setFetchAction({ dispatch, isFetching: true });
    const { contactid } = isActiveUser;

    if (!contactid)
      throw new Error("Cannot set user store. Contactid is missing.");

    let storeApplication = applicationData;

    if (!storeApplication) {
      // ⏬⏬  get application record from store ⏬⏬
      storeApplication = await getUserStoreAction({ state, isActiveUser });
    }
    if (!storeApplication) {
      // ⏬⏬  creat application record in Dynamics ⏬⏬
      storeApplication = await createDynamicsApplicationAction({
        state,
        contactid,
      });
    }

    // throw error if newApplicationRecord is null
    if (!storeApplication) throw new Error("Failed to fetch application");

    // 🤖 update object with user input data
    const updatedMembershipData = updateMembershipApplication({
      storeApplication,
      data,
      membershipApplication,
    });

    const dynamicsApplication = await updateDynamicsApplicationAction({
      state,
      contactid,
      updatedMembershipData,
    });

    if (dynamicsApplication.success) {
      setApplicationDataAction({
        dispatch,
        applicationData: updatedMembershipData,
      });

      console.log("⬇️ application record ", updatedMembershipData);
      return dynamicsApplication;
    } else {
      throw new Error("Failed to update application record");
    }
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

    const URL = state.auth.APP_HOST + `/applications/current/${contactid}`;
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

export const getUserApplicationAction = async ({
  state,
  dispatch,
  contactid,
}) => {
  console.log("getUserApplicationAction triggered");

  try {
    if (!contactid)
      throw new Error("Cannot get user store. Contactid is missing.");

    const URL = state.auth.APP_HOST + `/applications/current/${contactid}`;
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

      // set application data to context
      setApplicationDataAction({ dispatch, applicationData: userStore.data });
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
    const response = await fetch(URL, requestOptions);
    const data = await response.json();

    // console.log("Dynamics Application result", data); // debug

    if (data.success) {
      return data.data;
    } else {
      return null;
    }
  } catch (error) {
    console.log("error", error);
  }
};

export const setCompleteUserApplicationAction = async ({
  state,
  dispatch,
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
      headers: { Authorization: `Bearer ${jwt}` },
    };

    const response = await fetch(URL, requestOptions);
    const data = await response.json();

    if (data.success) {
      // get application status for current contact
      await getApplicationStatus({
        state,
        dispatch,
        contactid,
      });
      // delete application record from CONTEXT
      setApplicationDataAction({
        dispatch,
        applicationData: null,
      });

      console.log("⏬ Membership Completed ⏬");
      console.log(data);

      return data;
    } else {
      console.log("⏬ Failed to Create Membership ⏬");
      console.log(response);
      console.log(data);
    }
  } catch (error) {
    console.log("error", error);
  }
};

export const updateDynamicsApplicationAction = async ({
  state,
  contactid,
  updatedMembershipData,
}) => {
  console.log("updateDynamicsApplicationAction triggered");

  try {
    const URL = state.auth.APP_HOST + `/applications/current/${contactid}`;
    const jwt = await authenticateAppAction({ state });

    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwt}`,
      },
      body: JSON.stringify(updatedMembershipData),
    };

    const response = await fetch(URL, requestOptions);
    const data = await response.json();

    if (data.success) {
      console.log("⏬ DYNAMICS. Membership Record Successfully Updated ⏬");
      return data;
    } else {
      console.log("⏬ DYNAMICS. Failed to Update Membership Record ⏬");
      return null;
    }
  } catch (error) {
    console.log("error", error);
  }
};

const updateMembershipApplication = ({
  storeApplication,
  data,
  membershipApplication,
}) => {
  if (!data && !membershipApplication) return storeApplication;

  console.log("⏬ UPDATING Membership Record ⏬");
  let newApplicationRecord = storeApplication;

  newApplicationRecord.map((application, key) => {
    // add additional data to membershop application object
    if (membershipApplication && key === 0) {
      console.log("🚀 Additional Membership data added 🚀");
      Object.keys(membershipApplication).map((key) => {
        const value = membershipApplication[key];

        application[key] = value; // additional application record data
      });
    }
    if (!data) return null; // exit if data object not passed in
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
    if (data.sky_profilepicture && application.name === "sky_profilepicture")
      application.value = data.sky_profilepicture;
    if (data.py3_dateofbirth && application.name === "py3_dateofbirth")
      application.value = data.py3_dateofbirth;

    //⏬ professional section of the application process
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
    if (
      data.bad_mrpcqualified !== undefined &&
      application.name === "bad_mrpcqualified"
    )
      application.value = data.bad_mrpcqualified;
    if (data.sky_cvurl && application.name === "sky_cvurl")
      application.value = data.sky_cvurl;
    if (data.sky_newhospitalname && application.name === "sky_newhospitalname")
      application.value = data.sky_newhospitalname;
    if (
      data.sky_newhospitaltype !== undefined &&
      application.name === "sky_newhospitaltype"
    )
      application.value = data.sky_newhospitaltype;
    if (
      data.bad_newhospitaladded &&
      application.name === "bad_newhospitaladded"
    )
      application.value = data.bad_newhospitaladded;
    if (data.sky_newhospitalname && application.name === "sky_newhospitalname")
      application.value = data.sky_newhospitalname;
    if (
      data.bad_expectedyearofqualification &&
      application.name === "bad_expectedyearofqualification"
    )
      application.value = data.bad_expectedyearofqualification;

    //⏬ SIG section of the application process
    if (data.bad_qualifications && application.name === "bad_qualifications")
      application.value = data.bad_qualifications;

    if (
      data.bad_hasmedicallicence !== undefined &&
      application.name === "bad_hasmedicallicence"
    )
      application.value = data.bad_hasmedicallicence;
    if (
      data.bad_isbadmember !== undefined &&
      application.name === "bad_isbadmember"
    )
      application.value = data.bad_isbadmember;
    if (
      data.bad_interestinfieldquestion &&
      application.name === "bad_interestinfieldquestion"
    )
      application.value = data.bad_interestinfieldquestion;
    if (
      data.py3_whatukbasedroleareyou &&
      application.name === "py3_whatukbasedroleareyou"
    )
      application.value = data.py3_whatukbasedroleareyou;
    if (data.py3_speciality && application.name === "py3_speciality")
      application.value = data.py3_speciality;
    if (
      data.bad_otherjointclinics &&
      application.name === "bad_otherjointclinics"
    )
      application.value = data.bad_otherjointclinics;
    if (
      data.bad_mainareaofinterest &&
      application.name === "bad_mainareaofinterest"
    )
      application.value = data.bad_mainareaofinterest;
    if (
      data.bad_includeinthebssciiemaildiscussionforum !== undefined &&
      application.name === "bad_includeinthebssciiemaildiscussionforum"
    )
      application.value = data.bad_includeinthebssciiemaildiscussionforum;
    if (
      data.py3_insertnhsnetemailaddress &&
      application.name === "py3_insertnhsnetemailaddress"
    )
      application.value = data.py3_insertnhsnetemailaddress;

    //⏬ complete & submit of the application process
    if (data.bad_ethnicity && application.name === "bad_ethnicity")
      application.value = data.bad_ethnicity;
    if (
      data.py3_constitutionagreement !== undefined &&
      application.name === "py3_constitutionagreement"
    )
      application.value = data.py3_constitutionagreement;
    if (
      data.bad_readpolicydocument !== undefined &&
      application.name === "bad_readpolicydocument"
    )
      application.value = data.bad_readpolicydocument;
  });

  console.log("User Input Data ", data); // debug
  console.log("UPDATED Application Record", newApplicationRecord); // debug

  return newApplicationRecord;
};
