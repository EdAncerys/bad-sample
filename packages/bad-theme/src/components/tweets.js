import { useState, useEffect } from "react";
import { connect } from "frontity";
import { colors } from "../config/colors";
import Image from "@frontity/components/image";
import Link from "@frontity/components/link";

import Loading from "./loading";
import Card from "./card/card";
import SocialIcons from "../components/socialIcons";
import Facebook from "../img/svg/facebookColour.svg";
import Twitter from "../img/svg/twitterColour.svg";
import Instagram from "../img/svg/instagramColour.svg";

const Tweets = ({ state, actions, libraries, block }) => {
  const Html2React = libraries.html2react.Component; // Get the component exposed by html2react.
  if (!block) return <Loading />;
  if (!block.tweets) return null;

  const marginHorizontal = state.theme.marginHorizontal;
  const marginVertical = state.theme.marginVertical;

  // SERVERS ---------------------------------------------
  const ServeTitle = () => {
    if (!block.title) return null;

    return (
      <div
        className="flex"
        style={{
          fontSize: 36,
          fontFamily: "Roboto",
          fontWeight: "bold",
          justifyContent: "center",
          padding: `1em 0`,
        }}
      >
        <Html2React html={block.title} />
      </div>
    );
  };

  // RETURN ---------------------------------------------------
  return (
    <div style={{ backgroundColor: colors.white }}>
      <div style={{ margin: `${marginVertical}px ${marginHorizontal}px` }}>
        <ServeTitle />
        <div style={styles.container}>
          {block.tweets.map((block, key) => {
            const { background_image, body, colour, user, title } = block;

            return (
              <div key={key} className="flex">
                <Card
                  journalCard={{
                    image: background_image,
                    title,
                    user,
                  }}
                  body={body}
                  colour={colour}
                  colour={colour}
                  shadow // optional param
                />
              </div>
            );
          })}
        </div>
        <SocialIcons />
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: "grid",
    gridTemplateColumns: `repeat(3, 1fr)`,
    justifyContent: "space-between",
    gap: 20,
  },
  socials: {
    width: 77,
    height: 77,
    cursor: "pointer",
    margin: `0 1em`,
  },
};

export default connect(Tweets);
