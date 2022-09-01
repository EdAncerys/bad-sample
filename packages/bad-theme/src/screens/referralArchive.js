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
import {
  muiQuery,
  getReferralsData,
  setGoToAction,
  getReferralsPage,
  Parcer,
} from "../context";

const ReferralArchive = ({ state, actions, libraries }) => {
  const { sm, md, lg, xl } = muiQuery();

  const marginHorizontal = state.theme.marginHorizontal;
  const marginVertical = state.theme.marginVertical;
  const ctaHeight = 45;

  const [posts, setPosts] = useState([]);
  const [postFilter, setFilter] = useState([]);
  const [searchFilter, setSearchFilter] = useState("");
  const [searchInput, setInput] = useState("");
  const [searchPhrase, setPhrase] = useState("");
  const [pageContent, setPageContent] = useState([]);
  console.log("🐞 posts", posts); // debug

  useEffect(async () => {
    // ⬇️ on component load defaults to window position TOP
    window.scrollTo({ top: 0, behavior: "smooth" }); // force scrolling to top of page
    document.documentElement.scrollTop = 0; // for safari

    // get referral data from wp api
    let response = await getReferralsData({ state });
    // get referral page contetn
    let pageContent = await getReferralsPage({ state });
    if (response && response.length > 0) {
      // 📌 sort posts alphabetically by title
      response.sort((a, b) => {
        if (a.title.rendered < b.title.rendered) return -1;
        if (a.title.rendered > b.title.rendered) return 1;
        return 0;
      });

      setPageContent(pageContent);
      setPosts(response);
      setFilter(response);
    }
  }, []);

  if (!posts || !pageContent.length) return <Loading />;

  // HANDLERS ---------------------------------------------------------------
  const handleSearch = (e) => {
    const input = e.target.value;
    let filter = [];

    if (input) {
      // filter posts where title or content contains input
      filter = posts.filter((post) => {
        let title = post.title ? post.title.rendered.toLowerCase() : "";
        let content = post.acf.condition_description
          ? post.acf.condition_description.toLowerCase()
          : "";

        return (
          title.includes(input.toLowerCase()) ||
          content.includes(input.toLowerCase())
        );
      });

      // ⬇️ convert filter to dropdown object format
      filter = filter.map((item) => {
        return {
          id: item.id,
          title: item.title.rendered,
          url: item.link,
        };
      });
    }
    //

    if (filter.length > 0) {
      setSearchFilter(filter);
    } else {
      setSearchFilter("");
    }
    setInput(input);
  };

  const dropDownHandler = ({ item }) => {
    setGoToAction({ state, path: item.url, actions });
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
        <div className="blue-btn">Search</div>
      </div>
    );
  };

  return (
    <div>
      {pageContent.length > 0 && (
        <BlockWrapper>
          <div
            className="flex-col shadow"
            style={{
              padding: `${marginVertical}px ${marginHorizontal}px`,
              margin: `${marginVertical}px 0`,
            }}
          >
            <div className="primary-title" style={{ fontSize: !lg ? 36 : 25 }}>
              <Parcer
                libraries={libraries}
                html={pageContent[0].title.rendered}
              />
            </div>
            <div
              className="flex-col"
              style={{ padding: `1em 0`, width: "100%" }}
            >
              <Parcer
                libraries={libraries}
                html={pageContent[0].content.rendered}
              />
            </div>
          </div>
        </BlockWrapper>
      )}

      {/* <div
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
      </div> */}

      <BlockWrapper>
        <div className="referral-container">
          {postFilter.length > 0 &&
            postFilter.map((post, key) => {
              let title = post.title ? post.title.rendered : null;
              let body =
                post.acf.condition_preview || post.acf.condition_description;
              let link = post.link || null;
              // --------------------------------------------------------------------------------
              let cardImage = null;
              if (post.acf.severity_caption_image)
                cardImage = post.acf.severity_caption_image.url;

              return (
                <Card
                  key={key}
                  title={title}
                  body={body}
                  // --------------------------------------------------------------------------------
                  url={cardImage}
                  imgHeight="200px" // image height in pixels
                  colour={colors.primary}
                  bodyLimit={6}
                  cardMinHeight={350}
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

export default connect(ReferralArchive);
