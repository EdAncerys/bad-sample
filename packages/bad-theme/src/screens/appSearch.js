import { useState, useEffect, useRef } from "react";
import { connect } from "frontity";

import { colors } from "../config/imports";
import { Form } from "react-bootstrap";
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
  postTypeHandler,
  Parcer,
} from "../context";

const AppSearch = ({ state, actions, libraries }) => {
  const { sm, md, lg, xl } = muiQuery();

  const dispatch = useAppDispatch();
  const { appSearchData, appSearchPhrase } = useAppState();

  const data = state.source.get(state.router.link);
  const page = state.source[data.type][data.id];
  const wpBlocks = page.acf.blocks;

  const marginHorizontal = state.theme.marginHorizontal;
  const marginVertical = state.theme.marginVertical;
  const [position, setPosition] = useState(null);

  const [postList, setPostList] = useState(null);
  const [searchFilter, setSearchFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [catTypes, setCatTypes] = useState("");
  const typeFilterRef = useRef("");
  const searchFilterRef = useRef("");

  useEffect(() => {
    // ⬇️ on component load defaults to window position TOP
    window.scrollTo({ top: 0, behavior: "smooth" }); // force scrolling to top of page
    document.documentElement.scrollTop = 0; // for safari

    // set cat types form appSearchData
    let catTypes = [];
    // map appSearchData & if have type & is not in catTypes array add to catTypes
    if (appSearchData)
      appSearchData.map((item) => {
        if (item.type && !catTypes.includes(item.type)) {
          catTypes.push(item.type);
        }
      });

    setCatTypes(catTypes);
    setPostList(appSearchData);
    setPosition(true);
  }, [appSearchData]);

  if (!page || !position) return <Loading />;

  // HELPERS ----------------------------------------------------------------
  const handleSearch = () => {
    const input = searchFilterRef.current.value.toLowerCase();
    const type = typeFilterRef.current.toLowerCase();

    if (!appSearchData || !postList) return; // if no data return
    let data = appSearchData;
    // ⬇️ filter appSearchData by input & typeFilter
    if (input)
      data = appSearchData.filter((item) => {
        // if title | type includes input
        let title = item.title;
        if (title && title.rendered) title = title.rendered;
        let content = item.content;
        if (content && content.rendered) content = content.rendered;

        // if title | content includes input return true
        if (
          (title && title.length && title.toLowerCase().includes(input)) ||
          (content && content.length && content.toLowerCase().includes(input))
        )
          return true;
      });

    if (type) {
      data = data.filter((item) => {
        if (item.type.toLowerCase().includes(type)) {
          return item;
        }
      });
    }

    setSearchFilter(input);
    setPostList(data);
  };

  const handleTypeSearchFilter = (e) => {
    const input = e.target.value;
    if (!input) return;

    typeFilterRef.current = input;
    setTypeFilter(input);
    handleSearch();
  };

  const handleClearTypeFilter = () => {
    // clear the typeFilter
    setTypeFilter("");
    typeFilterRef.current = "";
    handleSearch();
  };

  const handleClearSearchFilter = () => {
    // clear search filter
    setSearchFilter("");
    searchFilterRef.current.value = "";
    handleSearch();
  };

  // SERVERS ---------------------------------------------
  const ServeSearchList = () => {
    if (!postList) return null;
    const listLength = postList.length;

    return (
      <div
        className="text-body"
        style={{
          backgroundColor: colors.white,
          padding: `2em 0`,
        }}
      >
        {postList.map((item, index) => {
          const { title, content, type, url } = item;
          // console.log("menu", item); // debug
          let searchTitle = "";
          let searchBody = "";

          if (title) searchTitle = title;
          if (title && title.rendered) searchTitle = title.rendered;
          if (content) searchBody = content;
          if (content && content.rendered) searchBody = content.rendered;

          const ServeTitle = () => {
            if (!searchTitle) return null;

            return (
              <div
                className="primary-title"
                style={{ fontSize: 24, padding: `0.5em 0` }}
              >
                <Parcer libraries={libraries} html={searchTitle} />
              </div>
            );
          };

          const ServeType = () => {
            if (!type) return null;

            // pre define search colours & type names
            let name = postTypeHandler({ type }).name;
            let color = postTypeHandler({ type }).color;

            return (
              <div
                className="primary-title"
                style={{ padding: `0.5em 0`, color }}
              >
                <Parcer libraries={libraries} html={name} />
              </div>
            );
          };

          const ServeBody = () => {
            if (!searchBody) return null;

            return (
              <div
                className="primary-title body-limit"
                style={{ margin: `0.5em 0`, WebkitLineClamp: 6 }}
              >
                <Parcer libraries={libraries} html={searchBody} />
              </div>
            );
          };

          const ServeAction = () => {
            return (
              <div className="caps-btn" style={{ padding: `0.5em 0` }}>
                See More
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
              onClick={() => setGoToAction({ state, path: url, actions })}
            >
              <ServeTitle />
              <ServeType />
              <ServeBody />
              <ServeAction />
            </div>
          );
        })}

        {listLength > 10 && <ScrollTop />}
      </div>
    );
  };

  const ServeFilter = () => {
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

    const ServeTypeFilter = () => {
      if (!typeFilter) return null;
      let name = postTypeHandler({ type: typeFilter }).name;

      return (
        <div className="shadow filter">
          <div>{name}</div>
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

    const ServeDropDownFilter = () => {
      if (catTypes && !catTypes.length) return null;

      return (
        <div className="flex">
          <div
            className="primary-title"
            style={{
              display: "grid",
              alignItems: "center",
              fontSize: 20,
              paddingRight: "0.5em",
            }}
          >
            Filter:
          </div>
          <div style={{ width: "fit-content" }}>
            <Form.Select
              value={typeFilter}
              onChange={handleTypeSearchFilter}
              className="input"
            >
              <option value="" hidden>
                Site Section
              </option>
              {catTypes.map((item, key) => {
                let name = postTypeHandler({ type: item }).name;

                return (
                  <option key={key} value={item}>
                    {name}
                  </option>
                );
              })}
            </Form.Select>
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

            <ServeDropDownFilter />
            <div className="flex" style={{ paddingTop: "1.5em" }}>
              <ServeSearchFilter />
              <ServeTypeFilter />
            </div>
          </div>
        </BlockWrapper>
      </div>
    );
  };

  return (
    <div className="flex-col app-search">
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
