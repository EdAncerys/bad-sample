import React from "react";
import { connect } from "frontity";
import { colors } from "../config/colors";

import Accordion from "react-bootstrap/Accordion";
import Card from "react-bootstrap/Card";
import BlockWrapper from "./blockWrapper";
import { useAccordionButton } from "react-bootstrap/AccordionButton";
import { handleGetCookie } from "../helpers/cookie";
import { useAppState } from "../context";

import Loading from "./loading";
const FindADermatologist = ({ state }) => {
  const [postCode, setPostCode] = React.useState();
  const [name, setName] = React.useState();

  const [filteredDermatologists, setFilteredDermatologists] = React.useState();
  const distance = null;
  const { isActiveUser } = useAppState();
  const cookie = handleGetCookie({ name: `BAD-WebApp` });
  const { contactid, jwt } = cookie;

  React.useEffect(() => {
    const fetchDermatologists = async () => {
      const fetching = await fetch(
        state.auth.APP_HOST + "/catalogue/fad/" + postCode.toLowerCase(),
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        }
      );
      if (fetching.ok) {
        const json = await fetching.json();
        setFilteredDermatologists(json);
      }
    };
    if (postCode) fetchDermatologists();
  }, [postCode, name]);
  const CardHeader = ({ derm }) => {
    const ServeHeadline = () => {
      return (
        <div className="primary-title" style={{ fontSize: 20 }}>
          {derm.fullName} | {derm.address1_addressid}
        </div>
      );
    };
    const ServeAddress = () => {
      return <div>{derm.address1_composite}</div>;
    };
    const ServeDistance = () => {
      if (!distance) return null;
      return <div>{derm.distance}</div>;
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
      return (
        <div className="flex-row">
          Name:
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setName("E147TP");
            }}
            className="flex-row"
          >
            <input type="text" placeholder="Search by Name" />
            <button type="submit" className="blue-btn">
              Search
            </button>
          </form>
        </div>
      );
    };
    const ServeSearchByPostCode = () => {
      return (
        <div className="flex-row">
          Postcode:
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setPostCode("E147TP");
            }}
            className="flex-row"
          >
            <input type="text" placeholder="Postcode" />
            <button type="submit" className="blue-btn">
              Search
            </button>
          </form>
        </div>
      );
    };
    return (
      <div
        className="flex-row"
        style={{ backgroundColor: colors.darkSilver, padding: 10 }}
      >
        <ServeSearchByPostCode />
        <ServeSearchByName />
      </div>
    );
  };
  const ServeAccordionListOfDerms = () => {
    if (!postCode && !name) return null;
    if (!filteredDermatologists) return <Loading />;
    const SingleDerm = ({ derm }) => {
      return (
        <Card>
          <Card.Header>
            <CustomToggle eventKey="0">
              <CardHeader derm={derm} />
            </CustomToggle>
          </Card.Header>
          <Accordion.Collapse eventKey="0">
            <Card.Body>Hello! I'm the body</Card.Body>
          </Accordion.Collapse>
        </Card>
      );
    };
    return (
      <>
        <Accordion>
          {filteredDermatologists.map((derm) => {
            <SingleDerm derm={derm} />;
          })}
        </Accordion>
      </>
    );
  };
  return (
    <BlockWrapper>
      <ServeSearchOptions />
      <img
        src="https://complianz.io/wp-content/uploads/2020/05/Screenshot-2021-09-23-at-13.39.36.png"
        alt="Map"
      />
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
