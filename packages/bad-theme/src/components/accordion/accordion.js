import React, { useState, useEffect, useRef } from "react";
import Accordion from "react-bootstrap/Accordion";
import Card from "react-bootstrap/Card";
import { useAccordionButton } from "react-bootstrap/AccordionButton";
import connect from "@frontity/connect";
import AccordionBody from "./alteraccordionBody";
import { v4 as uuidv4 } from "uuid";
import CloseIcon from "@mui/icons-material/Close";
// --------------------------------------------------------------------------------
import CardHeader from "./alteraccordionHeader";
import Loading from "../loading";
import BlockWrapper from "../blockWrapper";
import { colors } from "../../config/colors";
import SearchContainer from "../searchContainer";
// --------------------------------------------------------------------------------
import { useAppState, muiQuery } from "../../context";

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

  if (!block) return <Loading />;
  const { lg } = muiQuery();
  const { dynamicsApps, isActiveUser } = useAppState();

  const data = state.source.get(state.router.link);
  const {
    add_search_function,
    disable_vertical_padding,
    accordion_item,
    approved_bad_members_only,
    background_colour,
    is_active,
  } = block;

  // console.log("🐞 ACORDION ITEM", block); // debug

  const [searchFilter, setSearchFilter] = useState(null);
  const [searchInput, setInput] = useState(null);
  const [isForBADMembersOnly, setForMembersOnly] = useState(false);
  const searchFilterRef = useRef(null);

  const marginHorizontal = state.theme.marginHorizontal;
  let marginVertical = state.theme.marginVertical;
  // Uncoment to enable vertical padding ammend for accordion items (default: false)
  if (disable_vertical_padding) marginVertical = 0;

  useEffect(() => {
    // 📌 handle member only accordion items if no user is logged in
    if (approved_bad_members_only && !isActiveUser) {
      setForMembersOnly(true);
      return;
    }

    // 📌 handle member only accordion items if user is logged in
    if (approved_bad_members_only && isActiveUser) {
      // check if user have active BAD memberships in Dynamics
      let serviceAccess = false;
      if (isActiveUser) {
        serviceAccess =
          isActiveUser.bad_selfserviceaccess === state.theme.serviceAccess;
      }

      // update access to accordion item based on user membership status
      // manage to set in state both true & false due isActiveUser async update
      if (serviceAccess) setForMembersOnly(false);
      if (!serviceAccess) setForMembersOnly(true);
    }
  }, [dynamicsApps, isActiveUser]);

  useEffect(() => {
    // 📌 update filter data on block change
    setSearchFilter(accordion_item);
  }, [block]);

  if (!searchFilter || isForBADMembersOnly) return null; // defensive programming

  // HANDLERS ---------------------------------------------
  const handleSearch = () => {
    const input = searchFilterRef.current.value;
    let filter = accordion_item;

    if (input) {
      filter = filter.filter((item) => {
        let title = item.title;
        let body = item.content;

        if (title) title = title.toLowerCase().includes(input.toLowerCase());
        if (body) body = content.toLowerCase().includes(input.toLowerCase());

        return title || body;
      });
    }

    setSearchFilter(filter);
    setInput(input);
  };

  const handleClearSearchFilter = () => {
    setSearchFilter(accordion_item);
    setInput(null);
  };

  // SERVERS ---------------------------------------------
  const ServeAccordionSearchFilter = () => {
    if (!add_search_function) return null;

    let searchTitle = "Search";
    if (data.link === "/education-training/bursaries-fellowships-awards/")
      searchTitle = "Search bursaries, fellowships and awards";

    const ServeSearchFilter = () => {
      if (!searchInput) return null;

      return (
        <div className="shadow filter">
          <div>{searchInput}</div>
          <div className="filter-icon" onClick={handleClearSearchFilter}>
            <CloseIcon
              style={{
                fill: colors.darkSilver,
                padding: 0,
              }}
            />
          </div>
        </div>
      );
    };

    return (
      <div
        style={{
          backgroundColor: colors.silverFillTwo,
          padding: "2em 0",
        }}
      >
        <BlockWrapper>
          <div
            style={{
              padding: `0 ${marginHorizontal}px`,
              width: `70%`,
            }}
            className="no-selector"
          >
            <div className="flex-row">
              <SearchContainer
                title={searchTitle}
                searchFilterRef={searchFilterRef}
                handleSearch={handleSearch}
              />
            </div>

            <div className="flex" style={{ margin: "0.5em 0" }}>
              <ServeSearchFilter />
            </div>
          </div>
        </BlockWrapper>
      </div>
    );
  };

  const SingleItem = ({ block, id }) => {
    return (
      <Card
        className="shadow"
        style={{
          borderRadius: 0,
          border: 0,
          margin: `${state.theme.marginVertical / 2}px 0`,
        }}
      >
        <Card.Header
          style={{
            padding: 0,
            border: 0,
            backgroundColor: "#fff",
          }}
        >
          <CustomToggle eventKey={id}>
            <CardHeader
              id={id}
              block={block}
              guidelines={guidelines}
              leadershipBlock={leadershipBlock}
              fundingBlock={fundingBlock}
              membershipApplications={membershipApplications}
              hasPreview={hasPreview}
            />
          </CustomToggle>
        </Card.Header>
        <Accordion.Collapse eventKey={id}>
          <Card.Body>
            <AccordionBody
              block={block}
              guidelines={guidelines}
              leadershipBlock={leadershipBlock}
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
    <div>
      <ServeAccordionSearchFilter />
      <div style={{ backgroundColor: background_colour || "transparent" }}>
        <BlockWrapper>
          <div style={{ padding: !lg ? `0 100px` : "0 0.5em" }}>
            <Accordion
              style={{ border: 0 }}
              defaultActiveKey={is_active ? "0" : "99"}
            >
              {searchFilter.map((block, key) => {
                return <SingleItem block={block} key={key} id={`${key}`} />;
              })}
            </Accordion>
          </div>
        </BlockWrapper>
      </div>
    </div>
  );
}

export default connect(AlterAccordion);
