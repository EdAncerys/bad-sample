import { useState, useEffect } from "react";
import { connect } from "frontity";

import { colors } from "../../../config/colors";

import UpdateProfile from "../updateProfile";
import UpdateHospitalDetails from "../updateHospitalDetails";
import UpdateAddress from "../updateAddress";

const MyAccount = ({ state, actions, libraries, dashboardPath }) => {
  if (dashboardPath !== "My Account") return null;

  const marginHorizontal = state.theme.marginHorizontal;

  // SERVERS ---------------------------------------------
  const ServeDashboard = () => {
    return (
      <div style={{ padding: `0 ${marginHorizontal}px` }}>
        <UpdateProfile />
        <UpdateHospitalDetails />
        <UpdateAddress />
      </div>
    );
  };

  // RETURN ---------------------------------------------
  return (
    <div>
      <ServeDashboard />
    </div>
  );
};

const styles = {
  container: {},
};

export default connect(MyAccount);
