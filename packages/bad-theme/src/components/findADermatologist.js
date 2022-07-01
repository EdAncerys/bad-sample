import { useState, useEffect, useRef, useContext } from "react";
import { connect } from "frontity";
import { colors } from "../config/colors";

import Accordion from "react-bootstrap/Accordion";
import Card from "react-bootstrap/Card";
import BlockWrapper from "./blockWrapper";
import { useAccordionButton } from "react-bootstrap/AccordionButton";
import AccordionContext from "react-bootstrap/AccordionContext";
import MapsComponent from "./maps/maps";
import Loading from "./loading";
// CONTEXT --------------------------------------------------------------------------
import {
  useAppState,
  useAppDispatch,
  fetchDataHandler,
  setErrorAction,
} from "../context";

const FindADermatologist = ({ state, block }) => {
  const marginVertical = state.theme.marginVertical;
  const marginHorizontal = state.theme.marginHorizontal;
  let MARGIN = `${marginVertical}px ${marginHorizontal}px`;

  const dispatch = useAppDispatch();

  const [query, setQuery] = useState();
  const [pc, setPC] = useState("");
  const [name, setName] = useState("");

  const [filteredDermatologists, setFilteredDermatologists] = useState();
  const [loading, setLoading] = useState(true);
  const [dermOnFocus, setDermOnFocus] = useState(null);
  const query_limit = useRef(5);
  const enough = useRef(false);
  let crutent = 0;

  // HANDLERS ------------------------------------------------------------------------

  const handleSearchByPostcode = () => {
    let isPostcode = pc;
    console.log("🐞 postcode ", pc);

    // validate postocode format
    isPostcode = isPostcode.replace(/\s/g, "");
    const regex = /^[A-Z]{1,2}[0-9]{1,2} ?[0-9][A-Z]{2}$/i;
    isPostcode = regex.test(isPostcode);

    // display error message if postoce is not valid
    if (isPostcode) {
      setQuery({
        type: "pc",
        value: pc,
      });
      return;
    }

    let message = `Postcode ${pc} is not valid. Please enter valid postoced & try again.`;
    if (!pc.length) message = "Please enter valid postoced & try again.";

    setErrorAction({
      dispatch,
      isError: {
        message: message,
        image: "Error",
      },
    });
  };

  const handleSearchByName = () => {
    // display error message if name is not valid
    if (name.length) {
      setQuery({
        type: "name",
        value: name,
      });
      return;
    }

    let message = `Please enter name & try again.`;

    setErrorAction({
      dispatch,
      isError: {
        message: message,
        image: "Error",
      },
    });
  };

  const handleFocusOnThePostCode = async () => {
    const path = state.auth.APP_HOST + "/catalogue/ukpostcode/" + query.value;
    const post_code = await fetchDataHandler({ path, state });

    if (post_code.ok) {
      const json = await post_code.json();
      setDermOnFocus({
        lat: Number(json.data.location.lattitude),
        lng: Number(json.data.location.longitude),
      });
    }
  };

  const fetchDermatologistsByPostCode = async () => {
    const post_code = query.value.split(" ").join("");
    const url =
      state.auth.APP_HOST +
      "/catalogue/md/" +
      post_code +
      `?limit=${query_limit.current}`;
    const fetching = await fetchDataHandler({ path: url, state });

    if (fetching && fetching.ok) {
      const json = await fetching.json();
      const data = json.data;
      const result = data.reduce((acc, derm) => {
        return {
          ...acc,
          [derm.address3_postalcode]: [derm],
        };
      }, {});
      setDermOnFocus({
        lat: Number(data[0].cordinates.lat),
        lng: Number(data[0].cordinates.lng),
      });
      setFilteredDermatologists(data);
      handleFocusOnThePostCode();
    }
  };

  const fetchDermatologistsByName = async () => {
    const url = state.auth.APP_HOST + "/catalogue/md";
    const fetching = await fetchDataHandler({ path: url, state });

    if (fetching.ok) {
      const json = await fetching.json();
      const data = json.data;
      const regex = new RegExp(query.value, "gi");

      const filteredData = data.filter((item) => {
        let fullname = item.fullname;

        // break if fullname is not found or valid
        if (!fullname) return false;

        return fullname.match(regex);
      });

      setFilteredDermatologists(filteredData);
    }
  };

  useEffect(async () => {
    if (query && query.type === "pc") fetchDermatologistsByPostCode();
    if (query && query.type === "name") fetchDermatologistsByName();
    setLoading(false);
  }, [query]);

  const handleLoadMore = async () => {
    setLoading(true);
    const post_code = query.value.split(" ").join("");
    const url =
      state.auth.APP_HOST +
      "/catalogue/md/" +
      post_code +
      `?limit=5&skip=${query_limit.current}`;
    const more = await fetchDataHandler({ path: url, state });

    if (more.ok) {
      const json = await more.json();
      if (json.data.length === 0) enough.current = true;
      setFilteredDermatologists((filteredDermatologists) => [
        ...filteredDermatologists,
        ...json.data,
      ]);
      query_limit.current += 10;
      setLoading(false);
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
      return (
        <div>
          {derm.address3_line1} {derm.address3_line2}, {derm.address3_city}{" "}
          {derm.address3_postalcode}
        </div>
      );
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
      const { activeEventKey } = useContext(AccordionContext);

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
    const { activeEventKey } = useContext(AccordionContext);

    const decoratedOnClick = useAccordionButton(
      eventKey,
      () => callback && callback(eventKey)
    );

    return <div onClick={decoratedOnClick}>{children}</div>;
  }

  const ServeAccordionListOfDerms = () => {
    if (!query) return null;
    if (!filteredDermatologists) return <Loading />;

    const SingleDerm = ({ derm, id, key2 }) => {
      console.log("🐞 ", derm); // debug

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

      const ServeAddress = () => {
        if (!derm.address3_line1) return null;

        return (
          <div className="primary-title mb-2" style={{ color: colors.navy }}>
            <div className="primary-title">Hospital / Practice address</div>
            <div>
              {derm.address3_line1 && <p>{derm.address3_line1}</p>}
              {derm.address3_line2 && <p>{derm.address3_line2}</p>}
              <p>
                {derm.address3_city} {derm.address3_postalcode}
              </p>
            </div>
          </div>
        );
      };

      const ServeUrls = () => {
        if (!derm.bad_web1 && !derm.bad_web2 && !derm.bad_web3) return null;

        return (
          <div style={{ marginTop: 20 }}>
            <div className="primary-title">Private Practice Links</div>
            {derm.bad_web1 && (
              <div className="menu-title">
                <a href={derm.bad_web1} target="_blank">
                  {derm.bad_web1}
                </a>
              </div>
            )}
            {derm.bad_web2 && (
              <div className="menu-title">
                <a href={derm.bad_web2} target="_blank">
                  {derm.bad_web2}
                </a>
              </div>
            )}
            {derm.bad_web3 && (
              <div className="menu-title">
                <a href={derm.bad_web3} target="_blank">
                  {derm.bad_web3}
                </a>
              </div>
            )}
          </div>
        );
      };

      const ServeShowOnMap = () => {
        return (
          <div className="flex-row mt-2" style={{ alignItems: "flex-end" }}>
            <div
              className="caps-btn"
              onClick={() => {
                console.log("🐞 ", derm, derm.cordinates); // debug

                setDermOnFocus({
                  lat: Number(derm.cordinates.lat),
                  lng: Number(derm.cordinates.lng),
                });
              }}
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
          key={key2}
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
                <div style={{ padding: 10 }}>
                  <ServeAddress />
                  <ServeBiography />
                  <ServeShowOnMap />
                  <ServeUrls />
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
            if (
              (key > 0 && !derm.distance) ||
              (key > 0 &&
                derm.address3_postalcode !==
                  filteredDermatologists[key - 1].address3_postalcode)
            ) {
              crutent += 1;
            }
            return <SingleDerm derm={derm} id={crutent} key={key} key2={key} />;
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

  const ServeYouSearched = () => {
    if (!query) return null;
    return (
      <div
        className="primary-title"
        style={{ fontSize: 24, marginTop: 10, marginBottom: 10 }}
      >
        You searched for "{query.value.toUpperCase()}"
      </div>
    );
  };

  return (
    <div>
      <BlockWrapper background={colors.silver}>
        <div
          style={{
            backgroundColor: colors.silver,
            padding: MARGIN,
          }}
        >
          <div
            className="primary-title"
            style={{ fontSize: "2.25rem", marginBottom: 20 }}
          >
            Search for dermatologists
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "2em",
            }}
          >
            <div className="flex-row">
              <input
                type="text"
                placeholder="Postcode"
                className="form-control"
                onChange={(e) => setPC(e.target.value)}
                value={pc}
              />
              <div
                className="blue-btn"
                disabled={!pc}
                style={{ marginLeft: "2em" }}
                onClick={handleSearchByPostcode}
              >
                Search
              </div>
            </div>

            <div className="flex-row">
              <div className="flex-row">
                <input
                  type="text"
                  placeholder="Search by Name"
                  onChange={(e) => setName(e.target.value)}
                  value={name}
                  className="form-control"
                />
                <div
                  className="blue-btn"
                  style={{ marginLeft: "2em" }}
                  onClick={handleSearchByName}
                >
                  Search
                </div>
              </div>
            </div>
          </div>
        </div>
      </BlockWrapper>
      <BlockWrapper>
        <ServeYouSearched />
        <div style={{ height: 300, marginTop: 20, marginBottom: 20 }}>
          <MapsComponent
            markers={filteredDermatologists}
            center={!!dermOnFocus}
            zoom={!!dermOnFocus ? 14 : 10}
            queryType={query ? query.type : null}
          />
        </div>
        <ServeAccordionListOfDerms />
      </BlockWrapper>
    </div>
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
