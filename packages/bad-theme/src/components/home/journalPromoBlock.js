import { useState, useEffect } from "react";
import { connect } from "frontity";
import Image from "@frontity/components/image";
import { colors } from "../../config/colors";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";

const JournalPromoBlock = ({ state, actions }) => {
  const array = [1, 2, 3]; // TBD

  // SERVERS ---------------------------------------------
  const ServeCardComponent = ({ url, title }) => {
    return (
      <div>
        <div className="card" style={styles.card}>
          <div
            className="card-body flex-col"
            style={{
              borderRight: `2px solid ${colors.silver}`,
              margin: `15px 0`,
            }}
          >
            <Image className="d-block" src={url} alt={title} width="100%" />
          </div>
          <div className="card-body flex-col">
            <h5 className="card-title">{title}</h5>
            <div className="flex-row">
              <span>
                <p className="card-text">Read More</p>
              </span>
              <span>
                <KeyboardArrowRightIcon />
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div style={styles.container}>
      <h5 className="card-title" style={{ paddingLeft: 15 }}>
        Journal Information
      </h5>
      <div className="d-flex">
        {array.map((item) => {
          return (
            <ServeCardComponent
              url="https://www.bad.org.uk/library-media/images/British-Skin-Foundation-Logo.jpg"
              title="British Journal of Dermatology"
            />
          );
        })}
      </div>
    </div>
  );
};

const styles = {
  card: {
    display: "flex",
    flexDirection: "row",
    margin: `0 10px`,
  },
  cardWrapper: {
    display: "flex",
    flexDirection: "row",
    overflow: "hidden",
  },
};

export default connect(JournalPromoBlock);
