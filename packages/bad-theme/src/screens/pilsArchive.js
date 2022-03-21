import { useState, useEffect, useRef } from "react";
import { connect } from "frontity";

import Loading from "../components/loading";
import SearchDropDown from "../components/searchDropDown";
import { colors } from "../config/imports";
import { setGoToAction } from "../context";

import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
// CONTEXT -----------------------------------------------------------
import { muiQuery, getPILsDataAction } from "../context";
// BLOCK WIDTH WRAPPER -----------------------------------------------
import BlockWrapper from "../components/blockWrapper";

const PilsArchive = ({ state, actions, libraries }) => {
  const { sm, md, lg, xl } = muiQuery();

  const Html2React = libraries.html2react.Component; // Get the component exposed by html2react.

  const data = state.source.get(state.router.link);
  const pilPageData = state.source[data.type][data.id];
  // console.log("pageData ", data); // debug

  const [searchFilter, setSearchFilter] = useState(null);
  const [searchInput, setInput] = useState("");
  const [searchPhrase, setPhrase] = useState("");
  const [pilList, setPilList] = useState(null);
  const useEffectRef = useRef(true);

  const marginHorizontal = state.theme.marginHorizontal;
  const marginVertical = state.theme.marginVertical;
  const ctaHeight = 45;

  // DATA pre FETCH ----------------------------------------------------------------
  useEffect(async () => {
    let pils = state.source.pils;
    if (!pils) {
      await getPILsDataAction({ state, actions });
      pils = state.source.pils;
    }

    // if pils not found return
    if (!pils) return;
    let pilData = Object.values(pils);

    // sort pils alphabetically by title
    pilData.sort((a, b) => {
      const nameA = a.title.rendered.toUpperCase(); // ignore upper and lowercase
      const nameB = b.title.rendered.toUpperCase(); // ignore upper and lowercase
      if (nameA < nameB) {
        return -1;
      }
      if (nameA > nameB) {
        return 1;
      }
      return 0;
    });

    setPilList(pilData); // add pill object to data array

    return () => {
      useEffectRef.current = false; // clean up function
    };
  }, []);
  // DATA pre FETCH ----------------------------------------------------------------

  if (!pilList) return <Loading />;
  let ALPHABET = [];
  pilList.map((item) => {
    const pilTitle = item.title.rendered;
    if (!pilTitle) return null;

    if (!isNaN(pilTitle[0])) {
      if (ALPHABET.includes("0-9")) return null;
      ALPHABET.push("0-9");
    }
    if (isNaN(pilTitle[0]) && !ALPHABET.includes(pilTitle[0].toUpperCase()))
      ALPHABET.push(pilTitle[0].toUpperCase());
  });
  ALPHABET.sort(); // sorts array alphabetically

  // HELPERS ----------------------------------------------------------------
  const handleSearch = (e) => {
    const input = e.target.value.toLowerCase();
    let filter = [];

    if (input) {
      filter = pilList.filter(
        (pil) =>
          pil.title.rendered.toLowerCase().includes(input) ||
          pil.content.rendered.toLowerCase().includes(input)
      );
      // ⬇️ convert filter to dropdown object format
      filter = filter.map((item) => {
        return {
          id: item.id,
          title: item.title.rendered,
          url: item.link,
        };
      });

      // setPilList(filter);
    }

    if (filter.length) {
      setSearchFilter(filter);
    } else {
      setSearchFilter(null);
    }
    setInput(input);
  };

  const handleClearFilter = () => {
    setSearchFilter(null);
    setInput("");
    setPhrase("");
    setPilList(Object.values(state.source.pils));
  };

  const dropDownHandler = ({ item }) => {
    // console.log(item); // debug
    setGoToAction({ path: item.url, actions });
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && e.target.value) {
      const input = e.target.value.toLowerCase();

      if (input) {
        let filter = pilList.filter(
          (pil) =>
            pil.title.rendered.toLowerCase().includes(input) ||
            pil.content.rendered.toLowerCase().includes(input)
        );
        setPhrase(input);
        setPilList(filter);
        setSearchFilter(null);
      }
    }
  };

  const handleSearchPress = () => {
    // get element input pils-search-input and convert to lowercase
    const input = document
      .getElementById("pils-search-input")
      .value.toLowerCase();

    if (input) {
      let filter = pilList.filter(
        (pil) =>
          pil.title.rendered.toLowerCase().includes(input) ||
          pil.content.rendered.toLowerCase().includes(input)
      );

      setPhrase(input);
      setPilList(filter);
      setSearchFilter(null);
    }
  };

  // SERVERS --------------------------------------------------------
  const ServePilsList = ({ item }) => {
    const ServePil = ({ pil }) => {
      const { link, title } = pil;
      if (!title.rendered) return null;
      // if item dont match first letter of the title.rendered return null
      if (item !== title.rendered[0].toUpperCase() && isNaN(title.rendered[0]))
        return null;
      if (item !== "0-9" && !isNaN(title.rendered[0])) return null;

      return (
        <div
          className="pil-title"
          style={{ fontSize: 16, marginBottom: `0.25em`, cursor: "pointer" }}
          onClick={() => setGoToAction({ path: link, actions })}
        >
          <Html2React html={title.rendered} />
        </div>
      );
    };

    return (
      <div>
        <div
          className="primary-title"
          style={{
            fontSize: !lg ? 36 : 25,
            borderBottom: `1px solid ${colors.darkSilver}`,
          }}
        >
          {item}
        </div>
        <div style={{ padding: `1em 0` }}>
          {pilList.map((pil, key) => {
            return <ServePil key={key} pil={pil} />;
          })}
        </div>
      </div>
    );
  };

  const ServeInfo = () => {
    if (!pilPageData) return null;

    const { title, content } = pilPageData;

    const ServeTitle = () => {
      if (!title) return null;

      return (
        <div
          className="flex primary-title"
          style={{ fontSize: !lg ? 36 : 25, alignItems: "center" }}
        >
          <Html2React html={title.rendered} />
        </div>
      );
    };

    const ServeBody = () => {
      if (!content) return null;

      return (
        <div className="flex-col" style={{ padding: `1em 0`, width: "100%" }}>
          <Html2React html={content.rendered} />
        </div>
      );
    };
    return (
      <div
        className="flex-col"
        style={{ padding: `${marginVertical}px ${marginHorizontal}px` }}
      >
        <ServeTitle />
        <ServeBody />
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
        <button type="submit" className="blue-btn" onClick={handleSearchPress}>
          Search
        </button>
      </div>
    );
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

  const ServeIcon = () => {
    const searchIcon = <SearchIcon />;
    const closeIcon = <CloseIcon />;
    const icon = searchFilter ? closeIcon : searchIcon;

    return <div onClick={handleClearFilter}>{icon}</div>;
  };

  // RETURN ----------------------------------------------------------------
  return (
    <div>
      <BlockWrapper>
        <ServeInfo />
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
          <div style={{ padding: `0 ${marginHorizontal}px` }}>
            <div style={{ position: "relative", width: "70%" }}>
              <div className="flex-row">
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
                </div>
                <ServeSearchButton />
              </div>
              <SearchDropDown
                filter={searchFilter}
                onClickHandler={dropDownHandler}
              />
            </div>
            <div className="flex" style={{ marginTop: "1em" }}>
              <ServeSearchFilter />
            </div>
          </div>
        </BlockWrapper>
      </div>
      <BlockWrapper>
        <div style={{ margin: `${marginVertical}px ${marginHorizontal}px` }}>
          <div style={!lg ? styles.container : styles.containerMobile}>
            {ALPHABET.map((item, key) => {
              return <ServePilsList key={key} item={item} />;
            })}
          </div>
        </div>
      </BlockWrapper>
    </div>
  );
};

const styles = {
  container: {
    display: "grid",
    gridTemplateColumns: `repeat(3, 1fr)`,
    gap: 20,
  },
  containerMobile: {
    display: "grid",
    gridTemplateColumns: `1fr`,
    gap: 20,
  },
  input: {
    borderRadius: 10,
  },
};

export default connect(PilsArchive);
