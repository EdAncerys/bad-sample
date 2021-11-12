import React from "react";
import { connect } from "frontity";
import Image from "@frontity/components/image";
import { Carousel } from "react-bootstrap";
import { colors } from "../config/colors";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";

import CardBlockHeader from "./cardBlockHeader";
import Card from "./card";
import LeftIcon from "../img/svg/leftIcon.svg";
import RightIcon from "../img/svg/rightIcon.svg";
import IndicatorActive from "../img/svg/indicatorActive.svg";
import IndicatorInactive from "../img/svg/indicatorInactive.svg";

import { DATA } from "../config/data.js";

const NewsCarousel = ({ state, actions, data }) => {
  const CAROUSEL_HEIGHT = 400;
  const array = data || DATA;

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
          top: CAROUSEL_HEIGHT / 2,
          right: right ? 0 : "",
          marginLeft: left ? "1.5em" : "",
          marginRight: right ? "1.5em" : "",
        }}
      >
        <Image className="d-block w-100" src={icon} />
      </div>
    );
  };

  return (
    <div>
      <CardBlockHeader
        title="Latest News & Media"
        urlTitle="View All"
        url="/learn-more"
      />
      <Carousel className="news-carousel">
        {array.map((item) => {
          console.log(item);
          const { imgUrl, body, title } = item;

          return (
            <Carousel.Item key={item.id}>
              <ServeIcon icon={LeftIcon} left />
              <ServeIcon icon={RightIcon} right />
              <div
                className="flex-row"
                style={{
                  position: "relative",
                  justifyContent: "center",
                  height: CAROUSEL_HEIGHT,
                }}
              >
                <Card
                  cardWidth="40%"
                  title={title}
                  body={body}
                  imgUrl={imgUrl}
                />
                <Card
                  cardWidth="40%"
                  title={title}
                  body={body}
                  imgUrl={imgUrl}
                />
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
