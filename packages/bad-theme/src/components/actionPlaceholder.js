import { connect } from "frontity";
import Image from "@frontity/components/image";

import CheckMark from "../img/svg/checkMarkGreen.svg";
import Loading from "./loading";
import { colors } from "../config/imports";

const ActionPlaceholder = ({ isFetching, background, bottom, height }) => {
  if (!isFetching) return null;

  // SERVERS ---------------------------------------------

  return (
    <div
      style={{
        position: "absolute",
        zIndex: 1,
        width: "100%",
        height: height || "100%",
        display: "grid",
        justifyItems: "center",
        backgroundColor: background || colors.bgLight,
        bottom: bottom || "auto",
      }}
    >
      <Loading />
    </div>
  );
};

export default connect(ActionPlaceholder);
