import { useState, useEffect } from "react";
import { connect } from "frontity";
import { Form } from "react-bootstrap";
import { v4 as uuidv4 } from "uuid";

import NewsBlock from "./newsBlock";
import NewsCarouselComponent from "./newsCarouselComponent";
import TitleBlock from "../titleBlock";
import Loading from "../loading";
import { colors } from "../../config/imports";

import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";

const NewsAndMedia = ({ state, actions, block }) => {
  if (!block) return <Loading />;

  const { layout, disable_vertical_padding } = block;

  const isLayoutOne = layout === "layout_one";

  const [searchFilter, setSearchFilter] = useState(null);
  const [dateFilter, setDateFilter] = useState(null);

  const marginHorizontal = state.theme.marginHorizontal;
  let marginVertical = state.theme.marginVertical;
  if (disable_vertical_padding) marginVertical = 0;

  const isSearch = false; // has_search search functionality
  const id = uuidv4();

  // SERVERS ---------------------------------------------
  const ServeFilter = () => {
    if (!isSearch) return null;

    const ServeSearchContainer = () => {
      return (
        <div className="flex-row">
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
              placeholder="Find An Event"
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
      );
    };

    const ServeFilters = () => {
      const ServeTitle = () => {
        return (
          <div
            className="primary-title"
            style={{
              fontSize: 20,
              color: colors.black,
              paddingRight: `2em`,
            }}
          >
            Filter:
          </div>
        );
      };

      const ServeDateFilter = () => {
        return (
          <div className="flex">
            <Form.Select
              id={`serveDateFilter${id}`}
              aria-label="Default select example"
              style={{ ...styles.input, width: "fit-content" }}
            >
              <option value="">Sort By</option>
              <option value="Date Descending">Date Descending</option>
              <option value="Date Ascending">Date Ascending</option>
            </Form.Select>
          </div>
        );
      };

      return (
        <div
          className="flex"
          style={{ padding: `1em 0`, alignItems: "center" }}
        >
          <ServeTitle />
          <ServeDateFilter />
        </div>
      );
    };

    const ServeSearchFilter = () => {
      if (!searchFilter) return null;

      return (
        <div className="shadow" style={styles.action}>
          <div>{searchFilter}</div>
          <div style={styles.closeAction} onClick={() => setSearchFilter(null)}>
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

    const ServeDropDownDateFilter = () => {
      if (!dateFilter) return null;

      return (
        <div className="shadow" style={styles.action}>
          <div>{dateFilter}</div>
          <div
            style={styles.closeAction}
            onClick={() => {
              setDateFilter(null);
              const POST_LIST = Object.values(state.source.post); // add postData object to data array
              setPostList(POST_LIST);
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
      <div style={{ position: "relative", paddingBottom: `1em` }}>
        <div className="flex-col" style={{ width: "60%" }}>
          <ServeSearchContainer />
          <ServeFilters />
        </div>
        <div className="flex" style={{ marginTop: "0.5em" }}>
          <ServeSearchFilter />
          <ServeDropDownDateFilter />
        </div>
      </div>
    );
  };

  const ServeLayout = () => {
    if (isLayoutOne) return <NewsCarouselComponent block={block} />;

    return (
      <div>
        <NewsBlock
          block={block}
          searchFilter={searchFilter}
          dateFilter={dateFilter}
        />
      </div>
    );
  };

  // RETURN ---------------------------------------------------
  return (
    <div style={{ padding: `${marginVertical}px ${marginHorizontal}px` }}>
      <TitleBlock block={block} margin={`0 0 ${marginVertical}px 0`} />
      <ServeFilter />
      <ServeLayout />
    </div>
  );
};

const styles = {
  input: {
    borderRadius: 10,
    paddingRight: 35,
    color: colors.darkSilver,
  },
  action: {
    position: "relative",
    backgroundColor: colors.white,
    borderRadius: 5,
    padding: `0.5em 1.5em`,
    marginRight: `1em`,
    width: "fit-content",
  },
  closeAction: {
    display: "grid",
    position: "absolute",
    top: -10,
    right: -10,
    backgroundColor: colors.white,
    cursor: "pointer",
    borderRadius: "50%",
  },
};

export default connect(NewsAndMedia);
