import { useState, useEffect } from "react";
import { connect } from "frontity";
import Image from "@frontity/components/image";

import { colors } from "../../config/colors";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";

const JournalCard = ({ state, actions, item }) => {
  const CARD_WIDTH = "30%";
  const { url, title, imgUrl } = item;

  // HELPERS ---------------------------------------------
  const handleGoToPath = () => {
    actions.router.set(`${url}`);
    console.log("url", url);
  };

  // SERVERS ---------------------------------------------
  const ServeCardActions = () => {
    if (!title) return null;

    // Manage max string Length
    const MAX_LENGTH = 25;
    let titlePreview = `${title.substring(0, MAX_LENGTH)}...`;
    if (title.length < MAX_LENGTH) titlePreview = title;

    return (
      <div
        className="card-body flex-col"
        style={{
          textAlign: "start",
        }}
      >
        <div style={{ borderLeft: `2px solid ${colors.silver}` }}>
          <div style={{ marginLeft: 5 }}>
            <div
              className="flex"
              style={{
                fontSize: 20,
                fontWeight: "bold",
              }}
            >
              <p className="card-text">{titlePreview}</p>
            </div>
            <div
              className="flex-row pointer"
              style={{ alignItems: "center" }}
              onClick={handleGoToPath}
            >
              <div style={{ textTransform: "uppercase", fontSize: 12 }}>
                <p className="card-text">Read More</p>
              </div>
              <div>
                <KeyboardArrowRightIcon style={{ fill: colors.darkSilver }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const ServeCardLogo = () => {
    if (!imgUrl) return null;

    return (
      <div className="flex-center-col">
        <div
          style={{
            borderRadius: "50%",
            overflow: "hidden",
            width: 75,
            height: 75,
          }}
        >
          <Image className="d-block w-100" src={imgUrl} alt="BAD Logo" />
        </div>
      </div>
    );
  };

  // RETURN ----------------------------------------------------------------
  return (
    <div
      className="card shadow m-2"
      style={{
        border: "none",
        width: "30%",
        minWidth: CARD_WIDTH,
      }}
    >
      <div className="flex-row">
        <ServeCardLogo />
        <ServeCardActions />
      </div>
    </div>
  );
};

const styles = {
  container: {},
};
export default connect(JournalCard);
