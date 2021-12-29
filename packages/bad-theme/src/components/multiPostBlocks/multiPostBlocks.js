import { useState, useLayoutEffect } from "react";
import { connect } from "frontity";
import { Form } from "react-bootstrap";
import { v4 as uuidv4 } from "uuid";

import PostBlocks from "./postBlocks";
import Loading from "../loading";
import { colors } from "../../config/imports";

import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
// CONTEXT ----------------------------------------------------------------
import { useAppDispatch, useAppState } from "../../context";

const MultiPostBlocks = ({ state, actions, libraries, block }) => {
  if (!block) return <Loading />;

  const [filter, setFilter] = useState(null);
  const [dateFilter, setDateFilter] = useState(null);
  const [uniqueId, setUniqueId] = useState(null);

  const marginHorizontal = state.theme.marginHorizontal;
  const marginVertical = state.theme.marginVertical;

  const isSearch = block.add_search_function;
  const layoutOne = block.layout === "layout_one";
  const ctaHeight = 45;

  useLayoutEffect(() => {
    const blockId = uuidv4(); // add unique uniqueId
    setUniqueId(blockId);
  }, []);

  // HELPERS ----------------------------------------------------------------
  const handleInputSearch = () => {
    const searchInput = document
      .querySelector(`#eventSearch${uniqueId}`)
      .value.toLowerCase();
    const dateInput = document.querySelector(`#dateSearch${uniqueId}`).value;

    if (!!searchInput) setFilter(searchInput);
    if (!!dateInput) setDateFilter(dateInput);
  };

  // SERVERS ---------------------------------------------
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
        <div>
          <Form.Select
            id={`dateSearch${uniqueId}`}
            aria-label="Default select example"
            style={styles.input}
          >
            <option value="">Sort By</option>
            <option value="Descending">Date Descending</option>
            <option value="Ascending">Date Ascending</option>
          </Form.Select>
        </div>
      );
    };

    return (
      <div className="flex" style={{ padding: `1em 0`, alignItems: "center" }}>
        <ServeTitle />
        <ServeDateFilter />
      </div>
    );
  };

  const ServeSearchContainer = () => {
    return (
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
            id={`eventSearch${uniqueId}`}
            type="text"
            className="form-control"
            placeholder="Find An Event"
            style={styles.input}
          />
          <div
            className="input-group-text"
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
            <SearchIcon />
          </div>
        </div>
        <div
          style={{ display: "grid", alignItems: "center", paddingLeft: `2em` }}
        >
          <button
            type="submit"
            className="blue-btn"
            onClick={handleInputSearch}
          >
            Search
          </button>
        </div>
      </div>
    );
  };

  const ServeFilter = () => {
    if (!isSearch) return null;

    const ServeSearchFilter = () => {
      if (!filter) return null;

      return (
        <div className="shadow" style={styles.action}>
          <div>{filter}</div>
          <div style={styles.closeAction} onClick={() => setFilter(null)}>
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

    const ServeDateFilter = () => {
      if (!dateFilter) return null;

      return (
        <div className="shadow" style={styles.action}>
          <div>{dateFilter}</div>
          <div style={styles.closeAction} onClick={() => setDateFilter(null)}>
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
      <div style={{ position: "relative", padding: `1em 0`, width: `70%` }}>
        <div className="flex-col">
          <ServeSearchContainer />
          <ServeFilters />
        </div>
        <div className="flex" style={{ marginTop: "0.5em" }}>
          <ServeSearchFilter />
          <ServeDateFilter />
        </div>
      </div>
    );
  };

  // RETURN ---------------------------------------------------
  return (
    <div style={{ padding: `0 ${marginHorizontal}px` }}>
      <ServeFilter />
      <PostBlocks block={block} filter={filter} dateFilter={dateFilter} />
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
    position: "absolute",
    top: -10,
    right: -10,
    backgroundColor: colors.white,
    cursor: "pointer",
    borderRadius: "50%",
  },
};

export default connect(MultiPostBlocks);
