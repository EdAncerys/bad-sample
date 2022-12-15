import { connect } from "frontity";

import UpdateHospitalDetails from "../updateHospitalDetails";
// CONTEXT ------------------------------------------------------------------
import { useAppState, useAppDispatch } from "../../../context";

const MyAccount = ({ state, actions, libraries }) => {
  const { dashboardPath } = useAppState();

  if (dashboardPath !== "Workforce Details") return null;

  const marginHorizontal = state.theme.marginHorizontal;

  return (
    <div style={{ padding: `0 ${marginHorizontal}px` }}>
      <UpdateHospitalDetails />
    </div>
  );
};

export default connect(MyAccount);
