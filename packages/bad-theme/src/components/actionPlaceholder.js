import { useState, useEffect, useRef } from "react";
import { connect } from "frontity";
import Image from "@frontity/components/image";

import CheckMark from "../img/svg/checkMarkGreen.svg";
import Loading from "./loading";
import { colors } from "../config/imports";

const ActionPlaceholder = ({ isFetching, background }) => {
  if (!isFetching) return null;

  // SERVERS ---------------------------------------------
  const ServeImage = () => {
    const alt = "BAD Complete";

    return (
      <div style={{ maxWidth: 200, height: "100%" }}>
        <Image
          src={CheckMark}
          alt={alt}
          style={{
            width: "100%",
            height: "100%",
          }}
        />
      </div>
    );
  };

  return (
    <div
      style={{
        position: "absolute",
        zIndex: 1,
        width: "100%",
        height: "100%",
        display: "grid",
        justifyItems: "center",
        backgroundColor: background || colors.bgLight,
      }}
    >
      <Loading />
    </div>
  );
};

export default connect(ActionPlaceholder);
