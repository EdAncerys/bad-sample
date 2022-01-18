import { useState, useEffect, useLayoutEffect } from "react";
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

  const { layout, disable_vertical_padding, has_search } = block;

  const isLayoutOne = layout === "layout_one";
  const ctaHeight = 45;

  const [uniqueId, setUniqueId] = useState(null);

  const [searchFilter, setSearchFilter] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState(null);
  const [dateFilter, setDateFilter] = useState(null);
  const [yearFilter, setYearFilter] = useState(null);

  const gradeList = Object.values(state.source.category);

  const marginHorizontal = state.theme.marginHorizontal;
  let marginVertical = state.theme.marginVertical;
  if (disable_vertical_padding) marginVertical = 0;

  // hook applies after React has performed all DOM mutations
  useLayoutEffect(() => {
    const blockId = uuidv4(); // add unique id
    setUniqueId(blockId);
  }, []);

  // HELPERS ----------------------------------------------------------------
  const handleInputSearch = () => {
    const searchInput = document.querySelector(
      `#search-input-${uniqueId}`
    ).value;

    const serveCategoryFilter = document.querySelector(
      `#category-filter-${uniqueId}`
    ).value;
    const dateFilter = document.querySelector(`#date-filter-${uniqueId}`).value;
    const yearFilter = document.querySelector(`#date-filter-${uniqueId}`).value;

    if (!!searchInput) setSearchFilter(searchInput);
    if (!!serveCategoryFilter) setCategoryFilter(serveGradeFilter);
    if (!!dateFilter) setDateFilter(dateFilter);
    if (!!yearFilter) setYearFilter(yearFilter);

    // apply date filter
    let filter = electionList.sort(
      (a, b) => new Date(a.acf.closing_date) - new Date(b.acf.closing_date)
    );
    if (serveDateFilter === "Date Descending") {
      filter = electionList.sort(
        (a, b) => new Date(b.acf.closing_date) - new Date(a.acf.closing_date)
      );
    }
    setElectionList(filter);
  };

  // SERVERS ---------------------------------------------
  const ServeFilter = () => {
    if (!has_search) return null;

    const ServeTitle = () => {
      return (
        <div
          className="flex primary-title"
          style={{
            fontSize: 36,
            color: colors.softBlack,
            alignItems: "center",
            paddingBottom: `0.5em`,
          }}
        >
          Search for News & Media
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
              id={`search-input-${uniqueId}`}
              type="text"
              className="form-control"
              placeholder="Find An Event"
              style={styles.input}
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
              <SearchIcon />
            </div>
          </div>
          <div
            style={{
              display: "grid",
              alignItems: "center",
              paddingLeft: `2em`,
            }}
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

    const ServeFilters = () => {
      const ServeTitle = () => {
        return (
          <div
            className="primary-title"
            style={{
              fontSize: 20,
              color: colors.softBlack,
            }}
          >
            Filter:
          </div>
        );
      };

      const ServeCategoryFilter = () => {
        return (
          <Form.Select
            id={`category-filter-${uniqueId}`}
            aria-label="Default select example"
            style={styles.input}
          >
            <option value="">Election Grades</option>
            {gradeList.map((item, key) => {
              return (
                <option key={key} value={item.id}>
                  {item.name}
                </option>
              );
            })}
          </Form.Select>
        );
      };

      const ServeDateFilter = () => {
        return (
          <Form.Select
            id={`#date-filter-${uniqueId}`}
            aria-label="Default select example"
            style={styles.input}
          >
            <option value="">Sort By</option>
            <option value="Date Descending">Date Descending</option>
            <option value="Date Ascending">Date Ascending</option>
          </Form.Select>
        );
      };

      const ServeYearFilter = () => {
        const now = new Date().getUTCFullYear();
        const years = Array(now - (now - 10))
          .fill("")
          .map((v, idx) => now - idx);

        return (
          <Form.Select
            id={`#year-filter-${uniqueId}`}
            aria-label="Default select example"
            style={styles.input}
          >
            <option value="">Sort By</option>
            {years.map((year, key) => {
              return (
                <option key={key} value={year}>
                  {year}
                </option>
              );
            })}
          </Form.Select>
        );
      };

      return (
        <div
          style={{
            padding: `1em 0`,
            alignItems: "center",
            display: "grid",
            gridTemplateColumns: `100px 1fr 1fr 1fr`,
            gap: `1em`,
          }}
        >
          <ServeTitle />
          <ServeDateFilter />
          <ServeCategoryFilter />
          <ServeYearFilter />
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

    const ServeSelectedCategoryFilter = () => {
      if (!categoryFilter) return null;

      return (
        <div className="shadow" style={styles.action}>
          <div>{categoryFilter}</div>
          <div style={styles.closeAction} onClick={() => setGradeFilter(null)}>
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

    const ServeSelectedDateFilter = () => {
      if (!dateFilter) return null;

      return (
        <div className="shadow" style={styles.action}>
          <div>{dateFilter}</div>
          <div style={styles.closeAction} onClick={() => setRoleFilter(null)}>
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

    const ServeSelectedYearFilter = () => {
      if (!yearFilter) return null;

      return (
        <div className="shadow" style={styles.action}>
          <div>{yearFilter}</div>
          <div
            style={styles.closeAction}
            onClick={() => {
              setDateFilter(null);
              const ELECTION_LIST = Object.values(state.source.elections); // add electionData object to data array
              setElectionList(ELECTION_LIST);
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
      <div style={{ position: "relative", padding: `1em 0`, width: `70%` }}>
        <div className="flex-col">
          <ServeTitle />
          <ServeSearchContainer />
          <ServeFilters />
        </div>
        <div className="flex" style={{ marginTop: "0.5em" }}>
          <ServeSearchFilter />
          <ServeSelectedCategoryFilter />
          <ServeSelectedDateFilter />
          <ServeSelectedYearFilter />
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

  const ServeMoreAction = () => {
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
          // onClick={handleInputSearch}
        >
          Load More
        </button>
      </div>
    );
  };

  // RETURN ---------------------------------------------------
  return (
    <div style={{ padding: `${marginVertical}px ${marginHorizontal}px` }}>
      <TitleBlock block={block} disableMargin />
      <ServeFilter />
      <ServeLayout />
      <ServeMoreAction />
    </div>
  );
};

const styles = {
  input: {
    borderRadius: 10,
    paddingRight: 35,
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
