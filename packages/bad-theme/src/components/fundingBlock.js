import { useState, useEffect, useRef } from "react";
import { connect } from "frontity";

import TitleBlock from "./titleBlock";
import Card from "./card/card";
import Accordion from "./accordion/accordion";
import Loading from "./loading";
import { colors } from "../config/imports";
import BlockWrapper from "./blockWrapper";
import SearchContainer from "./searchContainer";
import TypeFilters from "./typeFilters";

import CloseIcon from "@mui/icons-material/Close";

const CPTBlock = ({ state, actions, libraries, block }) => {
  const Html2React = libraries.html2react.Component; // Get the component exposed by html2react.

  const {
    colour,
    background_colour,
    post_limit,
    disable_vertical_padding,
    add_search_function,
    layout,
    preview,
    funding_filter,
  } = block;
  const [postListData, setPostListData] = useState(null);
  const [groupeType, setGroupeType] = useState(null);

  const [searchFilter, setFilter] = useState(null);
  const [amountFilter, setAmount] = useState(null);
  const [dateFilter, setDate] = useState(null);

  const filterRef = useRef("");
  const typeFilterRef = useRef(null);
  const amountRef = useRef("");
  const dateRef = useRef("");

  const postLimit = Number(post_limit) || 10; // max limit
  const chunkRef = useRef(postLimit);

  if (!block) return <Loading />;

  const marginHorizontal = state.theme.marginHorizontal;
  let marginVertical = state.theme.marginVertical;
  if (disable_vertical_padding) marginVertical = 0;

  const isAccordion = layout === "accordion";
  let postPath = `funding_awards`;
  let typePath = `funding_type`;

  let PADDING = `${marginVertical}px 0`;
  if (add_search_function) PADDING = `0 0 ${marginVertical}px 0`;

  // DATA pre FETCH ----------------------------------------------------------------
  useEffect(async () => {
    const path = `/${postPath}/`;
    await actions.source.fetch(path); // fetch CPT dermGroupeData

    let dermGroupeData = state.source.get(path);
    const { totalPages, page, next } = dermGroupeData; // check if dermGroupeData have multiple pages
    // fetch dermGroupeData via wp API page by page
    let isThereNextPage = next;
    while (isThereNextPage) {
      await actions.source.fetch(isThereNextPage); // fetch next page
      const nextPage = state.source.get(isThereNextPage).next; // check ifNext page & set next page
      isThereNextPage = nextPage;
    }
    let resultData = Object.values(state.source[postPath]);
    const GROUPE_TYPE = Object.values(state.source[typePath]);

    if (funding_filter !== "All Levels") {
      resultData = resultData.filter((item) =>
        item.funding_type.includes(Number(funding_filter))
      );
    }

    if (post_limit) resultData = resultData.slice(0, Number(post_limit)); // apply limit on posts
    console.log("🐞 ", resultData);

    setPostListData(resultData);
    setGroupeType(GROUPE_TYPE);

    return () => {
      filterRef.current = false; // clean up function
    };
  }, []);

  // DATA pre FETCH ---------------------------------------------------------
  if (!postListData || !groupeType) return <Loading />;

  // HELPERS ----------------------------------------------------------------
  const handleLoadMoreFilter = async () => {
    let data = Object.values(state.source[postPath]);

    // increment chunk by postLimit
    chunkRef.current = chunkRef.current + postLimit;
    setPostListData(data.slice(0, chunkRef.current));
  };

  const handleSearch = () => {
    const input = filterRef.current.value;
    const type = typeFilterRef.current;
    console.log("🐞 ", input, type);

    let data = Object.values(state.source[postPath]);

    if (type) {
      data = data.filter((item) => item[typePath].includes(type));
    }

    if (input) {
      data = data.filter((item) => {
        let title = item.title.rendered;
        let content = item.acf.overview;

        if (title) title = title.toLowerCase().includes(input.toLowerCase());
        if (content)
          content = content.toLowerCase().includes(input.toLowerCase());

        return title || content;
      });
    }

    if (post_limit) data = data.slice(0, Number(chunkRef.current)); // apply limit on posts

    setPostListData(data);
    setFilter(input);
  };

  const handleTypeSearch = ({ id }) => {
    typeFilterRef.current = id;
    handleSearch();
  };

  const handleClearTypeFilter = () => {
    typeFilterRef.current = null;
    handleSearch();
  };

  const handleClearSearchFilter = () => {
    setFilter(null);
    filterRef.current.value = "";

    handleSearch();
  };

  // SERVERS ----------------------------------------------------------------
  const ServeFilter = () => {
    if (!add_search_function) return null;

    const ServeSearchFilter = () => {
      if (!searchFilter) return null;

      return (
        <div className="shadow filter">
          <div>{searchFilter}</div>
          <div className="filter-icon" onClick={handleClearSearchFilter}>
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
          <div style={{ padding: `0 ${marginHorizontal}px` }}>
            <SearchContainer
              title={isAccordion ? "Undergraduate Awards" : "Research Funding"}
              width="70%"
              searchFilterRef={filterRef}
              handleSearch={handleSearch}
            />
            <div className="flex" style={{ margin: "0.5em 0" }}>
              <ServeSearchFilter />
            </div>
            <TypeFilters
              filters={groupeType}
              handleSearch={handleTypeSearch}
              typeFilterRef={typeFilterRef}
              handleClearTypeFilter={handleClearTypeFilter}
              title="Filter"
            />
          </div>
        </BlockWrapper>
      </div>
    );
  };

  const ServeLayout = () => {
    if (isAccordion)
      return (
        <div>
          <Accordion
            block={{
              accordion_item: postListData,
            }}
            fundingBlock
            hasPreview={preview}
          />
        </div>
      );

    return (
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(3, 1fr)`,
          justifyContent: "space-between",
          gap: 20,
          padding: `0 ${marginHorizontal}px`,
        }}
      >
        {postListData.map((block, key) => {
          const { title, content, link, date, dermo_group_type } = block.acf;

          return (
            <Card
              key={key}
              fundingHeader={block}
              publicationDate={date}
              body={block.acf.overview}
              bodyLimit={4}
              link_label="Read More"
              link={block.acf.external_application_link}
              colour={colour}
              shadow
            />
          );
        })}
      </div>
    );
  };

  const ServeMoreAction = () => {
    if (!post_limit || postListData.length < chunkRef.current) return null;

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
          Load More
        </button>
      </div>
    );
  };

  // RETURN ---------------------------------------------------
  return (
    <div
      style={{
        padding: PADDING,
        backgroundColor: background_colour,
      }}
    >
      <BlockWrapper>
        <TitleBlock
          block={block}
          margin={{
            marginBottom: `${
              add_search_function ? 0 : state.theme.marginVertical
            }px`,
          }}
        />
      </BlockWrapper>
      <ServeFilter />
      <BlockWrapper>
        <ServeLayout />
        <ServeMoreAction />
      </BlockWrapper>
    </div>
  );
};

const styles = {
  container: {},
};

export default connect(CPTBlock);
