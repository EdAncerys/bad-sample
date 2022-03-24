import { useState, useEffect, useRef } from "react";
import { connect } from "frontity";

import CloseIcon from "@mui/icons-material/Close";
import Loading from "../../loading";
import { colors } from "../../../config/colors";
import Card from "../../card/card";
import SearchContainer from "../../searchContainer";
import ActionPlaceholder from "../../actionPlaceholder";
import ScrollTop from "../../../components/scrollTop";
// BLOCK WIDTH WRAPPER -------------------------------------------------------
import BlockWrapper from "../../blockWrapper";
// CONTEXT -------------------------------------------------------------------
import {
  useAppDispatch,
  useAppState,
  getFadAction,
  muiQuery,
  setFadAction,
  updateProfileAction,
  setErrorAction,
} from "../../../context";

const Directory = ({ state, actions, libraries }) => {
  const dispatch = useAppDispatch();
  const { fad, dashboardPath, isActiveUser, dynamicsApps } = useAppState();

  const postLimit = 20;

  const [searchFilter, setSearchFilter] = useState(null);
  const [fadData, setFadData] = useState([]);
  const [page, setPage] = useState(0);
  const [isFetching, setIsFetching] = useState(null);
  const [isGetMore, setGetMore] = useState(null);

  const searchFilterRef = useRef(null);
  const marginHorizontal = state.theme.marginHorizontal;
  const marginVertical = state.theme.marginVertical;

  const { sm, md, lg, xl } = muiQuery();

  // DATA pre FETCH ------------------------------------------------------------
  useEffect(async () => {
    if (!fad) {
      // fetch data via API
      const data = await getFadAction({ state, dispatch });
      // set fad data in context of app
      setFadAction({ dispatch, fad: data });
      setFadData(data);
    } else {
      setFadData(fad);
    }

    return () => {
      searchFilterRef.current = null; // clean up function
    };
  }, []);

  // HANDLERS -------------------------------------------------------------------
  const handlePreferenceUpdate = async () => {
    if (!isActiveUser) return;
    const data = Object.assign(
      {}, // add empty object
      { bad_memberdirectory: !isActiveUser.bad_memberdirectory }
    );
    console.log("data", data); // debug

    try {
      setIsFetching(true);
      // API call to update profile preferences
      const response = await updateProfileAction({
        state,
        dispatch,
        data,
        isActiveUser,
      });
      if (!response) throw new Error("Error updating profile");

      // display error message
      setErrorAction({
        dispatch,
        isError: {
          message: `Members directory preferences updated successfully`,
        },
      });
    } catch (error) {
      console.log(error);
      setErrorAction({
        dispatch,
        isError: {
          message: `Failed to update members directory preferences. Please try again.`,
          image: "Error",
        },
      });
    } finally {
      setIsFetching(false);
    }
  };

  const handleClearSearchFilter = () => {
    setSearchFilter(null);
    searchFilterRef.current = null;

    setFadData(fad.slice(0, Number(postLimit)));
  };

  const handleSearch = () => {
    const input = searchFilterRef.current.value.toLowerCase();
    let data = fad;

    if (!!input) {
      data = data.filter((item) => {
        let fullname = item.fullname;
        let email = item.emailaddress1;
        let hospitalName =
          item[
            "_parentcustomerid_value@OData.Community.Display.V1.FormattedValue"
          ];

        if (fullname) fullname = fullname.toLowerCase().includes(input);
        if (email) email = email.toLowerCase().includes(input);
        if (hospitalName)
          hospitalName = hospitalName.toLowerCase().includes(input);

        return fullname || email || hospitalName;
      });
    }

    setFadData(data);
    setSearchFilter(input);
  };

  const handleLoadMore = async () => {
    try {
      setGetMore(true);

      const data = await getFadAction({ state, dispatch, page });
      // set fad data in context of app
      setFadAction({ dispatch, fad: data });
      // increment page iteration counter
      setPage(page + 1);
      // set fad data in context of app
      setFadData([...fadData, ...data]);
    } catch (error) {
      console.log(error);
      setErrorAction({
        dispatch,
        isError: {
          message: `Failed to load more members. Please try again.`,
          image: "Error",
        },
      });
    } finally {
      setGetMore(false);
    }
  };

  if (dashboardPath !== "Members' Directory") return null; // call after all React hooks
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
              title="Members' Directory"
              subTitle="Search either by name or main place of work to find contact details of colleagues who have opted in to this service"
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
    if (isGetMore) return <Loading />;

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
          onClick={handleLoadMore}
        >
          Load More
        </button>
      </div>
    );
  };

  const ServePreferences = () => {
    if (!isActiveUser) return null;

    // directory agreement field for user
    const { bad_memberdirectory } = isActiveUser;
    // check if user have BAD memberships approved in dynamics apps
    let isBADMember = false;
    if (dynamicsApps) {
      let badApps = dynamicsApps.subs.data.filter((app) => {
        let hasBADMemberships = app.bad_organisedfor === "BAD";

        return hasBADMemberships;
      });
      if (badApps.length) isBADMember = true;
    }
    // dont display action if user is not BAD member
    // console.log("isBADMember", isBADMember); // debug
    if (!isBADMember) return null;

    return (
      <div style={{ position: "relative", margin: `0 ${marginHorizontal}px` }}>
        <ActionPlaceholder
          isFetching={isFetching}
          background="transparent"
          bottom="-30px"
          height="auto"
        />
        <div
          className="blue-btn"
          style={{
            marginRight: "1em",
            width: "fit-content",
            backgroundColor: isActiveUser.bad_memberdirectory
              ? colors.danger
              : colors.white,
          }}
          onClick={handlePreferenceUpdate}
        >
          {bad_memberdirectory ? "Opt-out" : "Opt-in"}
        </div>
      </div>
    );
  };

  // RETURN ---------------------------------------------
  return (
    <div>
      <ServeFilter />
      <BlockWrapper>
        <ServePreferences />
        <div style={{ margin: `${marginVertical}px ${marginHorizontal}px` }}>
          <div style={!lg ? styles.container : styles.containerMobile}>
            {fadData.map((fad, key) => {
              return <ServeFadList key={key} fad={fad} />;
            })}
          </div>
          <ServeMoreAction />
          {fadData.length > 15 && <ScrollTop />}
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
