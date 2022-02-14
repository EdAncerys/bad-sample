import { useState, useEffect, useRef } from "react";
import { connect } from "frontity";
import parse from "html-react-parser";

import TitleBlock from "./titleBlock";
import Card from "./card/card";
import Loading from "./loading";
import { colors } from "../config/imports";
import BlockWrapper from "./blockWrapper";
import SearchContainer from "./searchContainer";
import TypeFilters from "./typeFilters";

import CloseIcon from "@mui/icons-material/Close";

const CPTBlock = ({ state, actions, libraries, block }) => {
  const Html2React = libraries.html2react.Component; // Get the component exposed by html2react.

  if (!block) return <Loading />;

  const {
    colour,
    background_colour,
    post_limit,
    disable_vertical_padding,
    add_search_function,
    acf_fc_layout,
  } = block;

  const [postListData, setPostListData] = useState(null);
  const [groupeType, setGroupeType] = useState(null);
  const [guidanceCategory, setGuidanceCategory] = useState(null);

  const [searchFilter, setSearchFilter] = useState(null);

  const searchFilterRef = useRef(null);
  const currentSearchFilterRef = useRef(null);
  const typeFilterRef = useRef(null);
  const loadMoreRef = useRef(null);
  const guidanceCategoryRef = useRef("");

  const LIMIT = 8;

  const marginHorizontal = state.theme.marginHorizontal;
  let marginVertical = state.theme.marginVertical;
  if (disable_vertical_padding) marginVertical = 0;

  const isCovid_19 = acf_fc_layout === "covid_loop_block";
  let postPath = `derm_groups_charity`;
  let typePath = `dermo_group_type`;
  if (isCovid_19) {
    postPath = `covid_19`;
    typePath = `guidance`;
  }

  let PADDING = `${marginVertical}px 0`;
  if (add_search_function) PADDING = `0 0 ${marginVertical}px 0`;

  // DATA pre FETCH ----------------------------------------------------------------
  useEffect(async () => {
    const path = `/${postPath}/`;
    await actions.source.fetch(path); // fetch CPT dermGroupeData

    console.log("useEffect fires up");
    console.log(typeFilterRef.current);

    let dermGroupeData = state.source.get(path);
    const { totalPages, page, next } = dermGroupeData; // check if dermGroupeData have multiple pages
    // fetch dermGroupeData via wp API page by page
    let isThereNextPage = next;
    while (isThereNextPage) {
      await actions.source.fetch(isThereNextPage); // fetch next page
      const nextPage = state.source.get(isThereNextPage).next; // check ifNext page & set next page
      isThereNextPage = nextPage;
    }
    const GROUPE_DATA = Object.values(state.source[postPath]);
    const GROUPE_TYPE = Object.values(state.source[typePath]);
    if (isCovid_19)
      setGuidanceCategory(Object.values(state.source.guidance_category)); // set additional filter option to COVID-19

    const limit = post_limit || LIMIT;
    setPostListData(GROUPE_DATA.slice(0, Number(limit))); // apply limit on posts
    setGroupeType(GROUPE_TYPE);

    return () => {
      searchFilterRef.current = false; // clean up function
    };
  }, []);
  // DATA pre FETCH ---------------------------------------------------------
  if (!postListData || !groupeType) return <Loading />;

  // HELPERS ----------------------------------------------------------------
  const handleLoadMoreFilter = async () => {
    if (postListData.length < LIMIT) return;
    let data = Object.values(state.source[postPath]);

    if (!loadMoreRef.current) {
      // if (!!currentSearchFilterRef.current || !!typeFilterRef.current)
      //   data = postListData;

      loadMoreRef.current = data;
      setPostListData(data);
    } else {
      setPostListData(loadMoreRef.current.slice(0, Number(LIMIT)));
      loadMoreRef.current = null;
    }
  };

  const handleSearch = () => {
    const input = searchFilterRef.current.value.toLowerCase() || searchFilter;
    currentSearchFilterRef.current = input;
    let data = Object.values(state.source[postPath]);

    console.log(data);

    if (typeFilterRef.current) {
      data = data.filter((item) =>
        item[typePath].includes(typeFilterRef.current)
      );
    }

    if (!!input) {
      data = data.filter((item) => {
        let title = item.title.rendered;
        let content = item.content.rendered;

        if (title) title = title.toLowerCase().includes(input.toLowerCase());
        if (content)
          content = content.toLowerCase().includes(input.toLowerCase());

        return title || content;
      });
    }

    setPostListData(data);
    setSearchFilter(input);
  };

  const handleTypeSearch = () => {
    const input = typeFilterRef.current;
    let data = Object.values(state.source[postPath]); // add postListData object to data array

    if (currentSearchFilterRef.current)
      data = data.filter((item) => {
        let title = item.title.rendered;
        let content = item.content.rendered;
        if (title)
          title = title.toLowerCase().includes(currentSearchFilterRef.current);
        if (content)
          content = content
            .toLowerCase()
            .includes(currentSearchFilterRef.current);

        return title || content;
      });

    if (input) {
      data = data.filter((item) => {
        const list = item[typePath];
        if (list.includes(input)) return item;
      });

      setPostListData(data);
    }
  };

  const handleClearSearchFilter = () => {
    let data = Object.values(state.source[postPath]); // add postListData object to data array
    setSearchFilter(null);
    searchFilterRef.current = null;
    currentSearchFilterRef.current = null;

    if (!typeFilterRef.current) {
      setPostListData(data.slice(0, Number(post_limit || LIMIT)));
    } else {
      handleTypeSearch();
    }
  };

  const handleClearTypeFilter = () => {
    typeFilterRef.current = null;
    let data = Object.values(state.source[postPath]); // add postListData object to data array

    if (!currentSearchFilterRef.current) {
      setPostListData(data.slice(0, Number(post_limit || LIMIT)));
    } else {
      handleSearch();
    }
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

    const ServeGuidanceType = () => {
      if (!guidanceCategory) return null;

      return (
        <div>
          <select
            name="guidance"
            ref={guidanceCategoryRef}
            value={guidanceCategoryRef.current}
            onChange={handleSearch}
            className="input"
          >
            <option value="" hidden>
              Select Guidance Category
            </option>
            {guidanceCategory.map((item, key) => {
              console.log(guidanceCategory);

              return (
                <option key={key} value={item.id}>
                  {item.name}
                </option>
              );
            })}
          </select>
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
          <div style={{ padding: `0 ${marginHorizontal}px`, width: `70%` }}>
            <SearchContainer
              title={
                isCovid_19
                  ? "Search for COVID 19 Resources"
                  : "Search for Dermatology Groups & Charities"
              }
              searchFilterRef={searchFilterRef}
              handleSearch={handleSearch}
            />

            <div className="flex" style={{ margin: "0.5em 0" }}>
              <ServeSearchFilter />
            </div>
            <ServeGuidanceType />
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
    return (
      <div style={styles.container}>
        {postListData.map((block, key) => {
          const { title, content, link, date, dermo_group_type } = block;
          const redirect = block.acf.redirect_url;

          console.log(block);

          return (
            <Card
              key={key}
              title={title.rendered}
              publicationDate={date}
              body={isCovid_19 ? null : content.rendered}
              link_label="Read More"
              link={redirect ? redirect.url : link}
              colour={colour}
              limitBodyLength
              cardMinHeight={250}
              shadow
            />
          );
        })}
      </div>
    );
  };

  const ServeMoreAction = () => {
    if (currentSearchFilterRef.current || typeFilterRef.current) return null;
    if (post_limit || postListData.length < LIMIT) return null;

    const value = loadMoreRef.current ? "Less" : "Load More";

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

  // RETURN ---------------------------------------------------
  return (
    <div
      style={{
        padding: PADDING,
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

export default connect(CPTBlock);
