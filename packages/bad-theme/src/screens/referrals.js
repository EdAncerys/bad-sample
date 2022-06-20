import { useState, useEffect } from "react";
import { connect } from "frontity";

import { colors } from "../config/imports";
import Loading from "../components/loading";
import TitleBlock from "../components/titleBlock";
import SearchDropDown from "../components/searchDropDown";
import ScrollTop from "../components/scrollTop";
import Card from "../components/card/card";
// --------------------------------------------------------------------------------
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
// BLOCK WIDTH WRAPPER -------------------------------------------------------
import BlockWrapper from "../components/blockWrapper";
// --------------------------------------------------------------------------------
import { muiQuery, getReferralsData, setGoToAction } from "../context";

const Referrals = ({ state, actions, libraries }) => {
  const { sm, md, lg, xl } = muiQuery();

  const Html2React = libraries.html2react.Component; // Get the component exposed by html2react.
  const data = state.source.get(state.router.link);
  const pil = state.source[data.type][data.id];

  const marginHorizontal = state.theme.marginHorizontal;
  const marginVertical = state.theme.marginVertical;
  const ctaHeight = 45;

  const [posts, setPosts] = useState([]);
  const [postFilter, setFilter] = useState([]);
  const [searchFilter, setSearchFilter] = useState("");
  const [searchInput, setInput] = useState("");
  const [searchPhrase, setPhrase] = useState("");

  useEffect(async () => {
    // ⬇️ on component load defaults to window position TOP
    window.scrollTo({ top: 0, behavior: "smooth" }); // force scrolling to top of page
    document.documentElement.scrollTop = 0; // for safari

    // get referral data from wp api
    let response = await getReferralsData({ state });
    if (response && response.length > 0) {
      // multiple response 5x times fro testing purposes
      response = Array(5).fill(...response);
      console.log("🐞 response", response); // debug

      setPosts(response);
      setFilter(response);
    }
  }, []);

  if (!posts) return <Loading />;

  // HANDLERS ---------------------------------------------------------------
  const handleSearch = (e) => {
    const input = e.target.value.toLowerCase();
    let filter = [];

    if (input) {
      filter = posts.filter(
        (post) =>
          post.title.rendered.toLowerCase().includes(input) || // search by title
          post.acf.condition_description.toLowerCase().includes(input) // search by content
      );
      // ⬇️ convert filter to dropdown object format
      filter = filter.map((item) => {
        return {
          id: item.id,
          title: item.title.rendered,
          url: item.link,
        };
      });
    }

    if (filter.length) {
      setFilter(filter);
      setSearchFilter(filter);
    } else {
      setSearchFilter([]);
    }
    setInput(input);
  };

  const dropDownHandler = ({ item }) => {
    // console.log(item); // debug
    setGoToAction({ state, path: item.url, actions });
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && e.target.value) {
      handleSearch(e);
    }
  };

  const handleSearchPress = (e) => {
    handleSearch(e);
  };

  const handleClearFilter = () => {
    // clear search progress & reset data to default params
    setSearchFilter("");
    setInput("");
    setPhrase("");
    setFilter(posts);
  };

  // SERVERS ----------------------------------------------------------------
  const ServeIcon = () => {
    const searchIcon = <SearchIcon />;
    const closeIcon = <CloseIcon />;
    const icon = searchFilter ? closeIcon : searchIcon;

    return <div onClick={handleClearFilter}>{icon}</div>;
  };

  const ServeSearchFilter = () => {
    if (!searchPhrase) return null;

    return (
      <div className="shadow filter">
        <div>{searchPhrase}</div>
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

  const ServeSearchButton = () => {
    return (
      <div
        style={{
          display: "grid",
          alignItems: "center",
          paddingLeft: !lg ? `2em` : 0,
          paddingTop: !lg ? null : "1em",
        }}
      >
        <div className="blue-btn" onClick={handleSearchPress}>
          Search
        </div>
      </div>
    );
  };

  return (
    <div>
      <BlockWrapper>
        <div
          className="flex-col shadow"
          style={{
            padding: `${marginVertical}px ${marginHorizontal}px`,
            margin: `${marginVertical}px 0`,
          }}
        >
          <div className="primary-title" style={{ fontSize: !lg ? 36 : 25 }}>
            Dermotology Referral Guidilenes
          </div>
          <div
            className="flex-col"
            style={{ padding: `1em 0`, width: "100%", maxWidth: 800 }}
          >
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industry's standard dummy text
            ever since the 1500s, when an unknown printer took a galley of type
            and scrambled it to make a type specimen book. It has survived not
            only five centuries, but also the leap into electronic typesetting,
            remaining essentially unchanged. It was popularised in the 1960s
            with the release of Letraset sheets containing Lorem Ipsum passages,
            and more recently with desktop publishing software like Aldus.
          </div>
        </div>
      </BlockWrapper>

      <div
        style={{
          backgroundColor: colors.silverFillTwo,
          marginBottom: `${state.theme.marginVertical}px`,
          padding: `2em 0`,
        }}
        className="no-selector"
      >
        <BlockWrapper>
          <div style={{ position: "relative", width: !lg ? "70%" : "100%" }}>
            <TitleBlock
              block={{
                text_align: "left",
                title: "Search Dermatology Referral Guidelines",
              }}
              fontSize={!lg ? 36 : 25}
              margin="0 0 1em 0"
            />
            <div className={!lg ? "flex-row" : "flex-col"}>
              <div
                className="flex"
                style={{
                  flex: 1,
                  height: ctaHeight,
                  position: "relative",
                  margin: "auto 0",
                }}
              >
                <input
                  id="pils-search-input"
                  value={searchInput}
                  onChange={handleSearch}
                  onKeyPress={(e) => handleKeyPress(e)}
                  type="text"
                  className="form-control input"
                  placeholder="Search"
                />
                <div
                  className="input-group-text toggle-icon-color"
                  style={{
                    position: "absolute",
                    right: 0,
                    height: ctaHeight,
                    border: "none",
                    background: "transparent",
                    alignItems: "center",
                    color: colors.darkSilver,
                    cursor: "pointer",
                  }}
                >
                  <ServeIcon />
                </div>
                <SearchDropDown
                  input={searchInput}
                  filter={searchFilter}
                  onClickHandler={dropDownHandler}
                  marginTop={ctaHeight + 5}
                />
              </div>
              <ServeSearchButton />
            </div>
          </div>
          <div className="flex" style={{ marginTop: "1em" }}>
            <ServeSearchFilter />
          </div>
        </BlockWrapper>
      </div>

      <BlockWrapper>
        <div className="referral-container">
          {postFilter.length > 0 &&
            postFilter.map((post, key) => {
              let title = post.title ? post.title.rendered : null;
              let body = post.acf.condition_description
                ? post.acf.condition_description
                : null;
              let link = post.link ? post.link : null;

              return (
                <Card
                  key={key}
                  title={title}
                  body={body}
                  colour={colors.primary}
                  bodyLimit={3}
                  cardMinHeight={250}
                  link_label="See More"
                  link={link}
                  shadow
                />
              );
            })}
          {postFilter.length > 20 && <ScrollTop />}
        </div>
      </BlockWrapper>
    </div>
  );
};

export default connect(Referrals);
