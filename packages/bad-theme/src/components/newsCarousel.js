import React from "react";
import { connect } from "frontity";
import Image from "@frontity/components/image";
import { Carousel } from "react-bootstrap";
import { colors } from "../config/colors";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";

const NewsCarousel = ({ state, actions, data }) => {
  const CAROUSEL_HEIGHT = 400;
  const array = data || [
    {
      imgUrl:
        "https://www.skinhealthinfo.org.uk/wp-content/uploads/2018/11/Skin-cancer-press-release-28-11-18-cropped.jpg",
      title:
        "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it",
    },
    {
      imgUrl:
        "https://www.skinhealthinfo.org.uk/wp-content/uploads/2021/04/Copy-of-SAW-1-Twitter.png",
      title:
        "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it",
    },
    {
      imgUrl:
        "https://www.skinhealthinfo.org.uk/wp-content/uploads/2020/12/pexels-polina-tankilevitch-3735747-scaled-e1607434622754.jpg",
      title:
        "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it",
    },
  ];

  // SERVERS ----------------------------------------------------------------
  const ServeOverlay = () => {
    return (
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          width: "100%",
          height: CAROUSEL_HEIGHT,
          background: `linear-gradient(90deg, rgba(31,51,94,1) 0%, rgba(133,133,148,0.1) 80%)`,
        }}
      />
    );
  };

  return (
    <div>
      <Carousel>
        {array.map((item) => {
          const { imgUrl, url, title } = item;

          // HELPERS ----------------------------------------------------
          const handleGoToAction = () => {
            actions.router.set(`${url}`);
          };

          // SERVERS ----------------------------------------------------------------
          const ServeFindOutMoreAction = () => {
            return (
              <button
                className="btn btn-outline-light flex-center-row mt-4"
                style={{ textTransform: "uppercase" }}
                onClick={handleGoToAction}
              >
                <div>Find out more</div>
                <div>
                  <KeyboardArrowRightIcon style={{ fill: colors.white }} />
                </div>
              </button>
            );
          };

          const ServeEventAction = () => {
            return (
              <button
                className="btn btn-outline-light flex-center-row mb-4"
                onClick={handleGoToAction}
              >
                <div>Event</div>
              </button>
            );
          };

          return (
            <Carousel.Item>
              <div
                style={{
                  position: "relative",
                  height: CAROUSEL_HEIGHT,
                }}
              >
                <Image className="d-block w-100" src={imgUrl} alt="Title" />
                <ServeOverlay />
                <div style={{ paddingLeft: "2em" }}>
                  <Carousel.Caption>
                    <ServeEventAction />
                    <div style={{ maxWidth: "75%" }}>
                      <h3 style={{ fontSize: "2em", textAlign: "start" }}>
                        {title}
                      </h3>
                    </div>
                    <ServeFindOutMoreAction />
                  </Carousel.Caption>
                </div>
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
