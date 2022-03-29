import { connect } from "frontity";

import ProfileProgress from "../profileProgress";
// CONTEXT ------------------------------------------------------------------
import { useAppState, useAppDispatch } from "../../../context";

const Membership = ({ state, actions, libraries }) => {
  const dispatch = useAppDispatch();
  const { dashboardPath } = useAppState();

  if (dashboardPath !== "Membership") return null;

  const marginHorizontal = state.theme.marginHorizontal;

  // SERVERS ---------------------------------------------
  const ServeDashboard = () => {
    return (
      <div style={{ padding: `0 ${marginHorizontal}px` }}>
        <ProfileProgress />
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

export default connect(Membership);
