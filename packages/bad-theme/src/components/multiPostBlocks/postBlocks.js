import { useState, useEffect } from "react";
import { connect } from "frontity";

import { colors } from "../../config/imports";
import Card from "../card/card";
import Loading from "../loading";
// CONTEXT ----------------------------------------------------------------
import { useAppDispatch, useAppState } from "../../context";

const MultiPostBlock = ({ state, actions, block, filter }) => {
  const { disable_vertical_padding, add_search_function } = block;

  const marginHorizontal = state.theme.marginHorizontal;
  let marginVertical = state.theme.marginVertical;
  if (disable_vertical_padding) marginVertical = 0;

  let MARGIN = `${marginVertical}px 0`;
  if (add_search_function) MARGIN = `0 0 ${marginVertical}px`;

  let CARD_NUMBER = 3;
  if (block.cards_per_row === "One") CARD_NUMBER = 1;
  if (block.cards_per_row === "Two") CARD_NUMBER = 2;
  if (block.cards_per_row === "Four") CARD_NUMBER = 4;

  const isFrom4Col = CARD_NUMBER === 4;
  let FILTER_LENGTH = 0;

  // SERVERS ----------------------------------------------
  const ServeNoResults = () => {
    if (!filter) return null;
    if (FILTER_LENGTH > 0) return null;

    return (
      <div className="flex-col">
        <div
          className="primary-title"
          style={{
            fontSize: 24,
            fontWeight: "bold",
            color: colors.black,
          }}
        >
          Sorry, no results were found for '{filter}'
        </div>
        <div>
          Tips: Try searching with other similar words double check your
          spelling
        </div>
      </div>
    );
  };

  // RETURN ---------------------------------------------------
  return (
    <div style={{ margin: MARGIN }}>
      <ServeNoResults />
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${CARD_NUMBER}, 1fr)`,
          justifyContent: "space-between",
          gap: isFrom4Col ? 10 : 20,
        }}
      >
        {block.card.map((block, key) => {
          const {
            background_image,
            body,
            card_title,
            colour,
            form_label,
            form_link,
            link_label,
            link,
            doc_upload,
            title,
          } = block;

          if (filter) {
            if (
              !title.toLowerCase().includes(filter) &&
              !body.toLowerCase().includes(filter)
            )
              return null;
            FILTER_LENGTH++;
          }

          return (
            <div key={key} className="flex">
              <Card
                cardTitle={isFrom4Col ? null : card_title}
                title={title}
                body={body}
                colour={colour}
                link_label={link_label}
                link={link.url}
                url={isFrom4Col ? null : background_image.url} // optional param
                form_label={form_label} // optional param
                form_link={form_link.url} // optional param
                downloadFile={doc_upload ? { file: doc_upload } : null} // optional param
                isFrom4Col={isFrom4Col ? true : null}
                shadow // optional param
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

const styles = {
  container: {},
};

export default connect(MultiPostBlock);
