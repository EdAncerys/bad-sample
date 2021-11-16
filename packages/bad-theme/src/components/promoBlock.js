import { useState, useEffect } from "react";
import { connect } from "frontity";
import Image from "@frontity/components/image";

import Loading from "./loading";
import FullWidthContentBlock from "./fullWidthContentBlock";
import { colors } from "../config/colors";

const PromoBlock = ({ state, actions, item, reverse }) => {
  if (!item) return <Loading />;

  const BANNER_HEIGHT = 550;
  const { imgUrl, title } = item;

  let MAIN_AXIS = "flex-row"; // define alignment with main axis
  if (reverse) MAIN_AXIS = "flex-row row-reverse";

  // SERVERS ----------------------------------------------------------------
  const ServeCardImage = () => {
    if (!imgUrl) return null;
    const alt = title || "BAD";

    return (
      <div className="flex">
        <div
          style={{
            width: "100%",
            minHeight: BANNER_HEIGHT,
            overflow: "hidden",
          }}
        >
          <Image src={imgUrl} className="d-block h-100" alt={alt} />
        </div>
      </div>
    );
  };

  // RETURN ---------------------------------------------------
  return (
    <div className={MAIN_AXIS} style={styles.container}>
      <FullWidthContentBlock item={item} alignContent="start" />
      <ServeCardImage />
    </div>
  );
};

const styles = {
  container: {
    backgroundColor: colors.lightSilver,
  },
};

export default connect(PromoBlock);
