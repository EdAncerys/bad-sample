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

  const [query, setQuery] = useState("");
  const [pc, setPC] = useState("");
  const [name, setName] = useState("");

  const [fadList, setFadList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dermOnFocus, setDermOnFocus] = useState(null);
  const limitRef = useRef(1);
  const skipRef = useRef(1);
  const enough = useRef(false);
  let crutent = 0;

  // HANDLERS ------------------------------------------------------------------------

  const handleSearchByPostcode = () => {
    let isPostcode = false;
    let postcodeInput = pc.replace(/\s/g, "");

    const regex = /^[A-Z]{1,2}[0-9]{1,2} ?[0-9][A-Z]{2}$/i;
    isPostcode = regex.test(postcodeInput);

    // display error message if postoce is not valid
    if (isPostcode) {
      setQuery({
        type: "pc",
        value: pc,
      });
      return;
    }

    let message = `Postcode " ${pc} " is not valid. Please enter valid postoced & try again.`;
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

  const fetchDermatologistsByPostCode = async () => {
    try {
      const post_code = query.value.split(" ").join("");
      console.log("🐞 BYPOSTCODE GET TRIGGERED", post_code); // DEBUG

      const url =
        state.auth.APP_HOST +
        "/catalogue/fad/" +
        post_code +
        `?limit=${limitRef.current}&skip=${skipRef.current}`;
      const fetching = await fetchDataHandler({ path: url, state });

      if (fetching && fetching.ok) {
        const json = await fetching.json();
        const data = json.data;

        console.log("🐞 url", url); // DEBUG
        console.log("🐞 current", skipRef.current); // DEBUG
        console.log("🐞 fadList", fadList); // DEBUG
        console.log("🐞 data", data); // DEBUG
        setFadList((prev) => [...prev, ...data]);

        // apply focus on first dermatologist found in the list
        setDermOnFocus({
          lat: Number(data[0].cordinates.lat),
          lng: Number(data[0].cordinates.lng),
        });
        // increment query skip
        skipRef.current = skipRef.current + 1;
        console.log("🐞 skipRef.current ", skipRef.current);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchDermatologistsByName = async () => {
    try {
      console.log("🐞 BY NAME GET FAD TRIGGERED", query); // DEBUG
      const url = state.auth.APP_HOST + `/catalogue/fad?search=andy`;
      const response = await fetchDataHandler({ path: url, state });

      if (response.success) {
        const data = await response.json();
        // set filtered dermatologists
        setFadList(data.data);
      }
      setFadList(null);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(async () => {
    if (query && query.type === "pc") fetchDermatologistsByPostCode();
    if (query && query.type === "name") fetchDermatologistsByName();
    setLoading(false);
  }, [query]);

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
          {derm.distance} Away
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
    const decoratedOnClick = useAccordionButton(
      eventKey,
      () => callback && callback(eventKey)
    );

    return <div onClick={decoratedOnClick}>{children}</div>;
  }

  const ServeAccordionListOfDerms = () => {
    if (!query) return null;
    if (!fadList) return <Loading />;

    const SingleDerm = ({ derm, id, dermKey }) => {
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
        if (!derm.cordinates) return null;

        return (
          <div className="flex-row mt-2" style={{ alignItems: "flex-end" }}>
            <div
              className="caps-btn"
              onClick={() => {
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
          key={dermKey}
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
      if (query.type === "name" && fadList.length > 0) return null;
      if (query.type === "name" && fadList.length === 0)
        return "No records found with this query";

      if (enough.current) return "There is no more records to show";

      return (
        <div
          className="blue-btn"
          onClick={fetchDermatologistsByPostCode}
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
          {fadList.map((derm, key) => {
            console.log("🐞 ", derm); // debug

            return (
              <SingleDerm derm={derm} id={crutent} key={key} dermKey={key} />
            );
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
            markers={fadList.length > 0 ? fadList : null}
            center={dermOnFocus}
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
