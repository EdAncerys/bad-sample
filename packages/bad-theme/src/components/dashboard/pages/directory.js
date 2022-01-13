import { useState, useEffect } from "react";
import { connect } from "frontity";

import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";

import Loading from "../../loading";
import { colors } from "../../../config/colors";

// BLOCK WIDTH WRAPPER -------------------------------------------------------
import BlockWrapper from "../../blockWrapper";
// CONTEXT ----------------------------------------------------------------
import { useAppDispatch, useAppState, fadDataAction } from "../../../context";

const Membership = ({ state, actions, libraries, dashboardPath }) => {
  const dispatch = useAppDispatch();
  const { fad } = useAppState();

  const [searchFilter, setSearchFilter] = useState(null);
  const [fadData, setFadData] = useState(fad);

  const marginHorizontal = state.theme.marginHorizontal;
  const marginVertical = state.theme.marginVertical;
  const ctaHeight = 45;

  if (dashboardPath !== "Membership") return null;

  // DATA pre FETCH ----------------------------------------------------------------
  useEffect(async () => {
    // fetch data via API
    await fadDataAction({ dispatch });
  }, []);

  if (!fad) return <Loading />; // awaits data

  const ServeFadList = ({ item }) => {
    const {} = item;

    return (
      <div>
        <div>
          {/* <Html2React html={title} /> */}
          hello
        </div>
      </div>
    );
  };

  // HELPERS ----------------------------------------------------------------
  const handleSearchFilter = () => {
    const searchInput = document.querySelector(`#searchDirectoryInput`).value;
    const INPUT = searchInput.toLowerCase();
    // const filter = fadData.filter((fad) =>
    //   fad.title.toLowerCase().includes(INPUT)
    // );
    // setFadData(filter);
    setSearchFilter(searchInput);
  };

  // SERVERS --------------------------------------------------------
  const ServeFilter = () => {
    const ServeTitle = () => {
      return (
        <div
          className="flex primary-title"
          style={{
            fontSize: 36,
            color: colors.softBlack,
            alignItems: "center",
          }}
        >
          Directory
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
                  id={`searchDirectoryInput`}
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

  // SERVERS ---------------------------------------------
  const Directory = () => {
    return (
      <div style={{ padding: `0 ${marginHorizontal}px` }}>
        <ServeFilter />
        <BlockWrapper>
          <div style={{ margin: `${marginVertical}px ${marginHorizontal}px` }}>
            <div style={styles.container}>
              {fadData.map((item, key) => {
                return <ServeFadList key={key} item={item} />;
              })}
            </div>
          </div>
        </BlockWrapper>
      </div>
    );
  };

  // RETURN ---------------------------------------------
  return (
    <div>
      <Directory />
    </div>
  );
};

const styles = {
  container: {
    display: "grid",
    gridTemplateColumns: `repeat(3, 1fr)`,
    gap: 20,
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

export default connect(Membership);
