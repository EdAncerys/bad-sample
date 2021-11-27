import { useState, useEffect } from "react";
import { connect } from "frontity";
import { colors } from "../../config/colors";
import Image from "@frontity/components/image";

import CardBody from "./carBody";
import CardActions from "./cardActions";
import JournalCard from "../home/journalCard";
import PromoHeader from "./promoHeader";

const Card = ({
  state,
  actions,
  libraries,
  colour,
  cardTitle,
  title,
  body,
  link,
  downloadFile,
  fundingPromo,
  textAlign,
  url,
  form_link,
  shadow,
  cardWidth,
  cardHeight,
  heroBanner,
  journalCard,
}) => {
  const Html2React = libraries.html2react.Component; // Get the component exposed by html2react.
  const TEXT_ALIGN = textAlign || "start"; // takes values 'start' | 'center' | 'end'
  const THEME = colour || colors.primary;
  const SHADOW = shadow ? "shadow" : "";

  const handleFormPath = () => {
    // console.log("link", link); // debug
    actions.router.set(`${form_link}`);
  };

  // SERVERS ----------------------------------------------
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

  const ServeJournalCard = () => {
    if (!journalCard) return null;

    return (
      <JournalCard
        image={journalCard.image}
        title={journalCard.title}
        user={journalCard.user}
        tweet
      />
    );
  };

  const ServeCardImage = () => {
    if (!url) return null;
    const alt = title || "BAD";

    return (
      <div style={{ width: "100%", height: "50%" }}>
        <Image
          src={url}
          alt={alt}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      </div>
    );
  };

  const ServeCardHeader = () => {
    if (url) return null;
    if (!cardTitle) return null;

    return (
      <div>
        <div
          className="flex"
          style={{
            backgroundColor: colors.lightSilver,
            borderRadius: 5,
            textTransform: "uppercase",
            marginBottom: `1em`,
          }}
        >
          <Html2React html={cardTitle} />
        </div>
      </div>
    );
  };

  const ServeContent = () => {
    return (
      <div className="flex-col" style={{ padding: `2em` }}>
        <ServeCardHeader />
        <ServeJournalCard />
        <CardBody
          title={title}
          body={body}
          url={url}
          heroBanner={heroBanner}
          TEXT_ALIGN={TEXT_ALIGN}
        />
        <CardActions
          link={link}
          form_link={form_link}
          downloadFile={downloadFile}
        />
      </div>
    );
  };

  // RETURN ----------------------------------------------------
  return (
    <div
      className={SHADOW}
      style={{
        ...styles.card,
        backgroundColor: colors.white,
        width: cardWidth || "100%",
        height: cardHeight || "100%",
      }}
    >
      <PromoHeader fundingPromo={fundingPromo} />
      <ServeCardImage />
      <ServeContent />
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
    borderBottom: `1px solid ${colors.black}`,
    cursor: "pointer",
  },
};

export default connect(Card);
