import { useState, useEffect } from "react";
import { connect } from "frontity";
import Image from "@frontity/components/image";

import Card from "./card";
import Loading from "./loading";
import ButtonsRow from "./buttonsRow";

const HeroBanner = ({ state, actions, item }) => {
  if (!item) return <Loading />;

  const CARD_WIDTH = "50%";
  const BANNER_HEIGHT = 400;
  const OFFSET_BOTTOM = 50;
  const { imgUrl, title, body } = item[0];

  // SERVERS ----------------------------------------------------------------
  const ServeFooter = () => {
    return (
      <div
        style={{
          height: OFFSET_BOTTOM,
          width: "100%",
        }}
      />
    );
  };

  const ServeCardOverLay = () => {
    return (
      <div
        className="flex-col"
        style={{
          position: "absolute",
          zIndex: 1,
          height: BANNER_HEIGHT,
          width: "200%",
        }}
      >
        <div
          className="flex"
          style={{
            marginLeft: OFFSET_BOTTOM,
            marginTop: OFFSET_BOTTOM / 2,
          }}
        >
          <Card
            cardTitle="Card Header Title"
            title={title}
            body={body}
            cardWidth={CARD_WIDTH}
            cardHeight={BANNER_HEIGHT * 0.7}
          />
        </div>
      </div>
    );
  };

  const ServeButtonsOverLay = () => {
    return (
      <div
        className="flex-col"
        style={{
          position: "absolute",
          zIndex: 1,
          width: "200%",
        }}
      >
        <div
          className="flex"
          style={{
            marginLeft: OFFSET_BOTTOM,
            marginTop: BANNER_HEIGHT - OFFSET_BOTTOM,
          }}
        >
          <ButtonsRow item={item} />
        </div>
      </div>
    );
  };

  const ServeCardImage = () => {
    if (!imgUrl) return null;
    const alt = title || "BAD";

    return (
      <div
        className="flex"
        style={{ width: "100%", height: BANNER_HEIGHT, overflow: "hidden" }}
      >
        <Image src={imgUrl} className="d-block h-100" alt={alt} />
      </div>
    );
  };

  const ServeContent = () => {
    return (
      <div className="flex-col">
        <div className="flex-row">
          <div className="flex" style={{ position: "relative" }}>
            <ServeCardOverLay />
            <ServeButtonsOverLay />
          </div>
          <ServeCardImage />
        </div>
        <ServeFooter />
      </div>
    );
  };

  // RETURN ---------------------------------------------------
  return (
    <div className="flex-col" style={styles.container}>
      <ServeContent />
      {/* <div style={{ marginTop: OFFSET_BOTTOM }}>
        <ButtonsRow item={item} />
      </div> */}
    </div>
  );
};

const styles = {
  container: {},
};

export default connect(HeroBanner);
