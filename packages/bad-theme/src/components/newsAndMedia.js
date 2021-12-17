import { useState, useEffect } from "react";
import { connect } from "frontity";
import { Form } from "react-bootstrap";
import { v4 as uuidv4 } from "uuid";

import Card from "./card/card";
import NewsCarousel from "./newsCarousel";
import TitleBlock from "./titleBlock";
import Loading from "./loading";
import { colors } from "../config/colors";

import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";

const NewsAndMedia = ({ state, actions, block }) => {
  if (!block) return <Loading />;

  const [postList, setPostList] = useState(null);
  const [category, setCategory] = useState(null);

  const [searchFilter, setSearchFilter] = useState(null);
  const [dateFilter, setDateFilter] = useState(null);

  const marginHorizontal = state.theme.marginHorizontal;
  const marginVertical = state.theme.marginVertical;

  const { text_align, has_search, layout, title } = block;
  const isSearch = false; // has_search search functionality
  const id = uuidv4();

  // DATA pre FETCH ----------------------------------------------------------------
  useEffect(async () => {
    const path = `/posts/`;
    await actions.source.fetch(path); // fetch CPT postData

    const postData = state.source.get(path);
    const { totalPages, page, next } = postData; // check if postData have multiple pages
    // fetch postData via wp API page by page
    let isThereNextPage = next;
    while (isThereNextPage) {
      await actions.source.fetch(isThereNextPage); // fetch next page
      const nextPage = state.source.get(isThereNextPage).next; // check ifNext page & set next page
      isThereNextPage = nextPage;
    }

    const POST_LIST = Object.values(state.source.post); // add postData object to data array
    if (state.source.category) {
      const CATEGORY = Object.values(state.source.category);
      setCategory(CATEGORY);
    }

    setPostList(POST_LIST);
  }, []);
  // DATA pre FETCH ----------------------------------------------------------------
  if (!postList || !category) return <Loading />;

  // HELPERS ----------------------------------------------------------------
  const handleSearchSubmit = () => {
    const searchInput = document.querySelector(`#searchInput${id}`).value;

    const serveDateFilter = document.querySelector(
      `#serveDateFilter${id}`
    ).value;

    if (!!searchInput) setSearchFilter(searchInput);
    if (!!serveDateFilter) {
      setDateFilter(serveDateFilter);
      // apply date filter
      let filter = postList.sort(
        (a, b) => new Date(a.acf.closing_date) - new Date(b.acf.closing_date)
      );
      if (serveDateFilter === "Date Descending") {
        filter = postList.sort(
          (a, b) => new Date(b.acf.closing_date) - new Date(a.acf.closing_date)
        );
      }
      setPostList(filter);
    }
  };

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
      );
    };

    const ServeFilters = () => {
      const ServeTitle = () => {
        return (
          <div
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

  // RETURN ---------------------------------------------------
  return (
    <div
      style={{
        padding: `${marginVertical}px ${marginHorizontal}px`,
        backgroundColor: colors.silverFillOne,
      }}
    >
      <TitleBlock block={{ title, text_align }} disableMargin />
      <ServeFilter />
      <div style={styles.container}>
        {postList.map((block, key) => {
          const { categories, title, content, excerpt, link } = block;
          const { press_release_authors } = block.acf;
          const filter = category.filter(
            (item) => item.id === Number(categories[0])
          );
          const categoryName = filter[0].name;

          // search filter options --------------------------------
          if (searchFilter) {
            if (
              // !title.rendered
              //   .toLowerCase()
              //   .includes(searchFilter.toLowerCase()) &&
              // !description.toLowerCase().includes(searchFilter.toLowerCase())
              console.log(searchFilter)
            )
              return null;
          }
          // select filtering config
          if (dateFilter) {
            const date = new Date();
            const electionDate = new Date(closing_date);
            if (date >= electionDate) return null;
          }

          const news_card = {};

          if (layout === "layout_one") return null;
          // return (
          //   <div key={key}>
          //     <NewsCarousel block={news_card} />
          //   </div>
          // );

          if (layout === "layout_two")
            return (
              <div key={key}>
                <Card
                  link_label="Read More"
                  link={link}
                  newsAndMediaInfo={block}
                  colour={
                    press_release_authors
                      ? press_release_authors[0].colour
                      : null
                  }
                  limitBodyLength
                  cardHeight="100%"
                  layout={layout}
                />
              </div>
            );

          if (layout === "layout_three")
            return (
              <div key={key}>
                <Card
                  title={categoryName}
                  body={excerpt.rendered}
                  link_label="Read More"
                  link={link}
                  newsAndMediaInfo={block}
                  colour={
                    press_release_authors
                      ? press_release_authors[0].colour
                      : null
                  }
                  limitBodyLength
                  cardHeight="100%"
                />
              </div>
            );
        })}
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: "grid",
    gridTemplateColumns: `repeat(4, 1fr)`,
    gap: 20,
  },
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

export default connect(NewsAndMedia);
