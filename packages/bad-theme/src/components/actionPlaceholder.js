import { connect } from "frontity";

import Loading from "./loading";
import { colors } from "../config/imports";

const ActionPlaceholder = ({ isFetching }) => {
  if (!isFetching) return null;

  return (
    <div
      style={{
        position: "absolute",
        zIndex: 1,
        width: "100%",
        height: "100%",
        display: "grid",
        justifyItems: "center",
        backgroundColor: colors.bgLight,
      }}
    >
      <Loading />
    </div>
  );
};

export default connect(ActionPlaceholder);
