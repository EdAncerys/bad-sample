import React from "react";
import { connect } from "frontity";
import Image from "@frontity/components/image";
import { Carousel } from "react-bootstrap";

const CarouselComponent = ({ state, actions }) => {
  const IMAGE_HEIGHT = 300;
  return (
    <Carousel>
      <Carousel.Item>
        <Image
          className="d-block w-100"
          src="https://www.skinhealthinfo.org.uk/wp-content/uploads/2018/11/Skin-cancer-press-release-28-11-18-cropped.jpg"
          alt="Title"
          height={IMAGE_HEIGHT}
        />
        <Carousel.Caption>
          <h3>First slide label</h3>
          <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item>
        <Image
          className="d-block w-100"
          src="https://www.skinhealthinfo.org.uk/wp-content/uploads/2021/04/Copy-of-SAW-1-Twitter.png"
          alt="Title"
          height={IMAGE_HEIGHT}
        />
        <Carousel.Caption>
          <h3>Second slide label</h3>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item>
        <Image
          className="d-block w-100"
          src="https://www.skinhealthinfo.org.uk/wp-content/uploads/2020/12/pexels-polina-tankilevitch-3735747-scaled-e1607434622754.jpg"
          alt="Title"
          height={IMAGE_HEIGHT}
        />
        <Carousel.Caption>
          <h3>Third slide label</h3>
          <p>
            Praesent commodo cursus magna, vel scelerisque nisl consectetur.
          </p>
        </Carousel.Caption>
      </Carousel.Item>
    </Carousel>
  );
};

export default connect(CarouselComponent);
