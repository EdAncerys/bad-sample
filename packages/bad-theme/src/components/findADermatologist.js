import React from "react";
import { connect } from "frontity";
import { colors } from "../config/colors";

import Accordion from "react-bootstrap/Accordion";
import Card from "react-bootstrap/Card";
import BlockWrapper from "./blockWrapper";
import { useAccordionButton } from "react-bootstrap/AccordionButton";
import AccordionContext from "react-bootstrap/AccordionContext";
import { handleGetCookie } from "../helpers/cookie";
import { useAppState, authenticateAppAction, useAppDispatch } from "../context";
import MapsComponent from "./maps/maps";
import Loading from "./loading";
import { grid } from "@mui/system";
const FindADermatologist = ({ state, block }) => {
  const marginVertical = state.theme.marginVertical;
  const marginHorizontal = state.theme.marginHorizontal;
  let MARGIN = `${marginVertical}px ${marginHorizontal}px`;

  const [query, setQuery] = React.useState();

  const [filteredDermatologists, setFilteredDermatologists] = React.useState();
  const [loading, setLoading] = React.useState(true);
  const [dermOnFocus, setDermOnFocus] = React.useState(null);
  const dispatch = useAppDispatch();
  const query_limit = React.useRef(5);
  const enough = React.useRef(false);
  const mapCentre = React.useRef(null);
  React.useEffect(async () => {
    const fetchDermatologistsByPostCode = async () => {
      const jwt = await authenticateAppAction({ dispatch, state });
      console.log("QUERY VALUE POSTCODE", query);
      const post_code = query.value.split(" ").join("");
      console.log(post_code);
      const url =
        state.auth.APP_HOST +
        "/catalogue/fad/" +
        post_code +
        `?limit=${query_limit.current}`;
      console.log("JWT", jwt);
      console.log("URL", url);
      const fetching = await fetch(url, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });
      if (fetching.ok) {
        const json = await fetching.json();
        console.log("JSON", json);
        const data = json.data;
        console.log("DATERO", data);
        setFilteredDermatologists(data);
      }
    };
    const fetchDermatologistsByName = async () => {
      const jwt = await authenticateAppAction({ dispatch, state });

      const url = state.auth.APP_HOST + "/catalogue/fad";
      const fetching = await fetch(url, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });

      if (fetching.ok) {
        const json = await fetching.json();

        const data = json.data;
        const regex = new RegExp(query.value, "gi");

        const filteredData = data.filter((item) => item.fullname.match(regex));
        console.log("FILTERED", filteredData);
        setFilteredDermatologists(filteredData);
      }
    };

    if (query && query.type === "pc") fetchDermatologistsByPostCode();
    if (query && query.type === "name") fetchDermatologistsByName();
    setLoading(false);
  }, [query]);

  const handleLoadMore = async () => {
    setLoading(true);
    const jwt = await authenticateAppAction({ dispatch, state });
    const post_code = query.value.split(" ").join("");
    const url =
      state.auth.APP_HOST +
      "/catalogue/fad/" +
      post_code +
      `?limit=5&skip=${query_limit.current}`;
    console.log("URL_LOADMORE", url);
    const more = await fetch(url, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });

    if (more.ok) {
      const json = await more.json();
      console.log(json.data);
      if (json.data.length === 0) enough.current = true;
      setFilteredDermatologists((filteredDermatologists) => [
        ...filteredDermatologists,
        ...json.data,
      ]);
      query_limit.current += 10;
      setLoading(false);
      console.log(filteredDermatologists);
    }
  };
  const CardHeader = ({ derm, id }) => {
    const ServeHeadline = () => {
      return (
        <div className="primary-title" style={{ fontSize: 20 }}>
          {derm.firstname + " " + derm.lastname}
        </div>
      );
    };
    const ServeAddress = () => {
      return <div>{derm.address1_composite}</div>;
    };
    const ServeDistance = () => {
      if (!derm.distance) return null;
      return (
        <div style={{ color: colors.blue, fontStyle: "italic" }}>
          {derm.distanceDisplay} Away
        </div>
      );
    };
    const ServeActions = () => {
      const { activeEventKey } = React.useContext(AccordionContext);

      return (
        <div className="flex-row" style={{ alignItems: "flex-end" }}>
          <div className="caps-btn">
            {activeEventKey === id ? "Show less" : "Show more"}
          </div>
        </div>
      );
    };

    return (
      <div style={styles.dermatologistContainer}>
        <div className="primary-title" style={styles.number}>
          {id + 1}
        </div>
        <div style={{ padding: 20, display: "flex", flexDirection: "column" }}>
          <ServeHeadline />
          <ServeDistance />
          <ServeAddress />
          <ServeActions />
        </div>
      </div>
    );
  };

  function CustomToggle({ children, eventKey, callback }) {
    const { activeEventKey } = React.useContext(AccordionContext);

    const decoratedOnClick = useAccordionButton(
      eventKey,
      () => callback && callback(eventKey)
    );

    return <div onClick={decoratedOnClick}>{children}</div>;
  }
  const ServeSearchOptions = () => {
    const ServeSearchByName = () => {
      const [name, setName] = React.useState("");
      return (
        <div className="flex-row">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setQuery({
                type: "name",
                value: name,
              });
            }}
            className="flex-row"
          >
            <input
              type="text"
              placeholder="Search by Name"
              value={name}
              className="form-control"
              onChange={(e) => {
                setName(e.target.value);
              }}
            />
            <button type="submit" className="blue-btn">
              Search
            </button>
          </form>
        </div>
      );
    };
    const ServeSearchByPostCode = () => {
      const [pc, setPC] = React.useState("");
      return (
        <div className="flex-row">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setQuery({
                type: "pc",
                value: pc,
              });
            }}
            className="flex-row"
          >
            <input
              type="text"
              placeholder="Postcode"
              className="form-control"
              value={pc}
              onChange={(e) => {
                setPC(e.target.value);
              }}
            />
            <button type="submit" className="blue-btn" disabled={!pc && true}>
              Search
            </button>
          </form>
        </div>
      );
    };
    return (
      <div
        style={{
          backgroundColor: colors.silver,
          padding: 10,
          padding: MARGIN,
          marginTop: 20,
        }}
      >
        <div
          className="primary-title"
          style={{ fontSize: "2.25rem", marginBottom: 20 }}
        >
          Search for dermatologists
        </div>
        <div
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}
        >
          <ServeSearchByPostCode />
          <ServeSearchByName />
        </div>
      </div>
    );
  };
  const ServeAccordionListOfDerms = () => {
    if (!query) return null;
    if (!filteredDermatologists) return <Loading />;
    console.log("DERMI", filteredDermatologists);

    const SingleDerm = ({ derm, id }) => {
      if (query.type === "pc" && !derm.distance) return null;
      const ServeBiography = () => {
        if (!derm.bad_findadermatologisttext) return null;
        return (
          <div style={{ marginTop: 20 }}>
            <div className="primary-title">Bio</div>
            {derm.bad_findadermatologisttext}
          </div>
        );
      };

      const ServeEmail = () => {
        return (
          <div className="primary-title" style={{ color: colors.navy }}>
            {derm.emailaddress1}
          </div>
        );
      };

      const ServeUrls = () => {
        if (!derm.bad_web1 && !derm.bad_web2 && !derm.bad_web3) return null;
        return (
          <div style={{ marginTop: 20 }}>
            <div className="primary-title">Private Practice Links</div>
            <div className="menu-title">
              <a href={derm.bad_web1}>{derm.bad_web1}</a>
            </div>
            <div className="menu-title">
              <a href={derm.bad_web2}>{derm.bad_web2}</a>
            </div>
            <div className="menu-title">
              <a href={derm.bad_web3}>{derm.bad_web3}</a>
            </div>
          </div>
        );
      };
      const ServeShowOnMap = () => {
        return (
          <div className="flex-row" style={{ alignItems: "flex-end" }}>
            <div
              className="caps-btn"
              onClick={() =>
                setDermOnFocus({
                  lat: Number(derm.address1_latitude),
                  lng: Number(derm.address1_longitude),
                })
              }
            >
              Show on map
            </div>
          </div>
        );
      };
      return (
        <Card
          style={{
            backgroundColor: colors.lightSilver,
            borderRadius: 0,
            marginTop: 20,
            border: 0,
          }}
        >
          <Card.Header style={{ padding: 0, border: 0 }}>
            <CustomToggle eventKey={id}>
              <CardHeader derm={derm} id={id} />
            </CustomToggle>
          </Card.Header>
          <Accordion.Collapse eventKey={id}>
            <Card.Body>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 4fr",
                  gap: 20,
                }}
              >
                <div></div>
                <div style={{ padding: 10 }}>
                  <ServeEmail />
                  <ServeBiography />
                  <ServeUrls />
                  <ServeShowOnMap />
                </div>
              </div>
            </Card.Body>
          </Accordion.Collapse>
        </Card>
      );
    };

    const ServeLoadMoreButton = () => {
      if (loading) return <Loading />;
      if (query.type === "name" && filteredDermatologists.length > 0)
        return null;
      if (query.type === "name" && filteredDermatologists.length === 0)
        return "No records found with this query";

      if (enough.current) return "There is no more records to show";

      return (
        <div
          className="blue-btn"
          onClick={() => {
            handleLoadMore();
            console.log("QUERY_LIMIT", query_limit.current);
          }}
          style={{ width: 150 }}
        >
          Load more
        </div>
      );
    };
    const ServeInfo = () => {
      if (!query) return null;
      let info = "";
      if (query.type === "name")
        info = "Your query returned the following dermatologists:";
      if (query.type === "pc") info = "Your nearest dermatologists are:";

      return <div className="primary-title">{info}</div>;
    };
    return (
      <>
        <ServeInfo />
        <Accordion style={{ border: 0 }}>
          {filteredDermatologists.map((derm, key) => {
            console.log("DERM!", derm);
            return <SingleDerm derm={derm} id={key} key={key} />;
          })}
        </Accordion>
        <div
          className="d-flex justify-content-center"
          style={{ marginTop: 20, marginBottom: 20 }}
        >
          <ServeLoadMoreButton />
        </div>
      </>
    );
  };
  const ServeMap = () => {
    return (
      <div style={{ height: 300, marginTop: 20, marginBottom: 20 }}>
        <MapsComponent
          markers={filteredDermatologists}
          center={dermOnFocus}
          zoom={dermOnFocus ? 14 : 10}
        />
      </div>
    );
  };
  const ServeYouSearched = () => {
    if (!query) return null;
    return (
      <div
        className="primary-title"
        style={{ fontSize: 25, marginTop: 10, marginBottom: 10 }}
      >
        You searched for "{query.value.toUpperCase()}"
      </div>
    );
  };
  return (
    <BlockWrapper>
      <ServeSearchOptions />
      <ServeYouSearched />
      <ServeMap />
      <ServeAccordionListOfDerms />
    </BlockWrapper>
  );
};
const styles = {
  dermatologistContainer: {
    backgroundColor: colors.lightSilver,
    minHeight: 150,
    display: "grid",
    gridTemplateColumns: "1fr 4fr",
    gap: 20,
    padding: 0,
  },
  number: {
    backgroundColor: "white",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: 40,
    border: `20px ${colors.lightSilver}`,
    borderStyle: "solid",
  },
};
export default connect(FindADermatologist);
