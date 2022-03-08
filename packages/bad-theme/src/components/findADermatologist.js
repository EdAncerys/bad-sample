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
const FindADermatologist = ({ state }) => {
  const marginVertical = state.theme.marginVertical;
  const marginHorizontal = state.theme.marginHorizontal;
  let MARGIN = `${marginVertical}px ${marginHorizontal}px`;

  const [query, setQuery] = React.useState();

  const [filteredDermatologists, setFilteredDermatologists] = React.useState();
  const dispatch = useAppDispatch();
  const jwt = authenticateAppAction({ dispatch, state });

  React.useEffect(() => {
    const fetchDermatologistsByPostCode = async () => {
      const post_code = query.value.split(" ").join("");
      console.log(post_code);
      const url = state.auth.APP_HOST + "/catalogue/fad/" + post_code;
      console.log("JWT", jwt);
      console.log("URL", url);
      const fetching = await fetch(url, {
        headers: {
          Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IkNNRXJOX1FMa29qTkZKRF9RbzFWUyIsInVzZXJuYW1lIjoiY2hyaXMuY3VsbGVuIiwiZW1haWwiOiJjaHJpc2N1bGxlbjQyQGdtYWlsLmNvbSIsInNjb3BlIjoiYWRtaW4iLCJkaXNwbGF5bmFtZSI6IkNocmlzIiwiaWF0IjoxNjQ2NzM3NTM1LCJleHAiOjE2NDY3NDExMzUsImF1ZCI6IkJBRDpTS1lMQVJLOndlYmFwcCIsImlzcyI6ImR5bmFtaWNzLmJyaWRnZS5za3lsYXJrIn0.L4TJhGXCr7Yr7BZCiAuA-ceeTvVGgONVxiZj35NffIk`,
        },
      });
      if (fetching.ok) {
        const json = await fetching.json();
        console.log("JSON", json);
        const data = json.data;
        const sorted = data.sort(function (a, b) {
          var keyA = new Date(a.updated_at),
            keyB = new Date(b.updated_at);
          // Compare the 2 dates
          if (keyA < keyB) return -1;
          if (keyA > keyB) return 1;
          return 0;
        });

        setFilteredDermatologists(sorted);
      }
    };
    if (query && query.type === "pc") fetchDermatologistsByPostCode();
    if (query && query.type === "name") fetchDermatologistsByName();
  }, [query]);
  const CardHeader = ({ derm }) => {
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
      return <div>{derm.distance * 0.000621371} miles away</div>;
    };
    return (
      <div style={styles.dermatologistContainer}>
        <ServeHeadline />
        <ServeDistance />
        <ServeAddress />
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
            <button type="submit" className="blue-btn">
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
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 20,
          marginTop: 20,
        }}
      >
        <ServeSearchByPostCode />
        <ServeSearchByName />
      </div>
    );
  };
  const ServeAccordionListOfDerms = () => {
    if (!query) return null;
    if (!filteredDermatologists) return <Loading />;
    console.log("DERMI", filteredDermatologists);
    const SingleDerm = ({ derm, id }) => {
      if (!derm.distance) return null;
      console.log("DERMHIT");
      return (
        <Card>
          <Card.Header>
            <CustomToggle eventKey={id}>
              <CardHeader derm={derm} />
            </CustomToggle>
          </Card.Header>
          <Accordion.Collapse eventKey={id}>
            <Card.Body>{derm.emailaddress1}</Card.Body>
          </Accordion.Collapse>
        </Card>
      );
    };
    return (
      <>
        <Accordion>
          {filteredDermatologists.map((derm, key) => {
            console.log("DERM!", derm);
            return <SingleDerm derm={derm} id={key} key={key} />;
          })}
        </Accordion>
      </>
    );
  };
  const ServeMap = () => {
    return (
      <div style={{ height: 300 }}>
        <MapsComponent markers />
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
  },
};
export default connect(FindADermatologist);
