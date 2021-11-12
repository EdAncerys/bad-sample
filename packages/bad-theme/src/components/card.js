import { useState, useEffect } from "react";
import { connect } from "frontity";
import { colors } from "../config/colors";
import Image from "@frontity/components/image";

const Card = ({
  state,
  actions,
  cardTitle,
  title,
  body,
  url,
  textAlign,
  cardWidth,
  cardHeight,
  themeColor,
  imgUrl,
}) => {
  const TEXT_ALIGN = textAlign || "start";
  const CARD_WIDTH = cardWidth || "30%";
  const CARD_HEIGHT = cardHeight || "85%";
  const THEME = themeColor || colors.primary;
  const URL =
    imgUrl ||
    "https://www.skinhealthinfo.org.uk/wp-content/uploads/2020/12/pexels-polina-tankilevitch-3735747-scaled-e1607434622754.jpg";

  // HELPERS ---------------------------------------------
  const handleGoToPath = () => {
    actions.router.set(`${url}`);
    console.log("url", url);
  };

  // SERVERS ----------------------------------------------------------------
  const ServeFooter = () => {
    return (
      <div
        style={{
          backgroundColor: THEME,
          height: 8,
          width: "100%",
        }}
      />
    );
  };

  const ServeCardImage = () => {
    return (
      <div style={{ overflow: "hidden" }}>
        <Image src={URL} className="d-block w-100" alt="BAD" />
      </div>
    );
  };

  const ServeCardHeader = () => {
    if (imgUrl) return null;
    if (!cardTitle) return null;

    return (
      <div>
        <div className="flex mb-2">
          <div
            style={{
              backgroundColor: colors.lightSilver,
              borderRadius: 5,
              textTransform: "uppercase",
            }}
          >
            {cardTitle}
          </div>
        </div>
      </div>
    );
  };

  const ServeFooterActions = () => {
    const ServeMoreAction = () => {
      return (
        <div onClick={handleGoToPath}>
          <div style={styles.footerActionTitle}>
            <p className="card-text">Read More</p>
          </div>
        </div>
      );
    };

    const ServeFromAction = () => {
      if (imgUrl) return null;

      return (
        <div onClick={handleGoToPath}>
          <div style={styles.footerActionTitle}>
            <p className="card-text">Nomination Form</p>
          </div>
        </div>
      );
    };

    return (
      <div className="flex-row mt-2">
        <ServeMoreAction />
        <ServeFromAction />
      </div>
    );
  };

  const ServeCardBody = () => {
    const ServeTitle = () => {
      if (!title) return null;

      // Manage max string Length
      const MAX_LENGTH = 60;
      let titlePreview = `${title.substring(0, MAX_LENGTH)}...`;
      if (title.length < MAX_LENGTH) titlePreview = title;

      return (
        <div>
          <h5 className="flex card-text" style={{ color: colors.black }}>
            {titlePreview}
          </h5>
        </div>
      );
    };

    const ServeBody = () => {
      if (imgUrl) return null;
      if (!body) return null;

      // Manage max string Length
      const MAX_LENGTH = 150;
      let bodyPreview = `${body.substring(0, MAX_LENGTH)}...`;
      if (title.length < MAX_LENGTH) bodyPreview = body;

      return (
        <div className="flex mt-2" style={{ overflow: "auto" }}>
          <p className="card-text">{bodyPreview}</p>
        </div>
      );
    };

    return (
      <div className="flex-col" style={{ textAlign: `${TEXT_ALIGN}` }}>
        <ServeTitle />
        <ServeBody />
      </div>
    );
  };

  const ServeContent = () => {
    return (
      <div className="flex-col">
        <ServeCardBody />
        <ServeFooterActions />
      </div>
    );
  };

  // RETURN ----------------------------------------------------
  return (
    <div
      className="card m-2"
      style={{
        ...styles.card,
        width: `${CARD_WIDTH}`,
        height: `${CARD_HEIGHT}`,
      }}
    >
      {imgUrl && <ServeCardImage />}
      <div className="flex-col mt-4" style={{ padding: "0 1em 1em" }}>
        <ServeCardHeader />
        <ServeContent />
      </div>
      <ServeFooter />
    </div>
  );
};

const styles = {
  card: {
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    border: "none",
  },
  footerActionTitle: {
    marginRight: 25,
    borderBottom: `1px solid ${colors.black}`,
  },
};

export default connect(Card);
