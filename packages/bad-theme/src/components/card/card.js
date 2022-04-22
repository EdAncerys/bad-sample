import { useState, useEffect, useRef } from "react";
import { connect } from "frontity";
import { colors } from "../../config/imports";
import Image from "@frontity/components/image";
import CardBody from "./cardBody";
import CardActions from "./cardActions";
import JournalCard from "../home/journalCard";
import PromoHeader from "./promoHeader";
import VideoGuide from "./videoGuide";
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
import FundingHeader from "./fundingHeader";
import FeaturedBanner from "./featuredBanner";
import defaultVideoCover from "../../img/png/video_default.jpg";
import GeneralModal from "../elections/generalModal";
import DownloadFileBlock from "../downloadFileBlock";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
// CONTEXT ----------------------------------------------------------------
import {
  useAppDispatch,
  useAppState,
  setGoToAction,
  getWileyAction,
  setErrorAction,
  loginAction,
} from "../../context";

const Card = ({
  state,
  actions,
  libraries,
  colour,
  cardTitle,
  title,
  body,
  bodyLimit,
  link_label,
  link,
  rssFeedLink,
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
  titleLimit,
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
  downloads,
  fundingHeader,
  videoGuide,
  featuredBanner,
  videoArchive,
  noVideoCategory,
  shareToSocials,
  disableCardAnimation,
  delay,
  animationType,
  isElectionBlock,
}) => {
  const Html2React = libraries.html2react.Component; // Get the component exposed by html2react.
  const TEXT_ALIGN = textAlign || "start"; // takes values 'start' | 'center' | 'end'
  const THEME = colour || colors.primary;
  const isShadow = shadow ? "shadow" : "";

  let CARD_HEIGHT = "100%";
  let ELECTION_BLOCKS = false;
  if (cardHeight) CARD_HEIGHT = cardHeight;

  let MIN_CARD_HEIGHT = "auto";
  if (isFrom4Col) MIN_CARD_HEIGHT = 250;
  if (cardMinHeight) MIN_CARD_HEIGHT = cardMinHeight;

  let PADDING = heroBanner ? 0 : `1.5em`;
  if (isFrom4Col) PADDING = `1em`;
  if (newsAndMediaInfo) PADDING = `0 1.5em 1.5em`;
  if (removePadding) PADDING = 0;
  if (padding) PADDING = padding;

  let isCardAnimation = "card-wrapper";
  if (disableCardAnimation) isCardAnimation = "";

  const dispatch = useAppDispatch();
  const { isActiveUser, refreshJWT } = useAppState();

  const [authLink, setAuthLink] = useState(null);
  const [isFetching, setFetching] = useState(null);
  const useEffectRef = useRef(null);

  useEffect(async () => {
    if (!rssFeedLink) return null;

    const { link, doi } = rssFeedLink;
    let authLink = link;

    try {
      setFetching(true);

      // ⏬⏬  validate auth link for users via wiley ⏬⏬
      // get auth link to wiley if user is BAD member & logged in
      if (isActiveUser) {
        const wileyLink = await getWileyAction({
          state,
          dispatch,
          refreshJWT,
          doi,
          isActiveUser,
        });
        if (wileyLink) authLink = wileyLink;
      }
    } catch (error) {
      console.log(error);
    } finally {
      setAuthLink(authLink); // set auth link via wiley
      setFetching(false);
    }

    return () => {
      useEffectRef.current = false; // clean up function
    };
  }, [isActiveUser]);

  // HANDLERS ---------------------------------------------
  const handelLogin = () => {
    setErrorAction({ dispatch, isError: null });
    loginAction({ state });
  };

  const handelRedirect = () => {
    setErrorAction({ dispatch, isError: null });
    setGoToAction({ state, path: authLink, actions });
  };

  const onClickHandler = () => {
    if (rssFeedLink && !isActiveUser) {
      // 📌 track notification error action
      setErrorAction({
        dispatch,
        isError: {
          message: `BAD members, make sure you are logged in to your BAD account to get free access to our journals. To continue to the publication without logging in, click 'Read Publication'`,
          image: "Error",
          action: [
            {
              label: "Read Publication",
              handler: handelRedirect,
            },
            { label: "Login", handler: handelLogin },
          ],
        },
      });
      return;
    }
    if (!isElectionBlock)
      setGoToAction({ state, path: link || authLink, actions, downloadFile });
  };

  // SERVERS ----------------------------------------------
  const ServeFooter = () => {
    if (disableFooter) return null;

    return (
      <div
        className="bad-card-footer"
        style={{
          backgroundColor: THEME,
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

  const ServeDownloads = () => {
    if (!downloads) return null;

    return (
      <div style={{ padding: `0.5em 0` }}>
        <DownloadFileBlock
          block={{
            file: { url: downloads.url, filename: downloads.filename },
            title: downloads.title,
          }}
          disableMargin
        />
      </div>
    );
  };

  const ServeCardImage = () => {
    if (videoArchive) return null;
    if (!url) return null;
    const alt = title || "BAD";

    let STYLES = { minHeight: 200, maxHeight: 300 };
    if (imgHeight) STYLES = { height: imgHeight };

    return (
      <div
        style={{ ...STYLES, width: "100%", overflow: "hidden" }}
        onClick={() => setGoToAction({ state, path: link, actions })}
      >
        <Image
          src={url}
          alt={alt}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            cursor: link ? "pointer" : null,
            transition: "transform 1s",
          }}
          className="card-image-animated"
        />
      </div>
    );
  };
  const ServeVideoCover = () => {
    if (!videoArchive) return null;
    if (!url) return null;

    const [vimeoCover, setVimeoCover] = useState(defaultVideoCover);

    let STYLES = { minHeight: 200, maxHeight: 300 };
    if (imgHeight) STYLES = { height: imgHeight };
    const getVimeoCover = async () => {
      const video_url = videoArchive.acf.video;
      const reg = /\d+/g;
      const videoId = video_url.match(reg);
      const fetchVideoData = await fetch(
        `https://vimeo.com/api/v2/video/${videoId[0]}.json`
      );
      if (fetchVideoData.ok) {
        const json = await fetchVideoData.json();
        setVimeoCover(json[0].thumbnail_large);
      }
    };

    useEffect(() => {
      getVimeoCover();
    }, []);

    return (
      <div
        style={{ position: "relative", cursor: "pointer" }}
        onClick={() => setGoToAction({ state, path: link, actions })}
      >
        <Image src={vimeoCover} alt="Submit" style={{ width: "100%" }} />
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            color: "white",
          }}
        >
          <PlayCircleOutlineIcon
            sx={{ fontSize: 80 }}
            style={{ cursor: "pointer" }}
          />
        </div>
      </div>
    );
  };

  const ServeCardHeader = () => {
    if (!cardTitle || url) return null;

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
      <div className="flex-col" style={{ padding: PADDING, height: "100%" }}>
        <GeneralModal handler={handler} />
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
          bodyLimit={bodyLimit}
          date={date}
          publicationDate={publicationDate}
          seatNumber={seatNumber}
          heroBanner={heroBanner}
          TEXT_ALIGN={TEXT_ALIGN}
          isFrom4Col={isFrom4Col}
          titleLimit={titleLimit}
          electionInfo={electionInfo}
          opacity={opacity}
          videoArchive={videoArchive}
          noVideoCategory={noVideoCategory}
          shareToSocials={shareToSocials}
        />
        <VideoGalleryInfo videoGalleryInfo={videoGalleryInfo} />
        <ServeDownloads />
        <CardActions
          link_label={link_label}
          link={link}
          rssFeedLink={rssFeedLink}
          form_label={form_label}
          form_link={form_link}
          downloadFile={downloadFile}
          handler={handler}
          electionBlocks={ELECTION_BLOCKS}
          videoArchive={videoArchive}
          isFetching={isFetching}
          authLink={authLink}
        />
      </div>
    );
  };

  // RETURN ----------------------------------------------------
  return (
    <div
      className={`${isShadow} ${isCardAnimation} heading-tile`} // card wrapper as clickable card if link is set
      style={{
        ...styles.card,
        backgroundColor: backgroundColor || colors.white,
        width: cardWidth || "100%",
        height: videoArchive ? null : CARD_HEIGHT,
        minHeight: MIN_CARD_HEIGHT,
      }}
      onClick={onClickHandler}
      data-aos={videoArchive ? "none" : animationType || "fade"}
      data-aos-delay={`${delay * 50}`}
      data-aos-duration="500"
    >
      <PromoHeader fundingPromo={fundingPromo} />
      <FeaturedBanner featuredBanner={featuredBanner} />
      <VideoGuide videoGuide={videoGuide} />
      <FundingHeader fundingHeader={fundingHeader} />
      <ImageAndPromoCard imageAndPromoCard={imageAndPromoCard} />
      <NewsAndMediaHeader newsAndMediaInfo={newsAndMediaInfo} layout={layout} />
      <GalleryCarousel gallery={gallery} />
      <NewsArticleHeader newsArticle={newsArticle} />
      <NewsCarousel newsCarousel={newsCarousel} />
      <ServeCardImage />
      <ServeVideoCover />
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
    position: "relative",
  },
  footerActionTitle: {
    borderBottom: `1px solid ${colors.softBlack}`,
    cursor: "pointer",
  },
};

export default connect(Card);
