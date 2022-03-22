import { useState, useEffect } from "react";
import { connect } from "frontity";

import { colors } from "../config/imports";
import Loading from "../components/loading";
import DownloadFileBlock from "../components/downloadFileBlock";

import ScrollTop from "../components/scrollTop";
import BlockBuilder from "../components/builder/blockBuilder";
// BLOCK WIDTH WRAPPER -------------------------------------------------------
import BlockWrapper from "../components/blockWrapper";
// CONTEXT ----------------------------------------------------------------
import {
  useAppDispatch,
  useAppState,
  setGoToAction,
  muiQuery,
} from "../context";

const AppSearch = ({ state, actions, libraries }) => {
  const { sm, md, lg, xl } = muiQuery();

  const dispatch = useAppDispatch();
  const { appSearchData } = useAppState();

  const Html2React = libraries.html2react.Component; // Get the component exposed by html2react.
  const data = state.source.get(state.router.link);
  const page = state.source[data.type][data.id];
  const wpBlocks = page.acf.blocks;
  console.log("page", page); // debug

  const marginHorizontal = state.theme.marginHorizontal;
  const marginVertical = state.theme.marginVertical;
  const [position, setPosition] = useState(null);

  useEffect(() => {
    // ⬇️ on component load defaults to window position TOP
    window.scrollTo({ top: 0, behavior: "smooth" }); // force scrolling to top of page
    document.documentElement.scrollTop = 0; // for safari
    setPosition(true);
  }, []);

  if (!page || !position) return <Loading />;

  // SERVERS ---------------------------------------------
  const ServeTitle = () => {
    if (!page.title) return null;

    return (
      <div className="flex">
        <div
          className="primary-title"
          style={{
            fontSize: !lg ? 36 : 25,
            padding: `0.5em 1em`,
            backgroundColor: colors.white,
            borderBottom: `5px solid ${colors.danger}`,
          }}
        >
          <Html2React html={page.title.rendered} />
        </div>
      </div>
    );
  };

  const ServeSearchList = () => {
    if (!appSearchData) return null;

    return (
      <div
        className="text-body"
        style={{
          backgroundColor: colors.white,
          padding: `2em 0`,
        }}
      >
        {appSearchData.map((item, index) => {
          console.log(item); // debug

          return (
            <div
              key={index}
              style={{
                marginBottom: `${marginVertical}px`,
              }}
            ></div>
          );
        })}

        {/* <Html2React html={page.content.rendered} /> */}
        {/* {bodyLength > 2500 && <ScrollTop />} */}
      </div>
    );
  };

  return (
    <div className="flex-col">
      <BlockWrapper>
        <div
          className="text-body"
          style={{
            margin: `${marginVertical}px ${marginHorizontal}px`,
          }}
        >
          <ServeTitle />
          <ServeSearchList />
        </div>
      </BlockWrapper>

      <BlockBuilder blocks={wpBlocks} />
    </div>
  );
};

const styles = {
  container: {},
};

export default connect(AppSearch);
