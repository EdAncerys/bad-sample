import { useState, useEffect } from "react";
import { connect } from "frontity";
import Image from "@frontity/components/image";
import { Carousel } from "react-bootstrap";

import { colors } from "../../config/colors";

import Loading from "../loading";

import Card from "../card/card";
import LeftIcon from "../../img/svg/leftIcon.svg";
import RightIcon from "../../img/svg/rightIcon.svg";

const NewsCarouselComponent = ({ state, actions, libraries, block }) => {
  const Html2React = libraries.html2react.Component; // Get the component exposed by html2react.

  const [postList, setPostList] = useState(null);
  const [category, setCategory] = useState(null);
  const { post_limit, disable_vertical_padding } = block;

  // DATA pre FETCH ----------------------------------------------------------------
  useEffect(async () => {
    let POST_LIST = Object.values(state.source.post); // add postData object to data array
    if (post_limit) POST_LIST = POST_LIST.slice(0, Number(post_limit)); // apply limit on posts
    if (state.source.category) {
      const CATEGORY = Object.values(state.source.category);
      setCategory(CATEGORY);
    }

    setPostList(POST_LIST);
  }, [state.source.post]);

  if (!postList || !category) return <Loading />;

  const BLOCK_PAIRS = postList.flatMap((_, i, a) =>
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
          marginLeft: left ? "1.5em" : "",
          marginRight: right ? "1.5em" : "",
        }}
      >
        <Image className="d-block h-100" src={icon} />
      </div>
    );
  };

  return (
    <div style={{ margin: `${marginVertical}px 0` }}>
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
                  const filter = category.filter(
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
                        height: BANNER_HEIGHT * 1.2,
                      }}
                    >
                      <ServeDivider i={1} />
                      <Card
                        newsCarousel={{ date, categoryName, media }}
                        cardWidth={isSingleBlock ? "50%" : "100%"}
                        cardHeight={BANNER_HEIGHT}
                        title={excerpt ? excerpt.rendered : null}
                        colour={
                          press_release_authors
                            ? press_release_authors[0].colour
                            : null
                        }
                        link={link}
                        link_label="Read More"
                        limitTitleLength
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
    </div>
  );
};

const styles = {
  container: {},
};

export default connect(NewsCarouselComponent);
