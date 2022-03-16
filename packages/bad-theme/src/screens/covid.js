import { useState, useEffect } from "react";
import { connect } from "frontity";

import { colors } from "../config/imports";
import TitleBlock from "../components/titleBlock";
import Loading from "../components/loading";
import { setGoToAction } from "../context";
// BLOCK WIDTH WRAPPER -------------------------------------------------------
import BlockWrapper from "../components/blockWrapper";

const DermGroupsCharity = ({ state, actions, libraries }) => {
  const Html2React = libraries.html2react.Component; // Get the component exposed by html2react.

  const data = state.source.get(state.router.link);
  const dermGroupe = state.source[data.type][data.id];

  const marginHorizontal = state.theme.marginHorizontal;
  const marginVertical = state.theme.marginVertical;

  const { content, title, acf } = dermGroupe;
  const [position, setPosition] = useState(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" }); // force scrolling to top of page
    document.documentElement.scrollTop = 0; // for safari
    setPosition(true);
  }, []);

  if (!position) return <Loading />;

  // SERVERS ---------------------------------------------------
  const ServeContent = () => {
    return (
      <div>
        <TitleBlock
          block={{ title: title.rendered }}
          margin={`0 0 ${marginVertical}px 0`}
        />
        <Html2React html={content.rendered} />
      </div>
    );
  };

  // RETURN ---------------------------------------------------
  return (
    <BlockWrapper>
      <div
        className="text-body"
        style={{ padding: `${marginVertical}px ${marginHorizontal}px` }}
      >
        <ServeContent />
      </div>
    </BlockWrapper>
  );
};

const styles = {
  container: {},
};

export default connect(DermGroupsCharity);
