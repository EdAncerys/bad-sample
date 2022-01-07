import { useState, useEffect } from "react";
import { connect } from "frontity";
import { colors } from "../config/imports";
import Image from "@frontity/components/image";
import Link from "@frontity/components/link";

import Loading from "./loading";
import Card from "./card/card";
import SocialIcons from "../components/socialIcons";
// CONTEXT ----------------------------------------------------------------
import { useAppDispatch, useAppState, getTweetsAction } from "../context";

const Tweets = ({ state, actions, libraries, block }) => {
  const Html2React = libraries.html2react.Component; // Get the component exposed by html2react.
  if (!block) return <Loading />;

  const {
    facebook_link,
    twitter_link,
    instagram_link,
    disable_vertical_padding,
  } = block;
  const dispatch = useAppDispatch();
  const { tweets } = useAppState();

  const marginHorizontal = state.theme.marginHorizontal;
  let marginVertical = state.theme.marginVertical;
  if (disable_vertical_padding) marginVertical = 0;

  const socials = {
    social_links: [
      {
        facebook: facebook_link,
        twitter: twitter_link,
        instagram: instagram_link,
      },
    ],
  };

  useEffect(() => {
    getTweetsAction({ state, dispatch });
  }, []);

  // SERVERS ---------------------------------------------
  const ServeTitle = () => {
    if (!block.title) return null;

    return (
      <div
        className="flex primary-title"
        style={{
          fontSize: 36,
          fontWeight: "bold",
          justifyContent: "center",
          padding: `1em 0`,
        }}
      >
        <Html2React html={block.title} />
      </div>
    );
  };

  if (!tweets) return <Loading />;

  // RETURN ---------------------------------------------------
  return (
    <div style={{ margin: `${marginVertical}px ${marginHorizontal}px` }}>
      <div style={styles.container}>
        {tweets.map((block, key) => {
          const { author, text } = block;

          return (
            <div key={key} className="flex">
              <Card
                tweetInfo={author}
                body={text}
                colour={colors.danger}
                shadow // optional param
              />
            </div>
          );
        })}
      </div>
      <SocialIcons block={socials} />
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
};

export default connect(Tweets);
