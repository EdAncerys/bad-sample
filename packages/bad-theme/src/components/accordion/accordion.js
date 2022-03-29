import React, { useRef, useEffect, useState, useLayoutEffect } from "react";

import Accordion from "react-bootstrap/Accordion";
import Card from "react-bootstrap/Card";
import BlockWrapper from "../blockWrapper";
import { useAccordionButton } from "react-bootstrap/AccordionButton";
import AccordionContext from "react-bootstrap/AccordionContext";
import { colors } from "../../config/imports";
import Loading from "../loading";
import AccordionHeader from "./accordionHeader";
import AccordionBody from "./alteraccordionBody";
import ActionPlaceholder from "../actionPlaceholder";
import SearchContainer from "../searchContainer";
import CardHeader from "./alteraccordionHeader";
import { useAppState } from "../../context";
import connect from "@frontity/connect";

function AlterAccordion({
  state,
  actions,
  libraries,
  block,
  guidelines,
  leadershipBlock,
  fundingBlock,
  membershipApplications,
  hasPreview,
  hasPublishDate,
}) {
  const [isFetching, setFetching] = useState(null);

  function CustomToggle({ children, eventKey, callback }) {
    const { activeEventKey } = React.useContext(AccordionContext);
    const decoratedOnClick = useAccordionButton(
      eventKey,
      () => callback && callback(eventKey)
    );

    return <div onClick={decoratedOnClick}>{children}</div>;
  }

  //   const CardHeader = ({ derm, id }) => {
  //     return <div className="accordion">Biczka</div>;
  //   };
  if (!block) return <Loading />;

  const { dynamicsApps } = useAppState();
  const {
    disable_vertical_padding,
    accordion_item,
    approved_bad_members_only,
    add_search_function,
  } = block;
  // console.log("accordion_item", accordion_item); //debug

  const [searchFilter, setSearchFilter] = useState(null);
  const [searchInput, setInput] = useState(null);
  const searchFilterRef = useRef(null);

  //   const marginHorizontal = state.theme.marginHorizontal;
  //   let marginVertical = state.theme.marginVertical / 4;
  if (disable_vertical_padding) marginVertical = 0;

  let isBADApproved = false;
  if (dynamicsApps && dynamicsApps.subs.data.length > 0) isBADApproved = true;
  let isForBADMembersOnly = false;
  if (approved_bad_members_only && !isBADApproved) isForBADMembersOnly = true;

  useLayoutEffect(() => {
    // ⬇️ re-set accordion data state on data change
    setSearchFilter(accordion_item);
  }, [accordion_item]);

  if (!searchFilter || isForBADMembersOnly) return null; // defensive programming

  const SingleDerm = ({ block, id }) => {
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
            <CardHeader
              id={id}
              uniqueId={id}
              block={block}
              guidelines={guidelines}
              leadershipBlock={leadershipBlock}
              fundingBlock={fundingBlock}
              membershipApplications={membershipApplications}
            />
          </CustomToggle>
        </Card.Header>
        <Accordion.Collapse eventKey={id}>
          <Card.Body>
            <AccordionBody
              block={block}
              guidelines={guidelines}
              leadershipBlock={leadershipBlock}
              uniqueId={id}
              fundingBlock={fundingBlock}
              membershipApplications={membershipApplications}
              hasPublishDate={hasPublishDate}
            />
            {/* <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 4fr",
                gap: 20,
              }}
            >
              <div></div>
              <div style={{ padding: 10 }}>Biczka</div>
            </div> */}
          </Card.Body>
        </Accordion.Collapse>
      </Card>
    );
  };
  return (
    <BlockWrapper>
      <div style={{ padding: "0 100px" }}>
        <Accordion style={{ border: 0 }}>
          {searchFilter.map((block, key) => {
            return <SingleDerm block={block} key={key} id={key} />;
          })}
        </Accordion>
      </div>
    </BlockWrapper>
  );
}

export default connect(AlterAccordion);
