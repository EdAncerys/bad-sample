import { useState, useEffect } from "react";
import { connect } from "frontity";
import Image from "@frontity/components/image";

import Loading from "./loading";

const MultiPhotoBlock = ({ state, actions, block }) => {
  if (!block) return <Loading />;
  if (!block.photo_card) return null;

  const BANNER_HEIGHT = state.theme.bannerHeight;
  const marginHorizontal = state.theme.marginHorizontal;
  const marginVertical = state.theme.marginVertical;

  const [imgArray, setImageArray] = useState([]);
  const GAP = 20;

  useEffect(() => {
    let imgArray = [];
    block.photo_card.map((block) => {
      const { background_image } = block;
      imgArray.push(background_image.url);
    });
    setImageArray(imgArray);
  }, []);

  const PHOTO_NUMBER = imgArray.length;

  // SERVERS ---------------------------------------------------
  const ServeCardImage = ({ url, height }) => {
    if (!url) return null;
    const alt = "BAD";

    return (
      <div style={{ width: `100%`, height: height || `100%` }}>
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

  const ServeSplitImg = () => {
    if (PHOTO_NUMBER !== 3) return null;

    return (
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `1fr 1fr`,
          gap: GAP,
        }}
      >
        <ServeCardImage url={imgArray[0]} height={BANNER_HEIGHT + GAP} />
        <div
          style={{
            display: "grid",
            gridTemplateColumns: `1fr`,
            gap: GAP,
          }}
        >
          <ServeCardImage url={imgArray[1]} height={BANNER_HEIGHT / 2} />
          <ServeCardImage url={imgArray[2]} height={BANNER_HEIGHT / 2} />
        </div>
      </div>
    );
  };

  const ServeMultipleImg = () => {
    if (PHOTO_NUMBER === 1 || PHOTO_NUMBER === 3) return null;

    return (
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `1fr 1fr`,
          gap: GAP,
        }}
      >
        {imgArray.map((url, key) => {
          return <ServeCardImage key={key} url={url} height={BANNER_HEIGHT} />;
        })}
      </div>
    );
  };

  const ServeSingleImg = () => {
    if (PHOTO_NUMBER !== 1) return null;

    return (
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `1fr`,
        }}
      >
        <ServeCardImage url={imgArray[0]} height={BANNER_HEIGHT} />
      </div>
    );
  };

  // RETURN ---------------------------------------------------
  return (
    <div style={{ margin: `${marginVertical}px ${marginHorizontal}px` }}>
      <div>
        <ServeSingleImg />
        <ServeSplitImg />
        <ServeMultipleImg />
      </div>
    </div>
  );
};

const styles = {
  container: {
    // add custom wrapping to card elements
    // display: "flex",
    // flexWrap: "wrap",
    // justifyContent: "center",
  },
};

export default connect(MultiPhotoBlock);
