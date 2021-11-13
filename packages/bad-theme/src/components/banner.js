import { useState, useEffect } from "react";
import { connect } from "frontity";
import { colors } from "../config/colors";
import Image from "@frontity/components/image";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";

import Loading from "./loading";

const Banner = ({ state, actions, item }) => {
  if (!item) return <Loading />;

  const BANNER_HEIGHT = 350;
  const { title, urlTitle, url, imgUrl } = item;

  // HELPERS ----------------------------------------------------
  const handleGoToAction = () => {
    actions.router.set(`${url}`);
  };

  // SERVERS ----------------------------------------------------------------
  const ServeFooter = () => {
    return (
      <div
        className="flex-row"
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          width: "100%",
          padding: `2em 4em`,
        }}
      >
        <div className="flex">
          <h5
            className="card-text"
            style={{
              color: colors.white,
              fontSize: "2em",
              textTransform: "capitalize",
            }}
          >
            {title}
          </h5>
        </div>
        <div className="mr-5">
          <button
            className="btn btn-outline-light flex-center-row"
            onClick={handleGoToAction}
          >
            <div>{urlTitle}</div>
            <div>
              <KeyboardArrowRightIcon style={{ fill: colors.white }} />
            </div>
          </button>
        </div>
      </div>
    );
  };

  const ServeCardImage = () => {
    if (!imgUrl) return null;
    const alt = title || "BAD";

    return (
      <div style={{ width: "100%", height: BANNER_HEIGHT, overflow: "hidden" }}>
        <Image src={imgUrl} className="d-block h-100" alt={alt} />
      </div>
    );
  };

  const ServeOverlay = () => {
    return (
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          width: "100%",
          height: BANNER_HEIGHT,
          background: `linear-gradient(0deg, rgba(31,51,94,1) 0%, rgba(133,133,148,0.1) 60%)`,
        }}
      />
    );
  };

  // RETURN ---------------------------------------------------
  return (
    <div
      className="flex-col"
      style={{ position: "relative", height: BANNER_HEIGHT }}
    >
      <ServeCardImage />
      <ServeOverlay />
      <ServeFooter />
    </div>
  );
};

const styles = {
  container: {},
};

export default connect(Banner);
