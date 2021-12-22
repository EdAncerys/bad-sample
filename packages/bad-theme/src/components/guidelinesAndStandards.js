import { useState, useEffect } from "react";
import { connect, styled } from "frontity";
import Image from "@frontity/components/image";
import { v4 as uuidv4 } from "uuid";

import { setGoToAction } from "../context";

import Loading from "./loading";
import Accordion from "./accordion";
import { colors } from "../config/colors";
import NiceLogo from "../img/placeholders/niceLogo.svg";

import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";

const GuidelinesAndStandards = ({ state, actions, libraries, block }) => {
  const Html2React = libraries.html2react.Component; // Get the component exposed by html2react.

  if (!block) return <Loading />;

  const { disable_vertical_padding } = block;

  const data = state.source.get(state.router.link);
  const [searchFilter, setSearchFilter] = useState(null);
  const [typeFilter, setTypeFilter] = useState(null);
  const [guidelinesList, setGuidelinesList] = useState(null);
  const [guidelinesType, setGuidelinesType] = useState(null);
  // console.log("pageData ", data); // debug

  const id = uuidv4();
  const marginHorizontal = state.theme.marginHorizontal;
  let marginVertical = state.theme.marginVertical;
  if (disable_vertical_padding) marginVertical = 0;

  // DATA pre FETCH ----------------------------------------------------------------
  useEffect(async () => {
    const path = `/guidelines_standards/`;
    await actions.source.fetch(path); // fetch CPT guidelines

    const guidelines = state.source.get(path);
    const { totalPages, page, next } = guidelines; // check if guidelines have multiple pages
    // fetch guidelines via wp API page by page
    let isThereNextPage = next;
    while (isThereNextPage) {
      await actions.source.fetch(isThereNextPage); // fetch next page
      const nextPage = state.source.get(isThereNextPage).next; // check ifNext page & set next page
      isThereNextPage = nextPage;
    }
    if (!state.source.guidelines_standards) return null;

    const GUIDELINES_TYPE = Object.values(state.source.guidelines_type);
    const GUIDELINES_LIST = Object.values(state.source.guidelines_standards); // add guidelines object to data array
    setGuidelinesType(GUIDELINES_TYPE);
    setGuidelinesList(GUIDELINES_LIST);
  }, []);
  // DATA pre FETCH ----------------------------------------------------------------
  if (!guidelinesList) return <Loading />;

  // HELPERS ----------------------------------------------------------------
  const handleSearchSubmit = () => {
    const searchInput = document.querySelector(`#searchInput${id}`).value;

    if (!!searchInput) {
      const INPUT = searchInput.toLowerCase();
      const filter = guidelinesList.filter((item) => {
        let TITLE = item.title.rendered;
        let SUBTITLE = item.acf.subtitle;
        if (TITLE) TITLE = TITLE.toLowerCase().includes(INPUT);
        if (SUBTITLE) SUBTITLE = SUBTITLE.toLowerCase().includes(INPUT);

        return TITLE || SUBTITLE;
      });
      setSearchFilter(searchInput);
      setGuidelinesList(filter);
    }
  };

  const handleTypeFilterSearch = ({ typeId, typeName }) => {
    if (typeId) {
      // reset filter option
      const guidelinesList = Object.values(state.source.guidelines_standards);

      const filter = guidelinesList.filter((item) => {
        const GUIDELINES_LIST = item.guidelines_type;
        if (GUIDELINES_LIST.includes(typeId)) return item;
      });

      setTypeFilter(typeName);
      setGuidelinesList(filter);
    }
  };

  // SERVERS --------------------------------------------------------
  const ServeInfo = () => {
    const ServeTitle = () => {
      return (
        <div
          className="flex primary-title"
          style={{
            fontSize: 36,
            color: colors.black,
            fontWeight: "bold",
            alignItems: "center",
          }}
        >
          Clinical Guidelines
        </div>
      );
    };

    const ServeBody = () => {
      return (
        <div className="flex" style={{ padding: `1em 0`, width: "60%" }}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat.
        </div>
      );
    };

    const ServeBrandLogo = () => {
      const alt = "BAD Brand";

      return (
        <div
          style={{
            width: 195,
            height: 70,
            overflow: "hidden",
            marginTop: `1em`,
          }}
        >
          <Image
            src={NiceLogo}
            alt={alt}
            style={{
              width: "100%",
              height: "100%",
            }}
          />
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
        <ServeBrandLogo />
      </div>
    );
  };

  const ServeType = () => {
    if (!guidelinesType) return null;

    return (
      <div style={{ padding: `${marginVertical}px ${marginHorizontal}px 0` }}>
        <div className="flex-row">
          {guidelinesType.map((type, key) => {
            return (
              <div
                key={key}
                className="shadow"
                style={{
                  fontSize: 12,
                  textTransform: "uppercase",
                  color: colors.black,
                  fontWeight: "bold",
                  alignItems: "center",
                  padding: `2em 4em`,
                  marginRight: `3em`,
                  width: "fit-content",
                  cursor: "pointer",
                }}
                onClick={() =>
                  handleTypeFilterSearch({
                    typeId: type.id,
                    typeName: type.name,
                  })
                }
              >
                <Html2React html={type.name} />
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const ServeFilter = () => {
    const ServeTitle = () => {
      return (
        <div
          className="flex primary-title"
          style={{
            fontSize: 36,
            color: colors.black,
            fontWeight: "bold",
            alignItems: "center",
          }}
        >
          Search for Guidelines
        </div>
      );
    };

    const ServeSearchFilter = () => {
      if (!searchFilter) return null;

      return (
        <div className="shadow" style={styles.action}>
          <div>{searchFilter}</div>
          <div
            style={styles.closeAction}
            onClick={() => {
              setSearchFilter(null);
              setGuidelinesList(
                Object.values(state.source.guidelines_standards)
              );
            }}
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

    const ServeTypeFilter = () => {
      if (!typeFilter) return null;

      return (
        <div
          className="shadow"
          style={{ ...styles.action, textTransform: "uppercase" }}
        >
          <div>{typeFilter}</div>
          <div
            style={styles.closeAction}
            onClick={() => {
              setTypeFilter(null);
              setGuidelinesList(
                Object.values(state.source.guidelines_standards)
              );
            }}
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
      <div style={{ backgroundColor: colors.silverFillTwo }}>
        <div
          className="flex-col"
          style={{
            padding: `${
              marginVertical * 1.5
            }px ${marginHorizontal}px ${marginVertical}px`,
          }}
        >
          <ServeTitle />

          <div className="flex-row" style={{ width: "60%" }}>
            <div
              className="flex"
              style={{
                flex: 1,
                marginRight: `2em`,
                padding: `0.75em 0`,
                position: "relative",
              }}
            >
              <input
                id={`searchInput${id}`}
                type="text"
                className="form-control"
                placeholder="Find Guidelines"
                style={styles.input}
              />
              <span
                className="input-group-text"
                style={{
                  position: "absolute",
                  right: 0,
                  height: 40,
                  border: "none",
                  background: "transparent",
                  alignItems: "center",
                  color: colors.darkSilver,
                }}
              >
                <SearchIcon />
              </span>
            </div>
            <div style={{ display: "grid", alignItems: "center" }}>
              <button
                type="submit"
                className="btn"
                style={{
                  backgroundColor: colors.primary,
                  color: colors.white,
                  padding: `0.5em`,
                }}
                onClick={handleSearchSubmit}
              >
                Search
              </button>
            </div>
          </div>

          <div className="flex" style={{ padding: "0.5em 0 1em" }}>
            <ServeSearchFilter />
            <ServeTypeFilter />
          </div>
        </div>
      </div>
    );
  };

  // RETURN ----------------------------------------------------------------
  return (
    <div>
      <ServeInfo />
      <ServeFilter />
      <ServeType />
      <Accordion block={{ accordion_item: guidelinesList }} guidelines />
    </div>
  );
};

const styles = {
  container: {},
  action: {
    position: "absolute",
    backgroundColor: colors.white,
    borderRadius: 5,
    padding: `0.5em 1.5em`,
    marginRight: `1em`,
    width: "fit-content",
  },
  closeAction: {
    position: "absolute",
    top: -10,
    right: -10,
    backgroundColor: colors.white,
    cursor: "pointer",
    borderRadius: "50%",
  },
};

export default connect(GuidelinesAndStandards);
