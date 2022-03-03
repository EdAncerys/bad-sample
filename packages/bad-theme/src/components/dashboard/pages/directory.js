import { useState, useEffect, useRef } from "react";
import { connect } from "frontity";

import CloseIcon from "@mui/icons-material/Close";

import Loading from "../../loading";
import { colors } from "../../../config/colors";
import Card from "../../card/card";
import SearchContainer from "../../searchContainer";

// BLOCK WIDTH WRAPPER -------------------------------------------------------
import BlockWrapper from "../../blockWrapper";
// CONTEXT -------------------------------------------------------------------
import {
  useAppDispatch,
  useAppState,
  getFadAction,
  muiQuery,
} from "../../../context";

const Directory = ({ state, actions, libraries }) => {
  const dispatch = useAppDispatch();
  const { fad, dashboardPath } = useAppState();

  const LIMIT = 9;

  const [searchFilter, setSearchFilter] = useState(null);
  const [fadData, setFadData] = useState(null);

  const searchFilterRef = useRef(null);
  const loadMoreRef = useRef(null);
  const marginHorizontal = state.theme.marginHorizontal;
  const marginVertical = state.theme.marginVertical;

  const { sm, md, lg, xl } = muiQuery();

  // DATA pre FETCH ------------------------------------------------------------
  useEffect(async () => {
    if (!fad) {
      // fetch data via API
      const data = await getFadAction({ state, dispatch });
      setFadData(data.slice(0, Number(LIMIT)));
    } else {
      setFadData(fad.slice(0, Number(LIMIT)));
    }

    return () => {
      searchFilterRef.current = null; // clean up function
    };
  }, [fad]);

  // HANDLERS -------------------------------------------------------------------
  const handleClearSearchFilter = () => {
    setSearchFilter(null);
    searchFilterRef.current = null;

    setFadData(fad.slice(0, Number(LIMIT)));
  };

  const handleSearch = () => {
    const input = searchFilterRef.current.value.toLowerCase();
    let data = fad;

    if (!!input) {
      data = data.filter((item) => {
        let fullname = item.fullname;
        let email = item.emailaddress1;

        if (fullname) fullname = fullname.toLowerCase().includes(input);
        if (email) email = email.toLowerCase().includes(input);

        return fullname || email;
      });
    }

    setFadData(data);
    setSearchFilter(input);
  };

  const handleLoadMoreFilter = async () => {
    if (fadData.length < LIMIT) return;
    let data = fad;

    if (!loadMoreRef.current) {
      loadMoreRef.current = data;
      setFadData(data);
      console.log(loadMoreRef.current.length);
    } else {
      setFadData(loadMoreRef.current.slice(0, Number(LIMIT)));
      loadMoreRef.current = null;
      console.log(loadMoreRef.current);
    }
  };

  if (dashboardPath !== "Members Directory") return null; // call after all React hooks
  if (!fadData) return <Loading />; // awaits data

  // SERVERS --------------------------------------------------------
  const ServeFadList = ({ fad }) => {
    return <Card fadDirectory={fad} colour={colors.primary} shadow />;
  };

  const ServeFilter = () => {
    const ServeSearchFilter = () => {
      if (!searchFilter) return null;

      return (
        <div className="shadow filter">
          <div>{searchFilter}</div>
          <div className="filter-icon" onClick={handleClearSearchFilter}>
            <CloseIcon />
          </div>
        </div>
      );
    };

    return (
      <div
        style={{
          backgroundColor: colors.silverFillTwo,
          marginBottom: `${state.theme.marginVertical}px`,
        }}
        className="no-selector"
      >
        <BlockWrapper>
          <div style={{ padding: `0 ${marginHorizontal}px` }}>
            <SearchContainer
              title="Members Directory"
              width={!lg ? "70%" : "100%"}
              searchFilterRef={searchFilterRef}
              handleSearch={handleSearch}
            />
            <div className="flex" style={{ margin: "0.5em 0" }}>
              <ServeSearchFilter />
            </div>
          </div>
        </BlockWrapper>
      </div>
    );
  };

  const ServeMoreAction = () => {
    if (searchFilter || fadData.length < LIMIT) return null;

    const value = loadMoreRef.current ? "Less" : "Load More";

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
          onClick={handleLoadMoreFilter}
        >
          {value}
        </button>
      </div>
    );
  };

  // RETURN ---------------------------------------------
  return (
    <div>
      <ServeFilter />
      <BlockWrapper>
        <div style={{ margin: `${marginVertical}px ${marginHorizontal}px` }}>
          <div style={!lg ? styles.container : styles.containerMobile}>
            {fadData.map((fad, key) => {
              return <ServeFadList key={key} fad={fad} />;
            })}
          </div>
          <ServeMoreAction />
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
    gridTemplateColumns: `repeat(1, 1fr)`,
    gap: 20,
  },
  input: {
    borderRadius: 10,
  },
};

export default connect(Directory);
