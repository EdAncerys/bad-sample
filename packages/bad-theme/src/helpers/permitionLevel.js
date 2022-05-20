export const hasPermisionLevel = ({ dynamicsApps, isActiveUser }) => {
  // 📌 check if user has permission to view news & media
  let hasPermission = false;
  if (!dynamicsApps || !isActiveUser) return hasPermission;

  // chewck if user have BAD memberships & membership have sage payId is persent
  const hasBADMembership = dynamicsApps.subs.data.filter((item) => {
    let hasSagePayId = !!item.bad_sagepayid;
    let isBADMembership = item.bad_organisedfor === "BAD";
    // add permision if bad_categorytype includes retired membership type
    let isValidCategory = item.bad_categorytype
      .toLowerCase()
      .includes("retired");

    return (hasSagePayId && isBADMembership) || isValidCategory;
  });
  if (hasBADMembership.length > 0 && isActiveUser) hasPermission = true;
  // console.log("🐞 PERMISION", hasPermission); // debug

  return hasPermission;
};
