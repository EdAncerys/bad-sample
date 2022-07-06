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
  const [recordPCCount, setPCCount] = useState(null);
  const [recordNameCount, setNameCount] = useState(null);

  const limitRef = useRef(2); // data chunk size
  const skipPCRef = useRef(0);
  const skipNameRef = useRef(0);

  // HANDLERS ------------------------------------------------------------------------

  const handleSearchByPostcode = () => {
    let isPostcode = false;
    let postcodeInput = pc.replace(/\s/g, "");

    const regex = /^[A-Z]{1,2}[0-9]{1,2} ?[0-9][A-Z]{2}$/i;
    isPostcode = regex.test(postcodeInput);

    // display error message if postoce is not valid
    if (isPostcode) {
      if (recordNameCount) setNameCount(null);
      if (recordPCCount) setPCCount(null);
      skipPCRef.current = 0; // reset skip count
      skipNameRef.current = 0; // reset skip count

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
      if (recordNameCount) setNameCount(null);
      if (recordPCCount) setPCCount(null);
      skipPCRef.current = 0; // reset skip count
      skipNameRef.current = 0; // reset skip count

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

      const url =
        state.auth.APP_HOST +
        "/catalogue/fad/" +
        post_code +
        `?limit=${limitRef.current}&skip=${skipPCRef.current}`;
      const response = await fetchDataHandler({ path: url, state });

      if (response && response.ok) {
        const data = await response.json();
        const count = data.recordCount;

        // --------------------------------------------------------------------------------
        // 📌  prevent data dublication if user swith search by postcode from name
        // --------------------------------------------------------------------------------
        if (skipPCRef.current === 0) {
          setFadList((prev) => [...data.data]);
        } else {
          setFadList((prev) => [...prev, ...data.data]);
        }

        // apply focus on first dermatologist found in the list if cordinates object is not empty
        if (data.length && data[0].cordinates) {
          setDermOnFocus({
            lat: Number(data[0].cordinates.lat),
            lng: Number(data[0].cordinates.lng),
          });
        }
        // increment query skip
        skipPCRef.current = skipPCRef.current + limitRef.current;
        // hide load more button if there is no more data
        if (!recordPCCount) setPCCount(count);
      }
    } catch (error) {
      // console.log(error);
    }
  };

  const fetchDermatologistsByName = async () => {
    try {
      const url =
        state.auth.APP_HOST +
        `/catalogue/fad?search=${query.value}` +
        `&limit=${limitRef.current}&skip=${skipNameRef.current}`;
      const response = await fetchDataHandler({ path: url, state });

      if (response && response.ok) {
        const data = await response.json();
        const count = data.recordCount;

        // set filtered dermatologists
        if (skipNameRef.current === 0) {
          setFadList((prev) => [...data.data]);
        } else {
          setFadList((prev) => [...prev, ...data.data]);
        }

        // increment query skip
        skipNameRef.current = skipNameRef.current + limitRef.current;
        // hide load more button if there is no more data
        if (!recordNameCount) setNameCount(count);
      }
    } catch (error) {
      // console.log(error);
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
        <div className="flex-col">
          <div className="flex">
            <div>
              {derm.address3_line1} {derm.address3_line2}
            </div>
            {derm.address3_city && <div>, {derm.address3_city}</div>}
            <div className="flex" style={{ paddingLeft: 5 }}>
              {derm.address3_postalcode}
            </div>
          </div>
        </div>
      );
    };

    const ServeDistance = () => {
      if (!derm.distanceDisplay) return null;

      return (
        <div style={{ color: colors.blue, fontStyle: "italic" }}>
          {derm.distanceDisplay} Away
        </div>
      );
    };

    const ServeActions = () => {
      const { activeEventKey } = useContext(AccordionContext);

      // 📌 if bio, all web links empty, hide show more option
      const isNoBody =
        !derm.bad_findadermatologisttext &&
        !derm.bad_web1 &&
        !derm.bad_web2 &&
        !derm.bad_web3;

      if (isNoBody) return null;

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
      const isNoBody =
        !derm.bad_findadermatologisttext &&
        !derm.bad_web1 &&
        !derm.bad_web2 &&
        !derm.bad_web3;

      const ServeBiography = () => {
        if (!derm.bad_findadermatologisttext) return null;

        return (
          <div style={{ marginTop: 20 }}>
            <div className="primary-title">Bio</div>
            {derm.bad_findadermatologisttext}
          </div>
        );
      };

      const ServeUrls = () => {
        if (!derm.bad_web1 && !derm.bad_web2 && !derm.bad_web3) return null;

        let webAddressOne = derm.bad_web1;
        // if web address dont include http:// or https:// then add it
        if (webAddressOne && !webAddressOne.includes("https"))
          webAddressOne = "https://" + webAddressOne;
        let webAddressTwo = derm.bad_web2;
        if (webAddressTwo && !webAddressTwo.includes("https"))
          webAddressTwo = "https://" + webAddressTwo;
        let webAddressThree = derm.bad_web3;
        if (webAddressThree && !webAddressThree.includes("https"))
          webAddressThree = "https://" + webAddressThree;

        return (
          <div style={{ marginTop: 20 }}>
            <div className="primary-title">Private Practice Links</div>
            {derm.bad_web1 && (
              <div className="menu-title">
                <a href={webAddressOne} target="_blank">
                  {derm.bad_web1}
                </a>
              </div>
            )}
            {derm.bad_web2 && (
              <div className="menu-title">
                <a href={webAddressTwo} target="_blank">
                  {derm.bad_web2}
                </a>
              </div>
            )}
            {derm.bad_web3 && (
              <div className="menu-title">
                <a href={webAddressThree} target="_blank">
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
              <CardHeader derm={derm} id={dermKey} />
            </CustomToggle>
          </Card.Header>
          <Accordion.Collapse eventKey={dermKey}>
            <Card.Body style={{ padding: isNoBody ? 0 : `0 1em 1em 1em` }}>
              <div style={{ padding: `0 10px` }}>
                <ServeBiography />
                <ServeShowOnMap />
                <ServeUrls />
              </div>
            </Card.Body>
          </Accordion.Collapse>
        </Card>
      );
    };

    const ServeLoadMoreButton = () => {
      const isNameQuery = query.type === "name";

      if (loading) return <Loading />;
      // dont show load more button if there is no more data to load || query been exhausted by name search
      if (
        (!isNameQuery && recordPCCount && fadList.length >= recordPCCount) ||
        (isNameQuery && recordNameCount && fadList.length >= recordNameCount)
      )
        return null;

      if (isNameQuery && fadList.length === 0)
        return <div>No records found with this query</div>;

      const onClickHandler = () => {
        if (isNameQuery) fetchDermatologistsByName();
        if (!isNameQuery) fetchDermatologistsByPostCode();
      };

      return (
        <div
          className="blue-btn"
          onClick={onClickHandler}
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
            return <SingleDerm derm={derm} id={key} key={key} dermKey={key} />;
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
            markers={
              fadList.length > 0 && query.type !== "name" ? fadList : null
            }
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
