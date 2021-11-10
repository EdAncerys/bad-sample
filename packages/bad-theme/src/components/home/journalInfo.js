import { useState, useEffect } from "react";
import { connect } from "frontity";
import Image from "@frontity/components/image";

const JournalInfo = ({ state, actions }) => {
  // SERVERS ---------------------------------------------
  const ServeCardComponent = ({ url, title }) => {
    const IMAGE_HEIGHT = 60;

    return (
      <div className="card text-center w-30">
        <div style={styles.cardWrapper}>
          <div className="card-body">
            <Image
              className="d-block w-100"
              src={url}
              alt={title}
              height={IMAGE_HEIGHT}
            />
          </div>
          <div className="card-body">
            <h5 className="card-title">{title}</h5>
            <p className="card-text">READ MORE</p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div style={styles.container}>
      <div>
        <ServeCardComponent
          url="https://www.bad.org.uk/library-media/images/British-Skin-Foundation-Logo.jpg"
          title="British Journal of Dermatology"
        />
      </div>
      <div></div>
    </div>
  );
};

const styles = {
  container: {},
  cardWrapper: {
    display: "flex",
    flexDirection: "row",
  },
};

export default connect(JournalInfo);
