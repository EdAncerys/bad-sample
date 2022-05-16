import { connect } from "frontity";
import Image from "@frontity/components/image";
import Card from "./card/card";
import Loading from "./loading";
import ButtonsRow from "./buttonsRow";
import FullWidthContentBlock from "./fullWidthContentBlock";

// CONTEXT --------------------------------------------------
import { muiQuery } from "../context";

const HeroBanner = ({ state, actions, libraries, block }) => {
  const { sm, md, lg, xl } = muiQuery();

  const Html2React = libraries.html2react.Component; // Get the component exposed by html2react.

  if (!block) return <Loading />;

  const {
    add_background_image,
    add_buttons,
    background_colour,
    background_image,
    body,
    buttons,
    layout,
    pop_out_text,
    title,
    content_height,
    disable_vertical_padding,
  } = block;

  let BANNER_HEIGHT = state.theme.bannerHeight;
  const PADDING = state.theme.marginHorizontal;
  const FOOTER_HEIGHT = 50;
  let OVERLAY_WIDTH = "100%";
  let CARD_WIDTH = !lg ? "50%" : "100%";
  let CARD_HEIGHT = BANNER_HEIGHT - FOOTER_HEIGHT * 3;
  let BODY_LENGTH = 3;
  const containerWidth = !lg ? state.theme.contentContainer : "100%";
  const marginHorizontal = state.theme.marginHorizontal;
  let marginVertical = state.theme.marginVertical;
  if (disable_vertical_padding) marginVertical = 0;
  let marginBottom = marginVertical;
  if (buttons) marginBottom = state.theme.marginVertical;
  if (!add_buttons) marginBottom = 0;

  if (content_height === "small")
    BANNER_HEIGHT = state.theme.bannerHeight * 0.75;
  if (!buttons) {
    BODY_LENGTH = 4;
    CARD_HEIGHT = BANNER_HEIGHT - FOOTER_HEIGHT;
  }
  if (!background_image && layout === "full-width") return null; // defaults to null based on config
  const BACKGROUND_COLOUR = background_colour || "transparent";

  // SERVERS -----------------------------------------------------------
  const ServeFooter = () => {
    return (
      <div
        style={{
          height: FOOTER_HEIGHT,
          width: "100%",
        }}
      />
    );
  };

  const ServeBannerOverLay = () => {
    if (layout === "full-width") return null;
    if (!pop_out_text) return null;

    return (
      <div
        className="flex-col"
        style={{
          position: "absolute",
          zIndex: 1,
          height: BANNER_HEIGHT,
          width: OVERLAY_WIDTH,
        }}
      >
        <div
          className="flex"
          style={{
            marginLeft: !lg ? PADDING : 0,
            marginTop: FOOTER_HEIGHT / 2,
          }}
        >
          <Card
            title={title}
            body={body}
            cardWidth={CARD_WIDTH}
            cardHeight={CARD_HEIGHT}
            bodyLimit={BODY_LENGTH}
            colour={block.colour}
            shadow
            heroBanner
            disableCardAnimation
          />
        </div>
      </div>
    );
  };
  const ServeBannerOverLayMobile = () => {
    if (layout === "full-width") return null;
    if (!pop_out_text) return null;

    return (
      <div className="row">
        <div
          style={{
            zIndex: 1,
          }}
        >
          <div
            className="d-flex justify-content-center"
            style={{
              marginTop: !lg ? "-20%" : !background_image ? "10%" : "-20%",
              marginBottom: !lg ? null : "10%",
            }}
          >
            <Card
              title={title}
              body={body}
              cardWidth="90%"
              bodyLength={BODY_LENGTH}
              colour={block.colour}
              shadow
              heroBanner
              disableCardAnimation
            />
          </div>
        </div>
      </div>
    );
  };
  const ServeButtonsOverLay = () => {
    if (!buttons || !add_buttons) return null;

    return (
      <div
        style={{
          position: !lg ? "absolute" : null,
          zIndex: 9,
          width: OVERLAY_WIDTH,
        }}
      >
        <div
          style={{
            margin: `0 ${PADDING}px`,
            marginTop: BANNER_HEIGHT - FOOTER_HEIGHT,
          }}
        >
          <ButtonsRow block={block} disableMargin />
        </div>
      </div>
    );
  };

  const ServeButtonsOverLayMobile = () => {
    if (!buttons) return null;

    return (
      <div
        style={{
          zIndex: 1,
          width: OVERLAY_WIDTH,
        }}
      >
        <div style={{ margin: `0 ${PADDING}px` }}>
          <ButtonsRow block={block} disableMargin />
        </div>
      </div>
    );
  };
  const ServeCardContent = () => {
    if (layout === "full-width") return null;
    if (pop_out_text) return <div className="flex" />;

    return (
      <div className="flex relative">
        <div
          style={{
            display: "grid",
            alignItems: "center",
            // position: !lg ? "absolute" : background_image ? "absolute" : null,
            position: !lg ? "absolute" : null,
            zIndex: 8,
            width: !lg
              ? !background_image
                ? containerWidth / 1.5
                : containerWidth / 2
              : containerWidth, // if no img provided defaults to diff width
            height: !lg
              ? BANNER_HEIGHT
              : background_image
              ? BANNER_HEIGHT
              : null,
            height: !lg ? BANNER_HEIGHT : null,
          }}
        >
          <FullWidthContentBlock block={block} heroBanner />
        </div>
      </div>
    );
  };

  const ServeCardImage = () => {
    if (!background_image) return <div className="flex" />;

    const alt = { title } || "BAD";
    const isFullWidth = layout === "full-width";
    const CARD_STYLES = isFullWidth
      ? {
          height: BANNER_HEIGHT,
          width: "100%",
          overflow: "hidden",
          paddingLeft: `${marginHorizontal}px`,
        }
      : {
          width: "100%",
          height: BANNER_HEIGHT,
        };

    return (
      <div className="flex">
        <div style={CARD_STYLES}>
          <Image
            src={background_image}
            alt={alt}
            style={{
              width: "100%",
              height: "100%",
              objectFit: !lg ? "cover" : "contain",
            }}
          />
        </div>
      </div>
    );
  };

  const ServeOverLay = () => {
    return (
      <div
        style={{
          height: BANNER_HEIGHT,
          width: containerWidth,
          position: "absolute",
          zIndex: 8,
        }}
      >
        <div style={{ position: "relative" }}>
          {!lg ? <ServeBannerOverLay /> : <ServeBannerOverLayMobile />}
          <ServeButtonsOverLay />
        </div>
      </div>
    );
  };

  // RETURN ---------------------------------------------------

  if (!lg) {
    return (
      <div
        className="flex-col "
        style={{
          height: BANNER_HEIGHT,
          backgroundColor: BACKGROUND_COLOUR,
          margin: `${marginVertical}px 0 ${marginBottom}px`,
        }}
      >
        <div className="flex-row relative">
          <ServeCardContent />
          <ServeOverLay />
          <ServeCardImage />
        </div>
        <ServeFooter />
      </div>
    );
  } else {
    return (
      <>
        <div className="col-12 col-lg-6">
          <ServeCardImage />
        </div>
        <div className="col-12 col-lg-6">
          <ServeCardContent />
          <ServeBannerOverLayMobile />
        </div>
      </>
    );
  }
};

const styles = {
  container: {},
};

export default connect(HeroBanner);
