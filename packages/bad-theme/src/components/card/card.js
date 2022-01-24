import { useState, useEffect } from "react";
import { connect } from "frontity";
import { colors } from "../../config/imports";
import Image from "@frontity/components/image";

import CardBody from "./cardBody";
import CardActions from "./cardActions";
import JournalCard from "../home/journalCard";
import PromoHeader from "./promoHeader";
import GalleryCarousel from "./galleryCarousel";
import VenueInfo from "./venueInfo";
import NewsArticleHeader from "./newsArticleHeader";
import VideoGalleryInfo from "./videoGalleryInfo";
import NewsCarousel from "./newsCarousel";
import EventCardHeader from "./eventCardHeader";
import NewsAndMediaHeader from "./newsAndMediaHeader";
import AuthorInfo from "./authorInfo";
import ImageAndPromoCard from "./imageAndPromoCard";
import TweetInfo from "./tweetInfo";
import FadDirectory from "./fadDirectory";
import DermGroupe from "./dermGroupe";

import GeneralModal from "../elections/generalModal";

const Card = ({
  state,
  actions,
  libraries,
  colour,
  cardTitle,
  title,
  body,
  link_label,
  link,
  downloadFile,
  gallery,
  venueInfo,
  authorInfo,
  tweetInfo,
  videoGalleryInfo,
  electionInfo,
  handler,
  newsAndMediaInfo,
  fundingPromo,
  textAlign,
  url,
  imgHeight,
  isFrom4Col,
  form_label,
  form_link,
  date,
  publicationDate,
  layout,
  seatNumber,
  eventHeader,
  limitBodyLength,
  limitTitleLength,
  shadow,
  backgroundColor,
  opacity,
  cardWidth,
  cardHeight,
  padding,
  cardMinHeight,
  heroBanner,
  newsCarousel,
  journalCard,
  newsArticle,
  imageAndPromoCard,
  removePadding,
  fadDirectory,
  disableFooter,
  dermGroupe,
}) => {
  const Html2React = libraries.html2react.Component; // Get the component exposed by html2react.
  const TEXT_ALIGN = textAlign || "start"; // takes values 'start' | 'center' | 'end'
  const THEME = colour || colors.primary;
  const SHADOW = shadow ? "shadow" : "";
  const [modalData, setModalData] = useState();

  let CARD_HEIGHT = "100%";
  let ELECTION_BLOCKS = false;
  if (title || body) CARD_HEIGHT = "auto";
  if (cardHeight) CARD_HEIGHT = cardHeight;

  let MIN_CARD_HEIGHT = "auto";
  if (isFrom4Col) MIN_CARD_HEIGHT = 250;
  if (cardMinHeight) MIN_CARD_HEIGHT = cardMinHeight;

  let PADDING = heroBanner ? 0 : `1.5em`;
  if (isFrom4Col) PADDING = `1em`;
  if (newsAndMediaInfo) PADDING = `0 1.5em 1.5em`;
  if (removePadding) PADDING = 0;
  if (padding) PADDING = padding;

  // APPLIES TO BAD ELECTIONS ------------------------------
  if (state.router.link === "/about-the-bad/bad-elections/") {
    CARD_HEIGHT = "200px";
    limitBodyLength = 300;
    link_label = "Read more";
    ELECTION_BLOCKS = true;
    handler = () => {
      modalData
        ? setModalData(null)
        : setModalData({
            body,
            link,
            title,
          });
    };
  }

  // SERVERS ----------------------------------------------
  const ServeFooter = () => {
    if (disableFooter) return null;

    return (
      <div
        style={{
          backgroundColor: THEME,
          height: 5,
          width: "100%",
          opacity: opacity || 1,
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
      />
    );
  };

  const ServeCardImage = () => {
    if (!url) return null;
    const alt = title || "BAD";

    let STYLES = { minHeight: 200, maxHeight: 300 };
    if (imgHeight) STYLES = { height: imgHeight };

    return (
      <div style={{ ...STYLES, width: "100%" }}>
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
      <div style={{ opacity: opacity || 1 }}>
        <div className="flex" style={{ justifyContent: "flex-start" }}>
          <div
            style={{
              backgroundColor: colors.lightSilver,
              fontSize: 12,
              letterSpacing: 2,
              borderRadius: 5,
              textTransform: "uppercase",
              marginBottom: `1em`,
              padding: `0.5em`,
            }}
          >
            <Html2React html={cardTitle} />
          </div>
        </div>
      </div>
    );
  };

  const ServeContent = () => {
    return (
      <div className="flex-col" style={{ padding: PADDING }}>
        <GeneralModal modalData={modalData} handler={handler} />
        <ServeCardHeader />
        <EventCardHeader eventHeader={eventHeader} />
        <VenueInfo venueInfo={venueInfo} />
        <AuthorInfo authorInfo={authorInfo} />
        <TweetInfo tweetInfo={tweetInfo} />
        <FadDirectory fadDirectory={fadDirectory} />
        <DermGroupe dermGroupe={dermGroupe} />
        <ServeJournalCard />
        <CardBody
          title={title}
          body={body}
          date={date}
          publicationDate={publicationDate}
          seatNumber={seatNumber}
          heroBanner={heroBanner}
          TEXT_ALIGN={TEXT_ALIGN}
          isFrom4Col={isFrom4Col}
          limitBodyLength={limitBodyLength}
          limitTitleLength={limitTitleLength}
          electionInfo={electionInfo}
          opacity={opacity}
        />
        <VideoGalleryInfo videoGalleryInfo={videoGalleryInfo} />
        <CardActions
          link_label={link_label}
          link={link}
          form_label={form_label}
          form_link={form_link}
          downloadFile={downloadFile}
          handler={handler}
          electionBlocks={ELECTION_BLOCKS}
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
        backgroundColor: backgroundColor || colors.white,
        width: cardWidth || "100%",
        height: CARD_HEIGHT,
        minHeight: MIN_CARD_HEIGHT,
        position: "relative",
      }}
    >
      <PromoHeader fundingPromo={fundingPromo} />
      <ImageAndPromoCard imageAndPromoCard={imageAndPromoCard} />
      <NewsAndMediaHeader newsAndMediaInfo={newsAndMediaInfo} layout={layout} />
      <GalleryCarousel gallery={gallery} />
      <NewsArticleHeader newsArticle={newsArticle} />
      <NewsCarousel newsCarousel={newsCarousel} />
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
    borderBottom: `1px solid ${colors.softBlack}`,
    cursor: "pointer",
  },
};

export default connect(Card);
