import { useState, useEffect } from "react";
import { connect } from "frontity";
import { colors } from "../config/colors";
import Image from "@frontity/components/image";

const RowButton = ({
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
  headerImgUrl,
}) => {
  const TEXT_ALIGN = textAlign || "start";
  const CARD_WIDTH = cardWidth || "30%";
  const CARD_HEIGHT = cardHeight || "";
  const MIN_CARD_HEIGHT = 200;
  const THEME = themeColor || colors.primary;
  const URL =
    headerImgUrl ||
    "https://www.skinhealthinfo.org.uk/wp-content/uploads/2020/12/pexels-polina-tankilevitch-3735747-scaled-e1607434622754.jpg";

  // Manage max string Length
  let titlePreview = `${title.substring(0, 35)}...`;
  if (title.length < 35) titlePreview = title;

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
          height: 5,
          width: "100%",
        }}
      />
    );
  };

  const ServeCardImage = () => {
    return (
      <div className="flex" style={{ maxHeight: "35%" }}>
        <Image className="d-block w-100" src={URL} alt="BAD" />
      </div>
    );
  };

  const ServeCardHeader = () => {
    if (!headerImgUrl) return <ServeCardImage />;
    if (!cardTitle) return null;

    return (
      <div>
        <div className="flex mb-2">
          <div
            style={{
              backgroundColor: colors.lightSilver,
              padding: `2px 5px`,
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
    return (
      <div>
        <div className="flex-row">
          <div onClick={handleGoToPath}>
            <div style={styles.footerActionTitle}>
              <p className="card-text">Read More</p>
            </div>
          </div>

          <div onClick={handleGoToPath}>
            <div style={styles.footerActionTitle}>
              <p className="card-text">Nomination Form</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const ServeCardBody = () => {
    const ServeTitle = () => {
      if (!title) return null;

      return (
        <div>
          <h5 className="card-text" style={{ color: colors.black }}>
            {titlePreview}
          </h5>
        </div>
      );
    };

    const ServeBody = () => {
      if (!body) return null;

      return (
        <div className="flex" style={{ maxHeight: 100, overflow: "auto" }}>
          <p className="card-text">{body}</p>
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

  // RETURN ----------------------------------------------------
  return (
    <div
      className="card m-2"
      style={{
        ...styles.card,
        width: `${CARD_WIDTH}`,
        height: `${CARD_HEIGHT}`,
        minHeight: `${CARD_HEIGHT || MIN_CARD_HEIGHT}`,
      }}
    >
      <div className="card-body flex-col" style={{ padding: 0 }}>
        <ServeCardHeader />
        <div style={{ padding: "1em" }}>
          <ServeCardBody />
          <ServeFooterActions />
        </div>
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
  },
  footerActionTitle: {
    marginRight: 25,
    borderBottom: `1px solid ${colors.black}`,
  },
};

export default connect(RowButton);
