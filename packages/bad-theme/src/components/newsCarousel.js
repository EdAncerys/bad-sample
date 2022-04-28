import { connect } from "frontity";
import Image from "@frontity/components/image";
import { Carousel } from "react-bootstrap";
import Loading from "./loading";
import Card from "./card/card";
import LeftIcon from "../img/svg/leftIcon.svg";
import RightIcon from "../img/svg/rightIcon.svg";

// CONTEXT --------------------------------------------------
import { muiQuery } from "../context";

const NewsCarousel = ({ state, actions, libraries, block }) => {
  const Html2React = libraries.html2react.Component; // Get the component exposed by html2react.

  if (!block) return <Loading />;

  const { sm, md, lg, xl } = muiQuery();
  const homepage = state.router.link === "/";
  const BLOCK_PAIRS = block.news_card.flatMap((_, i, a) =>
    i % 2 ? [] : [a.slice(i, i + 2)]
  ); // split data in array of pairs
  const BANNER_HEIGHT = state.theme.bannerHeight;
  const marginHorizontal = state.theme.marginHorizontal;

  // SERVERS ----------------------------------------------------------------
  const ServeIcon = ({ icon, left, right }) => {
    if (!icon) return null;
    if (lg) return null;
    return (
      <div
        style={{
          position: "absolute",
          zIndex: 1,
          width: 25,
          height: 40,
          cursor: "pointer",
          top: BANNER_HEIGHT / 2,
          right: right ? 0 : "",
          marginLeft: left ? `-6em` : "auto",
          marginRight: homepage ? 0 : right ? `-6em` : "auto",
        }}
      >
        <Image className="d-block h-100" src={icon} />
      </div>
    );
  };

  return (
    <div style={{ position: "relative", margin: `0 ${marginHorizontal}px` }}>
      <ServeIcon icon={LeftIcon} left />
      <ServeIcon icon={RightIcon} right />
      <Carousel className="news-carousel">
        {BLOCK_PAIRS.map((block, key) => {
          const isSingleBlock = block.length === 1;

          return (
            <Carousel.Item key={key}>
              <div className="flex">
                {block.map((block, key) => {
                  const {
                    background_image,
                    colour,
                    date,
                    link,
                    title,
                    release,
                  } = block;

                  const ServeDivider = ({ i }) => {
                    if (isSingleBlock) return null;
                    if (key !== i) return null;

                    return (
                      <div
                        style={{
                          display: "flex",
                          width: 10,
                        }}
                      />
                    );
                  };

                  return (
                    <div
                      key={key}
                      className="flex"
                      style={{
                        position: "relative",
                        justifyContent: "center",
                        height: !lg ? BANNER_HEIGHT * 1.2 : null,
                        minHeight: !lg ? null : BANNER_HEIGHT * 1.2,
                      }}
                    >
                      <ServeDivider i={1} />
                      <Card
                        newsCarousel={block}
                        cardWidth={isSingleBlock ? "50%" : "100%"}
                        cardHeight="90%"
                        title={title}
                        url={background_image.url}
                        imgHeight={BANNER_HEIGHT * 0.55}
                        colour={colour}
                        link={link.url}
                        shadow
                      />
                      <ServeDivider i={0} />
                    </div>
                  );
                })}
              </div>
            </Carousel.Item>
          );
        })}
      </Carousel>
    </div>
  );
};

const styles = {
  container: {},
};

export default connect(NewsCarousel);
