import { useState, useEffect } from "react";
import { connect } from "frontity";
import Image from "@frontity/components/image";

import Loading from "./loading";
import TextBanner from "./textBanner";

const PromoBlock = ({ state, actions, item }) => {
  if (!item) return <Loading />;

  const BANNER_HEIGHT = 550;
  const { imgUrl, title } = item;

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
    <div className="flex-row" style={styles.container}>
      <TextBanner item={item} alignContent="start" />
      <ServeCardImage />
    </div>
  );
};

const styles = {
  container: {},
};

export default connect(PromoBlock);
