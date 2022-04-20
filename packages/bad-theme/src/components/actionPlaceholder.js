import { connect } from "frontity";
import Image from "@frontity/components/image";

import CheckMark from "../img/svg/checkMarkGreen.svg";
import Loading from "./loading";
import { colors } from "../config/imports";

const ActionPlaceholder = ({
  isFetching,
  background,
  bottom,
  height,
  alignSelf,
  padding,
}) => {
  if (!isFetching) return null;
  let backgroundImage = background
    ? "radial-gradient(circle, rgba(172,172,172,0.2) 45%, rgba(255,255,255,0.5) 100%)"
    : "none";

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
        // apply gradiant to background form center to bottom
        // backgroundImage,
      }}
    >
      <Loading alignSelf={alignSelf} padding={padding} />
    </div>
  );
};

export default connect(ActionPlaceholder);
