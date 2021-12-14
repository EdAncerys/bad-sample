import { useState, useEffect } from "react";
import { connect, styled } from "frontity";
import Image from "@frontity/components/image";
import { v4 as uuidv4 } from "uuid";

import { setGoToAction } from "../context";

import Loading from "./loading";
import Accordion from "./accordion";
import { colors } from "../config/colors";
import BrandLogo from "../img/placeholders/logo.svg";

import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";

const GuidelinesAndStandards = ({ state, actions, libraries, block }) => {
  const Html2React = libraries.html2react.Component; // Get the component exposed by html2react.

  if (!block) return <Loading />;

  const id = uuidv4();

  const data = state.source.get(state.router.link);
  const [searchFilter, setSearchFilter] = useState(null);
  const [list, setList] = useState(block);

  const { totalPages, page, next } = data; // check if data have multiple pages
  // console.log("pageData ", data); // debug

  const marginHorizontal = state.theme.marginHorizontal;
  const marginVertical = state.theme.marginVertical;

  // HELPERS ----------------------------------------------------------------
  const handleSearchSubmit = () => {
    const searchInput = document.querySelector(`#searchInput${id}`).value;
    if (!!searchInput) {
      const INPUT = searchInput.toLowerCase();
      const filter = list.accordion_item.filter(
        (item) =>
          item.title.toLowerCase().includes(INPUT) ||
          item.body.toLowerCase().includes(INPUT)
      );
      setSearchFilter(searchInput);
      setList({ accordion_item: Object.values(filter) });
    }
  };

  // SERVERS --------------------------------------------------------
  const ServeInfo = () => {
    const ServeTitle = () => {
      return (
        <div
          className="flex"
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
            src={BrandLogo}
            alt={alt}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
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
    if (!block.guideline_type) return null;

    return (
      <div style={{ padding: `${marginVertical}px ${marginHorizontal}px 0` }}>
        <div
          className="shadow"
          style={{
            fontSize: 12,
            textTransform: "uppercase",
            color: colors.black,
            fontWeight: "bold",
            alignItems: "center",
            padding: `2em 4em`,
            width: "fit-content",
          }}
        >
          <Html2React html={block.guideline_type} />
        </div>
      </div>
    );
  };

  const ServeFilter = () => {
    const ServeTitle = () => {
      return (
        <div
          className="flex"
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
              setList(block);
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
                  height: 45,
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
      <Accordion block={list} />
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
