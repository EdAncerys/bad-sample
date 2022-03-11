import { useState, useEffect } from "react";
import { connect } from "frontity";

import { colors } from "../../../config/colors";

import UpdateProfile from "../updateProfile";
import UpdateHospitalDetails from "../updateHospitalDetails";
import UpdateAddress from "../updateAddress";
// CONTEXT ------------------------------------------------------------------
import { useAppState, useAppDispatch } from "../../../context";

const MyAccount = ({ state, actions, libraries }) => {
  const dispatch = useAppDispatch();
  const { dashboardPath } = useAppState();

  if (dashboardPath !== "My Profile") return null;

  const marginHorizontal = state.theme.marginHorizontal;

  // HELPERS ---------------------------------------------

  // SERVERS ---------------------------------------------

  // RETURN ---------------------------------------------
  return (
    <div style={{ padding: `0 ${marginHorizontal}px` }}>
      <UpdateProfile />
      <UpdateHospitalDetails />
      <UpdateAddress />
    </div>
  );
};

const styles = {
  container: {},
};

export default connect(MyAccount);
