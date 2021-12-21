import React from "react";
import { connect } from "frontity";
import Image from "@frontity/components/image";
import { Carousel } from "react-bootstrap";
import { colors } from "../config/colors";

import Loading from "./loading";

import Card from "./card/card";
import LeftIcon from "../img/svg/leftIcon.svg";
import RightIcon from "../img/svg/rightIcon.svg";

const NewsCarousel = ({ state, actions, libraries, block, isMenu }) => {
  const Html2React = libraries.html2react.Component; // Get the component exposed by html2react.

  if (!block) return <Loading />;

  const { disable_vertical_padding } = block;

  const BLOCK_PAIRS = block.news_card.flatMap((_, i, a) =>
    i % 2 ? [] : [a.slice(i, i + 2)]
  ); // split data in array of pairs
  const BANNER_HEIGHT = state.theme.bannerHeight;
  const marginHorizontal = isMenu ? 0 : state.theme.marginHorizontal;
  let marginVertical = state.theme.marginVertical;
  if (disable_vertical_padding) marginVertical = 0;

  // SERVERS ----------------------------------------------------------------
  const ServeIcon = ({ icon, left, right }) => {
    if (!icon) return null;

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
          marginLeft: left ? "1.5em" : "",
          marginRight: right ? "1.5em" : "",
        }}
      >
        <Image className="d-block h-100" src={icon} />
      </div>
    );
  };

  return (
    <div style={{ margin: `${marginVertical}px ${marginHorizontal}px` }}>
      <Carousel className="news-carousel">
        {BLOCK_PAIRS.map((block, key) => {
          const isSingleBlock = block.length === 1;

          return (
            <Carousel.Item key={key}>
              <ServeIcon icon={LeftIcon} left />
              <ServeIcon icon={RightIcon} right />
              <div
                className="flex"
                style={{ padding: `0 ${state.theme.marginHorizontal}px` }}
              >
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
                        height: BANNER_HEIGHT * 1.2,
                      }}
                    >
                      <ServeDivider i={1} />
                      <Card
                        newsCarousel={{ date, release }}
                        cardWidth={isSingleBlock ? "50%" : "100%"}
                        cardHeight={BANNER_HEIGHT}
                        title={title}
                        url={background_image.url}
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
