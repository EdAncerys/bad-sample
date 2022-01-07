import { useState, useEffect } from "react";
import { connect } from "frontity";

import Image from "@frontity/components/image";
import Loading from "./loading";
import { colors } from "../config/imports";

const DividerBlock = ({ state, actions, libraries, block }) => {
  if (!block) return <Loading />;

  const { background_colour, block_height, divider } = block;

  const BANNER_HEIGHT = state.theme.bannerHeight;
  const marginHorizontal = state.theme.marginHorizontal;
  let height = state.theme.marginVertical;
  if (block_height) height = block_height;

  // SERVERS --------------------------------------------
  const ServeDivider = () => {
    if (!divider) return null;

    return (
      <div
        style={{ backgroundColor: background_colour, height: 1, width: "100%" }}
      />
    );
  };

  // RETURN ---------------------------------------------
  return (
    <div
      className="flex"
      style={{ height: `${height}px`, alignItems: "center" }}
    >
      <ServeDivider />
    </div>
  );
};

const styles = {
  container: {},
};

export default connect(DividerBlock);
