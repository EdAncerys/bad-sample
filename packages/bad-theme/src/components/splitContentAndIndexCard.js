import { useState, useEffect } from "react";
import { connect } from "frontity";

import { setGoToAction, muiQuery } from "../context";
import { colors } from "../config/imports";

import Loading from "./loading";
import IndexCard from "./indexCard";
import TitleBlock from "./titleBlock";
import Dropdown from "react-bootstrap/Dropdown";

const SplitContentAndIndexCard = ({ state, actions, libraries, block }) => {
  const Html2React = libraries.html2react.Component; // Get the component exposed by html2react.

  if (!block) return <Loading />;

  const { sm, md, lg, xl } = muiQuery();

  const {
    body,
    title,
    label,
    link,
    index_card,
    disable_vertical_padding,
    limit_body_length,
  } = block;

  const [limit, setLimit] = useState(limit_body_length);
  const marginHorizontal = state.theme.marginHorizontal;
  let marginVertical = state.theme.marginVertical;
  if (disable_vertical_padding) marginVertical = 0;

  if (!block) return <Loading />;

  // SERVERS -----------------------------------------------------
  const ServeContent = () => {
    const ServeBody = () => {
      if (!body) return null;

      // Adjust body max string Length
      let bodyPreview = body;
      const maxLength = 1500;
      if (body.length > maxLength && limit)
        bodyPreview = `${body.substring(0, maxLength)}...`;

      const ServeActions = () => {
        if (!limit_body_length || body.length <= maxLength) return null;

        let label = "Read More";
        if (!limit) label = "Read Less";

        return (
          <div style={{ padding: `2em 0` }}>
            <div className="caps-btn" onClick={() => setLimit(!limit)}>
              {label}
            </div>
          </div>
        );
      };

      const ServeTitle = () => {
        if (!title) return null;

        return (
          <div className="text-body-no-margin">
            <TitleBlock block={{ title, text_align: "left" }} disableMargin />
          </div>
        );
      };

      return (
        <div
          className="text-body"
          style={{
            fontSize: 16,
          }}
        >
          <ServeTitle />
          <Html2React html={bodyPreview} />
          <ServeActions />
        </div>
      );
    };

    const ServeLink = () => {
      if (!label && !link) return null;

      return (
        <div
          className="primary-title"
          style={{
            fontSize: 24,
            paddingTop: `1em`,
          }}
        >
          <div
            className="blue-btn"
            onClick={() => setGoToAction({ path: link.url, actions })}
          >
            <Html2React html={label} />
          </div>
        </div>
      );
    };

    return (
      <div className="flex-col">
        <ServeBody />
        <ServeLink />
      </div>
    );
  };

  const ServeIndexCard = ({}) => {
    if (!index_card) return null;

    return (
      <div>
        {index_card.map((block, key) => {
          const { card_title, colour, index_title, link, subtitle } = block;

          return (
            <div
              key={key}
              style={{
                display: "flex",
                justifyContent: "center",
                paddingBottom: `1em`,
                // add sticky config to side component
                // position: "sticky",
                // top: 0,
              }}
            >
              <IndexCard
                card_title={card_title}
                colour={colour}
                index_title={index_title}
                subtitle={subtitle}
                link={link}
                shadow // optional param
              />
            </div>
          );
        })}
      </div>
    );
  };

  const ServeMobileDropdown = (card) => {
    if (!card.card.index_card) return null;
    console.log("MOBILE DROPDOWN", card);
    console.log("CARD: ", card.card.index_title);
    return (
      <Dropdown>
        <Dropdown.Toggle
          id="dropdown-basic"
          style={{
            backgroundColor: colors.darkSilver,
            width: "100%",
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            borderRadius: 0,
            position: "relative",
            zIndex: 700,
            padding: "1em",
            backgroundColor: card.card.colour,
            border: 0,
          }}
          drop="down"
        >
          <Html2React html={card.card.card_title} />
        </Dropdown.Toggle>
        <Dropdown.Menu style={{ width: "100%" }}>
          {card.card.index_title.map((item, key) => {
            return (
              <Dropdown.Item
                onClick={() => setGoToAction({ path: item.link.url, actions })}
                drop="down"
              >
                <Html2React html={item.title} />
              </Dropdown.Item>
            );
          })}
        </Dropdown.Menu>
      </Dropdown>
    );
  };
  // RETURN ---------------------------------------------------
  return (
    <div style={{ margin: `${marginVertical}px ${marginHorizontal}px` }}>
      <div style={!lg ? styles.container : styles.containerMobile}>
        <ServeContent />
        {!lg ? (
          <ServeIndexCard />
        ) : (
          <ServeMobileDropdown card={block.index_card[0]} />
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: "grid",
    gridTemplateColumns: `2fr 1fr`,
    justifyContent: "space-between",
    gap: 20,
  },
  containerMobile: {
    display: "flex",
    justifyContent: "space-between",
    flexDirection: "column-reverse",
    gap: 20,
  },
};

export default connect(SplitContentAndIndexCard);
