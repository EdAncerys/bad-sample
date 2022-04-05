import { useState, useEffect, useRef } from "react";
import { connect } from "frontity";

import TitleBlock from "./titleBlock";
import Card from "./card/card";
import Loading from "./loading";
import { colors } from "../config/imports";
import BlockWrapper from "./blockWrapper";
import SearchContainer from "./searchContainer";

import CloseIcon from "@mui/icons-material/Close";

// CONTEXT ----------------------------------------------------------------
import {
  useAppDispatch,
  useAppState,
  getBJDFeedAction,
  getCEDFeedAction,
  getSHDFeedAction,
  muiQuery,
} from "../context";

const RSSFeed = ({ state, actions, libraries, block }) => {
  const { sm, md, lg, xl } = muiQuery();

  const Html2React = libraries.html2react.Component; // Get the component exposed by html2react.

  const dispatch = useAppDispatch();
  const { bjdFeed, cedFeed, shdFeed, refreshJWT } = useAppState();

  const incrementor = 12;

  const [feedData, setFeedData] = useState(null);
  const [searchFilter, setSearchFilter] = useState(null);
  const searchFilterRef = useRef(null);
  const chunkRef = useRef(incrementor);

  if (!block) return <Loading />;

  const {
    acf_fc_layout,
    colour,
    background_colour,
    post_limit,
    disable_vertical_padding,
    add_search_function,
  } = block;

  const marginHorizontal = state.theme.marginHorizontal;
  let marginVertical = state.theme.marginVertical;
  if (disable_vertical_padding) marginVertical = 0;

  const isBJD = acf_fc_layout === "bjd_feed";
  const isCED = acf_fc_layout === "ced_feed";
  const isSHD = acf_fc_layout === "shd_feed";

  let feedTitle =
    "Search for recently published British Journal of Dermatology Articles";
  if (isCED)
    feedTitle =
      "Search for recently published Clinical and Experimental Dermatology Articles";
  if (isSHD)
    feedTitle =
      "Search for recently published Skin Health and Disease Articles";

  // DATA pre FETCH ----------------------------------------------------------------
  useEffect(async () => {
    const postLimit = post_limit || incrementor;
    let data = null;

    if (isBJD) data = await getBJDFeedAction({ state, dispatch, refreshJWT });
    if (isCED) data = await getCEDFeedAction({ state, dispatch, refreshJWT });
    if (isSHD) data = await getSHDFeedAction({ state, dispatch, refreshJWT });

    setFeedData(data.slice(0, Number(postLimit))); // apply limit on posts

    return () => {
      searchFilterRef.current = false; // clean up function
    };
  }, []);

  if (!feedData) return <Loading />;

  // HELPERS ----------------------------------------------------------------
  const handleClearFilter = () => {
    setSearchFilter(null);
    searchFilterRef.current.value = "";

    let data = null;

    if (isBJD) data = bjdFeed;
    if (isCED) data = cedFeed;
    if (isSHD) data = shdFeed;

    setFeedData(data.slice(0, Number(chunkRef.current)));
  };

  const handleLoadMoreFilter = () => {
    let data = null;

    if (isBJD) data = bjdFeed;
    if (isCED) data = cedFeed;
    if (isSHD) data = shdFeed;

    // increment page number
    chunkRef.current = chunkRef.current + incrementor;
    setFeedData(data.slice(0, Number(chunkRef.current)));
  };

  const handleSearch = () => {
    const input = searchFilterRef.current.value;
    // filter feedData that includes input
    const filteredData = feedData.filter((item) => {
      const title = item.title.toLowerCase();
      const description = item.description.toLowerCase();

      return (
        title.includes(input.toLowerCase()) ||
        description.includes(input.toLowerCase())
      );
    });

    setFeedData(filteredData);
    setSearchFilter(input);
  };

  // SERVERS ---------------------------------------------
  const ServeFilter = () => {
    if (!add_search_function) return null;

    const ServeSearchFilter = () => {
      if (!searchFilter) return null;

      return (
        <div className="shadow filter">
          <div>{searchFilter}</div>
          <div className="filter-icon" onClick={handleClearFilter}>
            <CloseIcon
              style={{
                fill: colors.darkSilver,
                padding: 0,
              }}
            />
          </div>
        </div>
      );
    };

    return (
      <div
        style={{
          backgroundColor: colors.silverFillTwo,
          marginBottom: `${state.theme.marginVertical}px`,
          padding: `2em 0`,
        }}
        className="no-selector"
      >
        <BlockWrapper>
          <div
            style={{ padding: `0 ${marginHorizontal}px` }}
            className="no-selector"
          >
            <SearchContainer
              title={feedTitle}
              width="70%"
              searchFilterRef={searchFilterRef}
              handleSearch={handleSearch}
            />
            <div className="flex" style={{ margin: "0.5em 0" }}>
              <ServeSearchFilter />
            </div>
          </div>
        </BlockWrapper>
      </div>
    );
  };

  const ServeMoreAction = () => {
    // if (post_limit || feedData.length < chunkRef) return null;
    let label = "Load More";
    let data = null;

    if (isBJD) data = bjdFeed;
    if (isCED) data = cedFeed;
    if (isSHD) data = shdFeed;

    // return null if data is less than chunkRef
    if (data.length < chunkRef.current) return null;

    return (
      <div
        className="flex"
        style={{
          justifyContent: "center",
          paddingTop: `2em`,
        }}
      >
        <button
          type="submit"
          className="transparent-btn"
          onClick={handleLoadMoreFilter}
        >
          {label}
        </button>
      </div>
    );
  };

  const ServeLayout = () => {
    return (
      <div style={!lg ? styles.container : styles.containerMobile}>
        {feedData.map((block, key) => {
          const { title, category, link, pubDate } = block;
          const doi = block["prism:doi"];

          return (
            <Card
              key={key}
              title={title}
              publicationDate={pubDate}
              link_label="Read More"
              rssFeedLink={{ link, doi }}
              colour={colour}
              titleLimit={6}
              cardMinHeight={280}
              animationType="none" // remove animation
              shadow
            />
          );
        })}
      </div>
    );
  };

  // RETURN ---------------------------------------------------
  return (
    <div
      style={{
        padding: `${marginVertical}px 0`,
        backgroundColor: background_colour,
      }}
    >
      <BlockWrapper>
        <div style={{ padding: `0 ${marginHorizontal}px` }}>
          <TitleBlock
            block={block}
            margin={{
              marginBottom: `${
                add_search_function ? 0 : state.theme.marginVertical
              }px`,
            }}
          />
        </div>
      </BlockWrapper>
      <ServeFilter />
      <BlockWrapper>
        <div style={{ padding: `0 ${marginHorizontal}px` }}>
          <ServeLayout />
          <ServeMoreAction />
        </div>
      </BlockWrapper>
    </div>
  );
};

const styles = {
  container: {
    display: "grid",
    gridTemplateColumns: `repeat(4, 1fr)`,
    justifyContent: "space-between",
    gap: 20,
  },
  containerMobile: {
    display: "grid",
    gridTemplateColumns: `repeat(1, 1fr)`,
    justifyContent: "space-between",
    gap: 0,
  },
  input: {
    borderRadius: 10,
    paddingRight: 35,
  },
};

export default connect(RSSFeed);
