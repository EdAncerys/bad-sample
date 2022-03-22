import { useState, useEffect, useRef } from "react";
import { connect } from "frontity";

import { colors } from "../config/imports";
import Loading from "../components/loading";
import SearchContainer from "../components/searchContainer";
import TypeFilters from "../components/typeFilters";
import CloseIcon from "@mui/icons-material/Close";
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
  const { appSearchData, appSearchPhrase } = useAppState();

  const Html2React = libraries.html2react.Component; // Get the component exposed by html2react.
  const data = state.source.get(state.router.link);
  const page = state.source[data.type][data.id];
  const wpBlocks = page.acf.blocks;
  console.log("appSearchData", appSearchData); // debug

  const marginHorizontal = state.theme.marginHorizontal;
  const marginVertical = state.theme.marginVertical;
  const [position, setPosition] = useState(null);

  const [searchFilter, setSearchFilter] = useState(null);
  const [typeFilter, setTypeFilter] = useState(null);
  const typeFilterRef = useRef(null);
  const searchFilterRef = useRef(null);

  useEffect(() => {
    // ⬇️ on component load defaults to window position TOP
    window.scrollTo({ top: 0, behavior: "smooth" }); // force scrolling to top of page
    document.documentElement.scrollTop = 0; // for safari
    setPosition(true);
  }, []);

  if (!page || !position) return <Loading />;

  // HELPERS ----------------------------------------------------------------
  const handleSearch = () => {
    // if (idFilter) setIDFilterAction({ dispatch, idFilter: null }); // reset ID for filter
    const input = searchFilterRef.current.value || searchFilter;
    currentSearchFilterRef.current = input;
    let guidelinesList = Object.values(state.source.guidelines_standards);

    if (typeFilterRef.current)
      guidelinesList = guidelinesList.filter((item) => {
        const list = item.guidelines_type;
        if (list.includes(typeFilterRef.current)) return item;
      });

    if (!!input) {
      const INPUT = input.toLowerCase();
      const filter = guidelinesList.filter((item) => {
        let title = item.title.rendered;
        let subtitle = item.acf.subtitle;
        if (title) title = title.toLowerCase().includes(INPUT);
        if (subtitle) subtitle = subtitle.toLowerCase().includes(INPUT);

        return title || subtitle;
      });

      setSearchFilter(input);
      setGuidelinesList(filter);
    }
  };

  const handleClearTypeFilter = () => {
    setTypeFilter(null);
    typeFilterRef.current = null;

    if (!searchFilter) {
      setGuidelinesList(Object.values(state.source.guidelines_standards));
    } else {
      handleSearch();
    }
  };

  const handleClearSearchFilter = () => {
    // setSearchFilter(null);
    // searchFilterRef.current = null;
    // currentSearchFilterRef.current = null;
    // if (!typeFilter) {
    //   setGuidelinesList(Object.values(state.source.guidelines_standards));
    // } else {
    //   handleTypeSearch();
    // }
  };

  // SERVERS ---------------------------------------------
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
          const { title, content, type, url } = item;
          console.log(item); // debug
          let searchTitle = "";
          let searchBody = "";

          if (title) searchTitle = title;
          if (title && title.rendered) searchTitle = title.rendered;
          if (content) searchBody = content;
          if (content && content.rendered) searchBody = content.rendered;
          console.log(searchBody);

          const ServeTitle = () => {
            if (!searchTitle) return null;

            return (
              <div
                className="primary-title"
                style={{ fontSize: 24, padding: `0.5em 0` }}
              >
                <Html2React html={searchTitle} />
              </div>
            );
          };

          const ServeType = () => {
            if (!type) return null;
            let typeName = type;
            let typeColor = colors.green;

            // pre define search colours & type names
            if (type === "post") {
              typeName = "Blog Post";
              typeColor = colors.black;
            }
            if (type === "page") {
              typeName = "Page";
              typeColor = colors.blue;
            }
            if (type === "pils") {
              typeName = "PILS";
              typeColor = colors.red;
            }
            if (type === "derm_groups_charity") {
              typeName = "Dermatology Group & Charity";
            }
            if (type === "events") {
              typeName = "Events";
              typeColor = colors.turquoise;
            }
            if (type === "covid_19") {
              typeName = "COVID-19";
            }

            return (
              <div
                className="primary-title"
                style={{ padding: `0.5em 0`, color: typeColor }}
              >
                <Html2React html={typeName} />
              </div>
            );
          };

          const ServeBody = () => {
            if (!searchBody) return null;

            return (
              <div className="primary-title" style={{ padding: `0.5em 0` }}>
                <Html2React html={searchBody} />
              </div>
            );
          };

          return (
            <div
              key={index}
              className="flex-col shadow card-wrapper"
              style={{
                padding: "1em 4em",
                backgroundColor: colors.silverFillTwo,
                marginBottom: `1em`,
                minHeight: "200px",
              }}
              onClick={() => setGoToAction({ path: url, actions })}
            >
              <ServeTitle />
              <ServeType />
              <ServeBody />
            </div>
          );
        })}

        {/* {bodyLength > 2500 && <ScrollTop />} */}
      </div>
    );
  };

  const ServeFilter = () => {
    const ServeSearchFilter = () => {
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

    const ServeTypeFilter = () => {
      if (!typeFilter) return null;

      return (
        <div className="shadow filter" style={{ textTransform: "uppercase" }}>
          <div>{typeFilter}</div>
          <div className="filter-icon" onClick={handleClearTypeFilter}>
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

    let searchTitle = `You Searched for "${appSearchPhrase}"`;
    if (!appSearchPhrase) searchTitle = `You haven't searched yet`;

    return (
      <div
        style={{ backgroundColor: colors.silverFillTwo }}
        className="no-selector"
      >
        <BlockWrapper>
          <div
            className="flex-col"
            style={{ padding: `${marginVertical}px ${marginHorizontal}px` }}
          >
            <SearchContainer
              title={searchTitle}
              width="70%"
              searchFilterRef={searchFilterRef}
              handleSearch={handleSearch}
            />

            <div className="flex" style={{ padding: "0.5em 0 1em" }}>
              <ServeSearchFilter />
              <ServeTypeFilter />
            </div>
          </div>
        </BlockWrapper>
      </div>
    );
  };

  return (
    <div className="flex-col">
      <ServeFilter />
      <BlockWrapper>
        <div
          className="text-body"
          style={{
            margin: `${marginVertical}px ${marginHorizontal}px`,
          }}
        >
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
