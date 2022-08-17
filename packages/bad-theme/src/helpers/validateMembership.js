import { handleGetCookie } from "../context";
// --------------------------------------------------------------------------------

export const handelValidateMembership = ({
  isActiveUser,
  dynamicsApps,
  state,
}) => {
  // --------------------------------------------------------------------------------
  // 📌  Validate user membership status
  // --------------------------------------------------------------------------------
  let membership = {
    isValid: true,
    message: "",
  };
  // console.log("🐞 dynamicsApps", dynamicsApps.subs.data); // debug

  // --------------------------------------------------------------------------------
  // 📌 if user core_membershipstatus is not set to Free, then return valid subscription
  // --------------------------------------------------------------------------------
  if (
    !isActiveUser ||
    isActiveUser.core_membershipstatus !== state.theme.frozenMembership
  ) {
    // return object with valid subscription
    return membership;
  }

  // check if cookie is set with user payment Date & value is less then paymentLapseTime in minutes
  const cookie = handleGetCookie({ name: "payment" });
  // check if value is less then 10 minutes
  if (cookie) {
    const now = new Date().getTime();
    const cookieDate = new Date(Number(cookie)).getTime(); // convert cookie to date

    const difference = now - cookieDate; // This will give difference in milliseconds
    // get time difference in minutes
    const resultInMinutes = Math.round(difference / 60000);

    if (resultInMinutes < state.theme.paymentLapseTime) return membership;
  }

  // FREEZE membership status & set it to LAPSED by default
  membership.isValid = false;
  membership.message = state.theme.lapsedMembershipBody;

  // check if subscriptions have FREEZE status
  let freezeMembershipList = [];
  if (dynamicsApps && dynamicsApps.subs) {
    // is lapsed if any bad_organisedfor === 'BAD' & core_membershipstatus === 'Completed' && subscription of previous year is completed
    freezeMembershipList = dynamicsApps.subs.data.filter((app) => {
      return (
        app.bad_organisedfor === "BAD" &&
        app.core_membershipstatus === state.theme.frozenMembership
      );
    });

    // 📌 uncoment below to eneable lapsed membership flip if user have applications form current year
    // if user have paid applications form current year then set lapsed membership to false
    // let isAppCurrentYear = freezeMembershipList.filter((app) => {
    //   return app.core_name.includes(currentYear);
    // });
    // if (isAppCurrentYear.length) freezeMembershipList = [];
  }

  // if user have any memberships set to FREEZ then set membership to freezed
  if (freezeMembershipList.length > 0)
    membership.message = state.theme.frozenMembershipBody;

  return membership;
};
