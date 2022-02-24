import React from "react";
import { connect, styled } from "frontity";

import { colors } from "../config/imports";
import Card from "../components/card/card";

import { muiQuery } from "../context";
// BLOCK WIDTH WRAPPER -------------------------------------------------------
import BlockWrapper from "../components/blockWrapper";

const Post = ({ state, actions, libraries }) => {
  const { sm, md, lg, xl } = muiQuery();

  const Html2React = libraries.html2react.Component; // Get the component exposed by html2react.
  const data = state.source.get(state.router.link);
  const post = state.source[data.type][data.id];
  console.log("post data: ", post); // debug

  const marginHorizontal = state.theme.marginHorizontal;
  const marginVertical = state.theme.marginVertical;

  const { categories, title, content, excerpt, link } = post;
  const { press_release_authors } = post.acf;

  // SERVERS ---------------------------------------------
  const ServeTitle = () => {
    if (!title) return null;

    return (
      <div className="flex primary-title" style={{ fontSize: !lg ? 36 : 25 }}>
        <Html2React html={title.rendered} />
      </div>
    );
  };
  const ServeContent = () => {
    const ServeBody = () => {
      if (!content) return null;

      return (
        <div className="flex-col">
          <Html2React html={content.rendered} />
        </div>
      );
    };

    return (
      <div className="text-body">
        {!lg ? <ServeTitle /> : null}
        <ServeBody />
      </div>
    );
  };

  const ServeSideBar = () => {
    return (
      <div>
        <Card
          authorInfo={post}
          colour={
            press_release_authors ? press_release_authors[0].colour : null
          }
          shadow
          cardHeight="auto"
        />
      </div>
    );
  };

  return (
    <BlockWrapper>
      <div
        style={
          !lg
            ? {
                display: "grid",
                gridTemplateColumns: `2.5fr 1fr`,
                gap: 20,
                padding: `${marginVertical}px ${marginHorizontal}px`,
              }
            : {
                display: "flex",
                flexDirection: "column-reverse",
                gap: 20,
                padding: `${marginVertical}px ${marginHorizontal}px`,
              }
        }
      >
        <ServeContent />
        <ServeSideBar />
        {!lg ? null : <ServeTitle />}
      </div>
    </BlockWrapper>
  );
};

const styles = {
  container: {},
};

export default connect(Post);
