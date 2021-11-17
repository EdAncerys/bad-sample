import { useState, useEffect } from "react";
import { connect } from "frontity";
import { colors } from "../config/colors";

import Loading from "./loading";

const Card = ({ state, actions, item, themeColor, cardWidth, cardHeight }) => {
  if (!item) return <Loading />;

  // HELPERS ---------------------------------------------
  const handleGoToPath = () => {
    actions.router.set(`${url}`);
    console.log("url", url);
  };

  // SERVERS ----------------------------------------------
  const ServeFooter = () => {
    return (
      <div
        style={{
          backgroundColor: themeColor || colors.primary,
          height: 8,
          width: "100%",
        }}
      />
    );
  };

  const ServeCardBody = ({ item }) => {
    const { title } = item;
    if (!title) return null;

    const ServeTitle = () => {
      // Manage max string Length
      const MAX_LENGTH = 30;
      let titlePreview = `${title.substring(0, MAX_LENGTH)}...`;
      if (title.length < MAX_LENGTH) titlePreview = title;

      return (
        <div>
          <li
            className="list-group-item"
            style={{
              border: "none",
            }}
          >
            <div
              style={{
                borderBottom: `1px dotted ${colors.silver}`,
              }}
            >
              {titlePreview}
            </div>
          </li>
        </div>
      );
    };

    return (
      <div className="flex-col">
        <ServeTitle />
      </div>
    );
  };

  // RETURN ----------------------------------------------------
  return (
    <div
      className="card m-2 shadow"
      style={{
        ...styles.card,
        width: cardWidth || "30%",
        height: cardHeight || "100%",
      }}
    >
      <div className="flex-col m-3">
        <ul className="list-group">
          <li
            className="list-group-item"
            style={{ fontSize: 20, fontWeight: "bold", border: "none" }}
          >
            An active item
          </li>
          <li
            className="list-group-item"
            style={{ fontSize: 16, fontWeight: "bold", border: "none" }}
          >
            Our values
          </li>
          {item.map((item, key) => {
            return <ServeCardBody key={key} item={item} />;
          })}
        </ul>
      </div>
      <ServeFooter />
    </div>
  );
};

const styles = {
  card: {
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    border: "none",
  },
  listItem: {
    fontSize: 16,
  },
};

export default connect(Card);
