import React from "react";
import { connect } from "frontity";

import { colors } from "../config/colors";
import Loading from "../components/loading";
import DownloadFileBlock from "../components/downloadFileBlock";

const Post = ({ state, actions, libraries }) => {
  const Html2React = libraries.html2react.Component; // Get the component exposed by html2react.
  const data = state.source.get(state.router.link);
  const pil = state.source[data.type][data.id];

  const marginHorizontal = state.theme.marginHorizontal;
  const marginVertical = state.theme.marginVertical;

  if (!pil) return <Loading />;

  // SERVERS ---------------------------------------------
  const ServeTitle = () => {
    if (!pil.title) return null;

    return (
      <div className="flex">
        <div
          style={{
            fontSize: 36,
            fontWeight: "bold",
            padding: `0.5em 1em`,
            color: colors.black,
            backgroundColor: colors.white,
            borderBottom: `5px solid ${colors.danger}`,
          }}
        >
          <Html2React html={pil.title.rendered} />
        </div>
      </div>
    );
  };

  const ServeBody = () => {
    if (!pil.content) return null;

    return (
      <div
        style={{
          backgroundColor: colors.white,
          padding: `2em 1em`,
          margin: `2em 0`,
        }}
      >
        <Html2React html={pil.content.rendered} />
      </div>
    );
  };

  const ServeDownload = () => {
    if (!pil.acf) return null;

    return (
      <div style={{ margin: `4em 0` }}>
        <DownloadFileBlock block={pil.acf} disableMargin />
      </div>
    );
  };

  return (
    <div
      style={{
        margin: `${marginVertical}px ${marginHorizontal}px`,
      }}
    >
      <ServeTitle />
      <ServeDownload />
      <ServeBody />
    </div>
  );
};

const styles = {
  container: {},
};

export default connect(Post);
