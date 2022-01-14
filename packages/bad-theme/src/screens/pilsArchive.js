import { useState, useEffect, useRef } from "react";
import { connect, styled } from "frontity";
import { v4 as uuidv4 } from "uuid";

import Loading from "../components/loading";
import { colors } from "../config/imports";
import { setGoToAction } from "../context";

import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
// BLOCK WIDTH WRAPPER -------------------------------------------------------
import BlockWrapper from "../components/blockWrapper";

const PilsArchive = ({ state, actions, libraries }) => {
  const Html2React = libraries.html2react.Component; // Get the component exposed by html2react.

  const [searchFilter, setSearchFilter] = useState(null);
  const [pilList, setPilList] = useState([]);
  const mountedRef = useRef(true);

  const marginHorizontal = state.theme.marginHorizontal;
  const marginVertical = state.theme.marginVertical;
  const ctaHeight = 45;
  const data = state.source.get(state.router.link);
  const { totalPages, page, next } = data; // check if data have multiple pages
  // console.log("pageData ", data); // debug

  const id = uuidv4();

  // DATA pre FETCH ----------------------------------------------------------------
  useEffect(async () => {
    // fetch data via wp API page by page
    let isThereNextPage = next;
    while (isThereNextPage) {
      await actions.source.fetch(isThereNextPage); // fetch next page
      const nextPage = state.source.get(isThereNextPage).next; // check ifNext page & set next page
      isThereNextPage = nextPage;
    }
    setPilList(Object.values(state.source.pils)); // add pill object to data array

    return () => {
      mountedRef.current = false; // clean up function
    };
  }, []);
  // DATA pre FETCH ----------------------------------------------------------------

  if (!pilList.length) return <Loading />;

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
  const handleSearchFilter = () => {
    const searchInput = document.querySelector(`#searchInput${id}`).value;
    if (!!searchInput) {
      const INPUT = searchInput.toLowerCase();
      const filter = pilList.filter((pil) =>
        pil.title.rendered.toLowerCase().includes(INPUT)
      );
      setSearchFilter(searchInput);
      setPilList(filter);
    }
  };

  // SERVERS --------------------------------------------------------
  const ServePilsList = ({ item }) => {
    const ServePil = ({ pil }) => {
      const { link, title } = pil;
      if (!title.rendered) return null;
      if (item !== title.rendered[0] && isNaN(title.rendered[0])) return null;
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
            fontSize: 36,
            fontWeight: "bold",
            borderBottom: `1px solid ${colors.darkSilver}`,
          }}
        >
          {item}
        </div>
        <div style={{ padding: `1em 0` }}>
          {pilList.map((pil, key) => {
            if (searchFilter) {
              if (
                !pil.title.rendered
                  .toLowerCase()
                  .includes(searchFilter.toLowerCase())
              )
                return null;
            }

            return <ServePil key={key} pil={pil} />;
          })}
        </div>
      </div>
    );
  };

  const ServeInfo = () => {
    const ServeTitle = () => {
      return (
        <div
          className="flex primary-title"
          style={{
            fontSize: 36,
            color: colors.softBlack,
            fontWeight: "bold",
            alignItems: "center",
          }}
        >
          Search for Patient Information Leaflets
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

  const ServeFilter = () => {
    const ServeTitle = () => {
      return (
        <div
          className="flex primary-title"
          style={{
            fontSize: 36,
            color: colors.softBlack,
            fontWeight: "bold",
            alignItems: "center",
          }}
        >
          Search for Patient Information Leaflets
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
              setPilList(Object.values(state.source.pils));
            }}
          >
            <CloseIcon />
          </div>
        </div>
      );
    };

    return (
      <div style={{ backgroundColor: colors.silverFillTwo }}>
        <BlockWrapper>
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
                className="flex search-input"
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
                  placeholder="Find PIL"
                  style={styles.input}
                />
                <span
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
                  onClick={handleSearchFilter}
                >
                  Search
                </button>
              </div>
            </div>

            <div className="flex" style={{ padding: "0.5em 0 1em" }}>
              <ServeSearchFilter />
            </div>
          </div>
        </BlockWrapper>
      </div>
    );
  };

  // RETURN ----------------------------------------------------------------
  return (
    <div>
      <BlockWrapper>
        <ServeInfo />
      </BlockWrapper>
      <ServeFilter />
      <BlockWrapper>
        <div style={{ margin: `${marginVertical}px ${marginHorizontal}px` }}>
          <div style={styles.container}>
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
  action: {
    position: "absolute",
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
  input: {
    borderRadius: 10,
  },
};

export default connect(PilsArchive);
