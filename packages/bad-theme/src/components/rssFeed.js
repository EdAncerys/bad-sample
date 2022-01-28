import { useState, useEffect, useRef } from "react";
import { connect } from "frontity";
import parse from "html-react-parser";

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
} from "../context";

const RSSFeed = ({ state, actions, libraries, block }) => {
  const Html2React = libraries.html2react.Component; // Get the component exposed by html2react.

  const dispatch = useAppDispatch();
  const { bjdFeed, cedFeed, shdFeed, isFetching } = useAppState();

  const [feedData, setFeedData] = useState(null);

  if (!block) return <Loading />;

  const {
    acf_fc_layout,
    colour,
    background_colour,
    post_limit,
    disable_vertical_padding,
    add_search_function,
  } = block;

  const [searchFilter, setSearchFilter] = useState(null);

  const searchFilterRef = useRef(null);
  const currentSearchFilterRef = useRef(null);
  const loadMoreRef = useRef(null);

  const LIMIT = LIMIT;

  const marginHorizontal = state.theme.marginHorizontal;
  let marginVertical = state.theme.marginVertical;
  if (disable_vertical_padding) marginVertical = 0;

  const isBJD = acf_fc_layout === "bjd_feed";
  const isCED = acf_fc_layout === "ced_feed";
  const isSHD = acf_fc_layout === "shd_feed";

  let feedTitle = "Search for British Journal of Dermatology Articles";
  if (isCED)
    feedTitle = "Search for Clinical and Experimental Dermatology Articles";
  if (isSHD) feedTitle = "Search for Skin Health and Disease Articles";

  // DATA pre FETCH ----------------------------------------------------------------
  useEffect(async () => {
    const limit = post_limit || LIMIT;
    let result = null;

    if (isBJD) result = await getBJDFeedAction({ state, dispatch });
    if (isCED) result = await getCEDFeedAction({ state, dispatch });
    if (isSHD) result = await getSHDFeedAction({ state, dispatch });

    setFeedData(result.slice(0, Number(limit))); // apply limit on posts

    return () => {
      searchFilterRef.current = false; // clean up function
    };
  }, []);
  // DATA pre FETCH ----------------------------------------------------------------
  if (!feedData) return <Loading />;

  // HELPERS ----------------------------------------------------------------
  const handleClearFilter = () => {
    setSearchFilter(null);
    searchFilterRef.current.value = "";
    currentSearchFilterRef.current = null;
    loadMoreRef.current = null;

    let data = null;

    if (isBJD) data = bjdFeed;
    if (isCED) data = cedFeed;
    if (isSHD) data = shdFeed;

    setFeedData(data.slice(0, Number(LIMIT)));
  };

  const handleLoadMoreFilter = () => {
    if (feedData.length < LIMIT) return;
    let data = null;

    if (isBJD) data = bjdFeed;
    if (isCED) data = cedFeed;
    if (isSHD) data = shdFeed;

    if (!loadMoreRef.current) {
      loadMoreRef.current = data;
      setFeedData(data);
    } else {
      setFeedData(loadMoreRef.current.slice(0, Number(LIMIT)));
      loadMoreRef.current = null;
    }
  };

  const handleSearch = () => {
    const input = searchFilterRef.current.value;
    currentSearchFilterRef.current = input;
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
      >
        <BlockWrapper>
          <div style={{ padding: `0 ${marginHorizontal}px` }}>
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
    if (post_limit || feedData.length < LIMIT || currentSearchFilterRef.current)
      return null;
    const value = loadMoreRef.current ? "Less" : " Load More";

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
          {value}
        </button>
      </div>
    );
  };

  const ServeLayout = () => {
    return (
      <div style={styles.container}>
        {feedData.map((block, key) => {
          const { title, category, link, pubDate } = block;

          if (searchFilter) {
            if (
              !title.toLowerCase().includes(searchFilter.toLowerCase()) &&
              !category.toLowerCase().includes(searchFilter.toLowerCase())
            )
              return;
          }

          return (
            <Card
              key={key}
              title={title}
              publicationDate={pubDate}
              link_label="Read More"
              link={link}
              colour={colour}
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
  input: {
    borderRadius: 10,
    paddingRight: 35,
  },
};

export default connect(RSSFeed);
