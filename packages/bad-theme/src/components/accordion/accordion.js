import React, { useState, useLayoutEffect, useEffect } from "react";

import Accordion from "react-bootstrap/Accordion";
import Card from "react-bootstrap/Card";
import BlockWrapper from "../blockWrapper";
import { useAccordionButton } from "react-bootstrap/AccordionButton";
import Loading from "../loading";
import AccordionBody from "./alteraccordionBody";
import CardHeader from "./alteraccordionHeader";
import { useAppState, muiQuery } from "../../context";
import connect from "@frontity/connect";
import { v4 as uuidv4 } from "uuid";

function AlterAccordion({
  state,
  actions,
  libraries,
  block,
  guidelines,
  leadershipBlock,
  fundingBlock,
  membershipApplications,
  hasPublishDate,
  hasPreview,
}) {
  // HELPERS -----------------------------------------------------------------------
  function CustomToggle({ children, eventKey, callback }) {
    const decoratedOnClick = useAccordionButton(eventKey, () => {
      callback && callback(eventKey);
    });

    return <div onClick={decoratedOnClick}>{children}</div>;
  }

  console.log("🐞 block", block);

  if (!block) return <Loading />;
  const { lg } = muiQuery();
  const { dynamicsApps } = useAppState();
  const {
    disable_vertical_padding,
    accordion_item,
    approved_bad_members_only,
    background_colour,
  } = block;

  const [searchFilter, setSearchFilter] = useState(null);
  const [uniqueId, setUniqueId] = useState(null);
  const [isActive, setIsActive] = useState(true);

  const marginHorizontal = state.theme.marginHorizontal;
  let marginVertical = state.theme.marginVertical;
  if (disable_vertical_padding) marginVertical = 0;

  let isBADApproved = false;
  if (dynamicsApps && dynamicsApps.subs.data.length > 0) isBADApproved = true;
  let isForBADMembersOnly = false;
  if (approved_bad_members_only && !isBADApproved) isForBADMembersOnly = true;

  useLayoutEffect(() => {
    // ⬇️ re-set accordion data state on data change
    setSearchFilter(accordion_item);
    const id = uuidv4(); // add unique id
    setUniqueId(id);
  }, [accordion_item]);

  useEffect(() => {
    if (!uniqueId) return; // break if no unique id
    let isActive = false;

    if (leadershipBlock && block.accordion_item)
      isActive = block.accordion_item[0].block.is_active;
    if (isActive) {
      // 📌 apply show class to accordion item
      // set timeout get the accordion body with the unique id
      setTimeout(() => {
        const accordionBody = document.getElementById(uniqueId);
        if (accordionBody) accordionBody.classList.add("show");
      }, 100);
    }
  }, [uniqueId]);

  if (!searchFilter || isForBADMembersOnly) return null; // defensive programming

  const SingleItem = ({ block, id }) => {
    return (
      <Card
        style={{
          backgroundColor: "#fff",
          borderRadius: 0,
          marginTop: 20,
          border: 0,
        }}
        // 📌 animation adds bug when using react-bootstrap accordion
        // uncoment to use css effects
        // data-aos={leadershipBlock ? "none" : "fade"}
        // data-aos-easing="ease-in-sine"
        // data-aos-delay={`${id}`}
        // data-aos-duration="1000"
        // data-aos-offset="-120"

        className="shadow"
      >
        <Card.Header
          style={{
            padding: 0,
            border: 0,
            backgroundColor: "#fff",
            paddingTop: "10px",
          }}
        >
          <CustomToggle eventKey={id}>
            <CardHeader
              id={id}
              uniqueId={id}
              block={block}
              guidelines={guidelines}
              leadershipBlock={leadershipBlock}
              fundingBlock={fundingBlock}
              membershipApplications={membershipApplications}
              hasPreview={hasPreview}
            />
          </CustomToggle>
        </Card.Header>
        <Accordion.Collapse eventKey={id} id={uniqueId}>
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
          </Card.Body>
        </Accordion.Collapse>
      </Card>
    );
  };

  return (
    <div
      style={{
        padding: `${marginVertical}px ${marginHorizontal}px`,
        backgroundColor: background_colour || "transparent",
      }}
    >
      <BlockWrapper>
        <div style={{ padding: !lg ? "0 100px" : "0 0.5em" }}>
          <Accordion style={{ border: 0 }}>
            {searchFilter.map((block, key) => {
              return <SingleItem block={block} key={key} id={key} />;
            })}
          </Accordion>
        </div>
      </BlockWrapper>
    </div>
  );
}

export default connect(AlterAccordion);
