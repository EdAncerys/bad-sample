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
import { useAppDispatch, useAppState, getRSSFeedAction } from "../context";

const RssFeed = ({ state, actions, libraries, block }) => {
  const Html2React = libraries.html2react.Component; // Get the component exposed by html2react.

  const dispatch = useAppDispatch();
  const { rssFeed, isFetching } = useAppState();

  const [feedData, setFeedData] = useState(null);

  if (!block) return <Loading />;

  const {
    colour,
    background_colour,
    post_limit,
    disable_vertical_padding,
    add_search_function,
  } = block;

  const [searchFilter, setSearchFilter] = useState(null);

  const searchFilterRef = useRef(null);
  const loadMoreRef = useRef(null);

  const marginHorizontal = state.theme.marginHorizontal;
  let marginVertical = state.theme.marginVertical;
  if (disable_vertical_padding) marginVertical = 0;

  // DATA pre FETCH ----------------------------------------------------------------
  useEffect(async () => {
    const limit = post_limit || 8;
    const result = await getRSSFeedAction({ state, dispatch });
    setFeedData(result.slice(0, Number(limit))); // apply limit on posts

    return () => {
      searchFilterRef.current = false; // clean up function
    };
  }, []);
  // DATA pre FETCH ----------------------------------------------------------------
  if (!feedData) return <Loading />;

  // HELPERS ----------------------------------------------------------------
  const handleClearFilter = ({ clearInput }) => {
    if (clearInput) searchFilterRef.current.value = "";

    handleSearch();
  };

  const handleLoadMoreFilter = () => {
    const limit = 8;
    let POST_LIST = rssFeed; // add dermGroupe object to data array
    if (loadMoreRef.current) POST_LIST = rssFeed.slice(0, Number(limit)); // apply limit on posts

    setFeedData(POST_LIST);
    loadMoreRef.current = !loadMoreRef.current;
  };

  const handleSearch = () => {
    const searchInput = searchFilterRef.current.value;
    setSearchFilter(searchInput);
  };

  // SERVERS ---------------------------------------------
  const ServeFilter = () => {
    if (!add_search_function) return null;

    const ServeSearchFilter = () => {
      if (!searchFilter) return null;

      return (
        <div className="shadow filter">
          <div>{searchFilter}</div>
          <div
            className="filter-icon"
            onClick={() => handleClearFilter({ clearInput: true })}
          >
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
              title="Search for British Journal of Dermatology Articles"
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
    if (post_limit) return null;
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

export default connect(RssFeed);
