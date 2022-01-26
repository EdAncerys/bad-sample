import { useState, useEffect, useRef } from "react";
import { connect } from "frontity";
import parse from "html-react-parser";

import TitleBlock from "./titleBlock";
import Card from "./card/card";
import Loading from "./loading";
import { colors } from "../config/imports";
import BlockWrapper from "./blockWrapper";
import SearchContainer from "./searchContainer";
import TypeFilter from "./typeFilter";

import CloseIcon from "@mui/icons-material/Close";

const DermatologyGroup = ({ state, actions, libraries, block }) => {
  const Html2React = libraries.html2react.Component; // Get the component exposed by html2react.

  if (!block) return <Loading />;

  const {
    colour,
    background_colour,
    post_limit,
    disable_vertical_padding,
    add_search_function,
    type_filter,
  } = block;

  const [dermGroup, setDermGroup] = useState(null);
  const [groupeType, setGroupeType] = useState(null);

  const [searchFilter, setSearchFilter] = useState(null);

  const searchFilterRef = useRef(null);
  const typeFilterRef = useRef(null);
  const loadMoreRef = useRef(null);

  const marginHorizontal = state.theme.marginHorizontal;
  let marginVertical = state.theme.marginVertical;
  if (disable_vertical_padding) marginVertical = 0;

  // DATA pre FETCH ----------------------------------------------------------------
  useEffect(async () => {
    const path = `/derm_groups_charity/`;
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

    const GROUPE_DATA = Object.values(state.source.derm_groups_charity);
    const GROUPE_TYPE = Object.values(state.source.dermo_group_type);

    const limit = post_limit || 8;
    setDermGroup(GROUPE_DATA.slice(0, Number(limit))); // apply limit on posts
    setGroupeType(GROUPE_TYPE);

    return () => {
      searchFilterRef.current = false; // clean up function
    };
  }, []);
  // DATA pre FETCH ---------------------------------------------------------
  if (!dermGroup || !groupeType) return <Loading />;

  // HELPERS ----------------------------------------------------------------
  const handleClearFilter = ({ clearInput, clearType }) => {
    if (clearInput) searchFilterRef.current.value = "";
    if (clearType) typeFilterRef.current = null;

    handleSearch();
  };

  const handleLoadMoreFilter = () => {
    if (dermGroup.length < 8) return;
    let GROUPE_DATA = dermGroup;
    if (!searchFilterRef.current.value && !typeFilterRef.current)
      GROUPE_DATA = Object.values(state.source.derm_groups_charity);

    console.log(searchFilterRef.current.value);
    console.log(typeFilterRef.current);
    console.log(GROUPE_DATA.length);
    if (loadMoreRef.current) {
      setDermGroup(GROUPE_DATA);
      return;
    }

    handleSearch();
    loadMoreRef.current = !loadMoreRef.current;
  };

  const handleSearch = () => {
    const searchInput = searchFilterRef.current.value;
    const typeInput = typeFilterRef.current;
    let data = Object.values(state.source.derm_groups_charity); // add dermGroup object to data array

    if (typeInput) {
      data = data.filter((item) => {
        let GROPE = Object.values(item.dermo_group_type);
        if (GROPE) GROPE = GROPE.includes(typeInput);

        return GROPE;
      });
    }

    if (searchInput) {
      data = data.filter((item) => {
        let TITLE = item.title.rendered;
        let CONTENT = item.content.rendered;
        if (TITLE)
          TITLE = TITLE.toLowerCase().includes(searchInput.toLowerCase());
        if (CONTENT)
          CONTENT = CONTENT.toLowerCase().includes(searchInput.toLowerCase());

        return TITLE || CONTENT;
      });
    }

    setDermGroup(data);
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
              title="Search for Dermatology Groupe & Charities"
              width="70%"
              searchFilterRef={searchFilterRef}
              handleSearch={handleSearch}
            />
            <div className="flex" style={{ margin: "0.5em 0" }}>
              <ServeSearchFilter />
            </div>
            <TypeFilter
              filters={groupeType}
              handleSearch={handleSearch}
              typeFilterRef={typeFilterRef}
              title="Search Groupe"
            />
          </div>
        </BlockWrapper>
      </div>
    );
  };

  const ServeMoreAction = () => {
    if (post_limit || dermGroup.length < 8) return null;
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
        {dermGroup.map((block, key) => {
          const { title, content, link, date, dermo_group_type } = block;

          return (
            <Card
              key={key}
              title={title.rendered}
              publicationDate={date}
              body={content.rendered}
              link_label="Read More"
              link={link}
              colour={colour}
              limitBodyLength
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

export default connect(DermatologyGroup);
