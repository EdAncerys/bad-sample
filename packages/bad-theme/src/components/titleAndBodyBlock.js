import { useState, useEffect } from "react";
import { connect } from "frontity";
import { colors } from "../config/colors";

import Loading from "./loading";

const TitleAndBodyBlock = ({ state, actions, libraries, block }) => {
  const Html2React = libraries.html2react.Component; // Get the component exposed by html2react.

  if (!block) return <Loading />;

  const { body, title, text_align } = block;

  console.log("-----------", block);

  const marginHorizontal = state.theme.marginHorizontal;
  const marginVertical = state.theme.marginVertical;
  let ALIGNMENT = "start";
  if (text_align === "centre") ALIGNMENT = "center";
  if (text_align === "right") ALIGNMENT = "end";

  // SERVERS ---------------------------------------------
  const ServeTitle = () => {
    if (!title) return null;

    return (
      <div
        className="flex"
        style={{
          fontSize: 36,
          fontFamily: "Roboto",
          fontWeight: "bold",
          color: colors.black,
          textAlign: ALIGNMENT,
          justifyContent: ALIGNMENT,
        }}
      >
        <Html2React html={title} />
      </div>
    );
  };

  const ServeBody = () => {
    if (!body) return null;

    return (
      <div
        className="flex"
        style={{
          fontSize: 16,
          fontWeight: "bold",
          paddingTop: `1em`,
          textAlign: ALIGNMENT,
          justifyContent: ALIGNMENT,
        }}
      >
        <Html2React html={body} />
      </div>
    );
  };

  return (
    <div style={{ margin: `${marginVertical}px ${marginHorizontal}px` }}>
      <div className="flex-col">
        <ServeTitle />
        <ServeBody />
      </div>
    </div>
  );
};

const styles = {
  container: {},
};

export default connect(TitleAndBodyBlock);
