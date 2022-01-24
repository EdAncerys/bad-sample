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

  const [dermGroupe, setDermGroupe] = useState(null);
  const [groupeType, setGroupeType] = useState(null);

  const [searchFilter, setSearchFilter] = useState(null);
  const [typeFilter, setTypeFilter] = useState(null);

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
    setDermGroupe(GROUPE_DATA.slice(0, Number(limit))); // apply limit on posts
    setGroupeType(GROUPE_TYPE);

    return () => {
      searchFilterRef.current = false; // clean up function
    };
  }, []);
  // DATA pre FETCH ----------------------------------------------------------------
  if (!dermGroupe || !groupeType) return <Loading />;

  // HELPERS ----------------------------------------------------------------
  const handleClearFilter = ({ clearInput, clearType }) => {
    if (clearInput) searchFilterRef.current.value = "";
    if (clearType) typeFilterRef.current.value = "";

    handleSearch();
  };

  const handleLoadMoreFilter = () => {
    const limit = 8;
    let GROUPE_DATA = Object.values(state.source.derm_groups_charity); // add dermGroupe object to data array
    if (loadMoreRef.current) GROUPE_DATA = GROUPE_DATA.slice(0, Number(limit)); // apply limit on posts

    setDermGroupe(GROUPE_DATA);
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

    const ServeTypeFilters = () => {
      if (!groupeType || type_filter !== "All Levels") return null;

      const ServeTitle = () => {
        return (
          <div
            className="flex primary-title"
            style={{
              fontSize: 30,
              alignItems: "center",
            }}
          >
            Search Group
          </div>
        );
      };

      return (
        <div>
          <ServeTitle />
          <div className="flex-row" style={{ flexWrap: "wrap" }}>
            <div
              className="shadow filter-action"
              onClick={() => setTypeFilter(null)}
              style={{
                backgroundColor: !typeFilter ? colors.primary : colors.white,
                color: !typeFilter ? colors.white : colors.softBlack,
              }}
            >
              <Html2React html={"All Groups"} />
            </div>

            {groupeType.map((type, key) => {
              const idMatching = typeFilter === type.id;

              return (
                <div
                  key={key}
                  className="shadow filter-action"
                  onClick={() => setTypeFilter(type.id)}
                  style={{
                    backgroundColor: idMatching ? colors.primary : colors.white,
                    color: idMatching ? colors.white : colors.softBlack,
                  }}
                >
                  <Html2React html={type.name} />
                </div>
              );
            })}
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
          <SearchContainer
            title="Search for Dermatology Groupe & Charities"
            width="70%"
            searchFilterRef={searchFilterRef}
            handleSearch={handleSearch}
          />
          <div className="flex" style={{ margin: "0.5em 0" }}>
            <ServeSearchFilter />
          </div>
          <ServeTypeFilters />
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
        {dermGroupe.map((block, key) => {
          const { title, content, link, date, dermo_group_type } = block;

          console.log(block);

          if (typeFilter) {
            if (!Object.values(dermo_group_type).includes(typeFilter)) return;
          }

          if (searchFilter) {
            if (
              !title.rendered
                .toLowerCase()
                .includes(searchFilter.toLowerCase()) &&
              !content.rendered
                .toLowerCase()
                .includes(searchFilter.toLowerCase())
            )
              return;
          }

          if (type_filter !== "All Levels") {
            if (!Object.values(dermo_group_type).includes(Number(type_filter)))
              return;
          }

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
