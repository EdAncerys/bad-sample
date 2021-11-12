import { useState, useEffect } from "react";
import { connect } from "frontity";
import Image from "@frontity/components/image";
import { colors } from "../../config/colors";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";

import CardFS from "../cardFS";
import CardBlockHeader from "../cardBlockHeader";
import Template from "../../img/svg/template.svg";

const JournalPromoBlock = ({ state, actions }) => {
  const array = [1, 2, 3]; // TBD

  const ServeJournalCards = () => {
    return (
      <div className="flex" style={{ justifyContent: "space-around" }}>
        {array.map((item) => {
          return <RowCard key={item} title="British Journal of Dermatology" />;
        })}
      </div>
    );
  };

  const RowCard = ({ url, title, imgUrl }) => {
    const URL = imgUrl || Template;

    // HELPERS ---------------------------------------------
    const handleGoToPath = () => {
      actions.router.set(`${url}`);
      console.log("url", url);
    };

    // SERVERS ---------------------------------------------
    const ServeCardActions = () => {
      return (
        <div className="card-body flex-col" style={{ margin: "5px 0" }}>
          <div className="flex mb-2" style={{ textAlign: "start" }}>
            <p className="card-text">{title}</p>
          </div>
          <div
            className="flex-row pointer"
            style={{ alignItems: "center" }}
            onClick={handleGoToPath}
          >
            <div style={{ textTransform: "uppercase", fontSize: "0.75em" }}>
              <p className="card-text">Read More</p>
            </div>
            <div>
              <KeyboardArrowRightIcon style={{ fill: colors.darkSilver }} />
            </div>
          </div>
        </div>
      );
    };

    const ServeCardLogo = () => {
      return (
        <div
          className="flex-center-col"
          style={{
            borderRight: `2px solid ${colors.silver}`,
          }}
        >
          <div
            style={{
              borderRadius: "50%",
              overflow: "hidden",
              width: 75,
              height: 75,
            }}
          >
            <Image className="d-block w-100" src={URL} alt="BAD" />
          </div>
        </div>
      );
    };

    // RETURN ----------------------------------------------------------------
    return (
      <div className="card flex-center-row shadow" style={styles.journalCard}>
        <ServeCardLogo />
        <ServeCardActions />
      </div>
    );
  };

  return (
    <div>
      <CardBlockHeader
        title="Journal Information"
        urlTitle="Learn More"
        url="/learn-more"
      />
      <ServeJournalCards />
      <CardFS
        title="It is a long established fact that a reader will be distracted by the readable"
        body="It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like)."
      />
    </div>
  );
};

const styles = {
  journalCard: {
    display: "flex",
    margin: `0 10px`,
    width: "30%",
  },
  cardWrapper: {
    display: "flex",
    flexDirection: "row",
    overflow: "hidden",
  },
};

export default connect(JournalPromoBlock);
