import React from "react";
import { connect } from "frontity";
import { colors } from "../config/colors";

import Accordion from "react-bootstrap/Accordion";
import Card from "react-bootstrap/Card";
import BlockWrapper from "./blockWrapper";
import { useAccordionButton } from "react-bootstrap/AccordionButton";
import { handleGetCookie } from "../helpers/cookie";
import { useAppState, authenticateAppAction, useAppDispatch } from "../context";
import MapsComponent from "./maps/maps";
import Loading from "./loading";
import { grid } from "@mui/system";
const FindADermatologist = ({ state }) => {
  const marginVertical = state.theme.marginVertical;
  const marginHorizontal = state.theme.marginHorizontal;
  let MARGIN = `${marginVertical}px ${marginHorizontal}px`;

  const [query, setQuery] = React.useState();

  const [filteredDermatologists, setFilteredDermatologists] = React.useState();
  const dispatch = useAppDispatch();
  const query_limit = React.useRef(10);
  React.useEffect(async () => {
    const fetchDermatologistsByPostCode = async () => {
      const jwt = await authenticateAppAction({ dispatch, state });
      console.log("QUERY VALUE POSTCODE", query);
      const post_code = query.value.split(" ").join("");
      console.log(post_code);
      const url = state.auth.APP_HOST + "/catalogue/fad/" + post_code;
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

        setFilteredDermatologists(data);
      }
    };
    if (query && query.type === "pc") fetchDermatologistsByPostCode();
    if (query && query.type === "name")
      alert("I wish this function was implemented!");
  }, [query]);

  const handleLoadMore = async () => {
    const jwt = await authenticateAppAction({ dispatch, state });
    const post_code = query.value.split(" ").join("");
    const url =
      state.auth.APP_HOST +
      "/catalogue/fad/" +
      post_code +
      `?limit=10&skip=${query_limit}`;
    const more = await fetch(url, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });

    if (more.ok) {
      const json = await more.json();

      setFilteredDermatologists((filteredDermatologists) => [
        ...filteredDermatologists,
        json.data,
      ]);
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
      return (
        <div className="flex-row">
          <div className="caps-btn">View more</div>
        </div>
      );
    };
    return (
      <div style={styles.dermatologistContainer}>
        <div className="primary-title" style={styles.number}>
          {id + 1}
        </div>
        <div style={{ padding: 20 }}>
          <ServeHeadline />
          <ServeDistance />
          <ServeAddress />
          <ServeActions />
        </div>
      </div>
    );
  };
  function CustomToggle({ children, eventKey }) {
    const decoratedOnClick = useAccordionButton(eventKey, () =>
      console.log("totally custom!")
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
        <div className="primary-title" style={{ fontSize: "2.25rem" }}>
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
      if (!derm.distance) return null;
      const ServeBiography = () => {
        if (!derm.bad_findadermatologisttext) return null;
        return <div>{derm.bad_findadermatologisttext}</div>;
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
          <div>
            <div className="primary-title">Private Practice Links</div>
            <div className="menu-title">{derm.bad_web1}</div>
            <div className="menu-title">{derm.bad_web2}</div>
            <div className="menu-title">{derm.bad_web3}</div>
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
                <div>
                  <ServeEmail />
                  <ServeBiography />
                  <ServeUrls />
                </div>
              </div>
            </Card.Body>
          </Accordion.Collapse>
        </Card>
      );
    };
    return (
      <>
        <Accordion style={{ border: 0 }}>
          {filteredDermatologists.map((derm, key) => {
            console.log("DERM!", derm);
            return <SingleDerm derm={derm} id={key} key={key} />;
          })}
        </Accordion>
        <div
          className="blue-btn"
          onClick={() => {
            query_limit.current += 10;
            handleLoadMore();
            console.log("QUERY_LIMIT", query_limit.current);
          }}
        >
          Load more ({query_limit.current})
        </div>
      </>
    );
  };
  const ServeMap = () => {
    return (
      <div style={{ height: 300 }}>
        <MapsComponent markers={filteredDermatologists} />
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
        You searched for {query.value.toUpperCase()}
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
  },
};
export default connect(FindADermatologist);
