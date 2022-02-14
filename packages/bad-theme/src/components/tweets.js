import { useState, useEffect } from "react";
import { connect } from "frontity";
import { colors } from "../config/imports";

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

  let PADDING_BOTTOM = 0;
  if (
    disable_vertical_padding &&
    (facebook_link || twitter_link || instagram_link)
  )
    PADDING_BOTTOM = 40;

  const SOCIAL_BLOCK = {
    disable_vertical_padding,
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

  if (!tweets) return <Loading />;

  // RETURN ---------------------------------------------------
  return (
    <div style={{ margin: `${marginVertical}px ${marginHorizontal}px` }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(3, 1fr)`,
          justifyContent: "space-between",
          gap: 20,
          paddingBottom: PADDING_BOTTOM,
        }}
      >
        {tweets.map((block, key) => {
          const { html } = block;

          return (
            <div key={key} className="flex tweet">
              {/* <Card
                tweetInfo={block}
                body={html}
                colour={colors.danger}
                shadow // optional param
              /> */}
              <Html2React html={html} />
            </div>
          );
        })}
      </div>
      <SocialIcons block={SOCIAL_BLOCK} />
    </div>
  );
};

const styles = {
  container: {},
};

export default connect(Tweets);
