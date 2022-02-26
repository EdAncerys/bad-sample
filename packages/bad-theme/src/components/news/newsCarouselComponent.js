import { useState, useEffect } from "react";
import { connect } from "frontity";
import Image from "@frontity/components/image";
import { Carousel } from "react-bootstrap";

import { colors } from "../../config/imports";

import Card from "../card/card";
import LeftIcon from "../../img/svg/leftIcon.svg";
import RightIcon from "../../img/svg/rightIcon.svg";
import { muiQuery } from "../../context";

const NewsCarouselComponent = ({
  state,
  actions,
  libraries,
  block,
  categoryList,
}) => {
  const Html2React = libraries.html2react.Component; // Get the component exposed by html2react.

  const { sm, md, lg, xl } = muiQuery();

  const { post_limit, disable_vertical_padding } = block;

  const BLOCK_PAIRS = block.flatMap((_, i, a) =>
    i % 2 ? [] : [a.slice(i, i + 2)]
  ); // split data in array of pairs
  const BANNER_HEIGHT = state.theme.bannerHeight;
  const marginHorizontal = state.theme.marginHorizontal;
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
          marginLeft: left ? `-6em` : "auto",
          marginRight: right ? `-6em` : "auto",
        }}
      >
        <Image className="d-block h-100" src={icon} />
      </div>
    );
  };

  const ServeDoubleCardCarousel = () => {
    if (md) return null;

    return (
      <Carousel className="news-carousel">
        {BLOCK_PAIRS.map((block, key) => {
          const isSingleBlock = block.length === 1;

          return (
            <Carousel.Item key={key}>
              <div className="flex">
                {block.map((block, key) => {
                  const {
                    date,
                    categories,
                    title,
                    content,
                    excerpt,
                    link,
                    featured_media,
                  } = block;
                  const { press_release_authors } = block.acf;

                  const media = state.source.attachment[featured_media];
                  const filter = categoryList.filter(
                    (item) => item.id === Number(categories[0])
                  );
                  const categoryName = filter[0].name;

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
                        height: BANNER_HEIGHT * 1.4,
                      }}
                    >
                      <ServeDivider i={1} />
                      <Card
                        newsCarousel={block}
                        cardWidth={isSingleBlock ? "50%" : "100%"}
                        cardHeight={BANNER_HEIGHT}
                        colour={colors.danger}
                        link={link}
                        link_label="Read More"
                        cardHeight="90%"
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
    );
  };

  const ServeSingleCardCarousel = () => {
    if (!md) return null;

    return (
      <Carousel className="news-carousel">
        {block.map((block, key) => {
          const { date, categories, excerpt, link, featured_media } = block;

          const media = state.source.attachment[featured_media];
          const filter = categoryList.filter(
            (item) => item.id === Number(categories[0])
          );
          const categoryName = filter[0].name;

          return (
            <Carousel.Item key={key}>
              <div
                key={key}
                className="flex"
                style={{
                  position: "relative",
                  justifyContent: "center",
                  height: BANNER_HEIGHT * 1.2,
                }}
              >
                <Card
                  newsCarousel={block}
                  cardWidth="50%"
                  cardHeight={BANNER_HEIGHT}
                  title={excerpt ? excerpt.rendered : null}
                  colour={colors.danger}
                  link={link}
                  link_label="Read More"
                  titleLimit={1}
                  cardHeight="90%"
                  shadow
                />
              </div>
            </Carousel.Item>
          );
        })}
      </Carousel>
    );
  };

  return (
    <div style={{ position: "relative" }}>
      <ServeIcon icon={LeftIcon} left />
      <ServeIcon icon={RightIcon} right />

      <ServeDoubleCardCarousel />
      <ServeSingleCardCarousel />
    </div>
  );
};

const styles = {
  container: {},
};

export default connect(NewsCarouselComponent);
