import { useState, useEffect } from "react";
import { connect } from "frontity";

import { colors } from "../config/colors";
import Card from "./card/card";
import SearchFilter from "./searchFilter";
import Loading from "./loading";
// CONTEXT ----------------------------------------------------------------
import { useAppDispatch, useAppState } from "../context";

const MultiPostBlock = ({ state, actions, block }) => {
  if (!block) return <Loading />;
  if (!block.card) return null;

  const { disable_vertical_padding } = block;

  const [filter, setFilter] = useState(null);

  const marginHorizontal = state.theme.marginHorizontal;
  let marginVertical = state.theme.marginVertical;
  if (disable_vertical_padding) marginVertical = 0;

  let FILTER_LENGTH = 0; // defines if search returns null
  let CARD_NUMBER = 3;
  if (block.cards_per_row === "One") CARD_NUMBER = 1;
  if (block.cards_per_row === "Two") CARD_NUMBER = 2;
  if (block.cards_per_row === "Four") CARD_NUMBER = 4;

  const isFrom4Col = CARD_NUMBER === 4;

  useEffect(() => {
    setFilter(null); // handles search filter reset on component load
  }, []);

  // HELPERS ----------------------------------------------------------------
  const handleSetState = ({ filter }) => {
    setFilter(filter);
  };

  // SERVERS ----------------------------------------------
  const ServeSearchFilterContainer = () => {
    if (block.search_filters === "False") return null;

    return (
      <div style={{ paddingBottom: `1em` }}>
        <SearchFilter handleSetState={handleSetState} />
      </div>
    );
  };

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
          Sorry, no results were found for '{filter.searchInput}'
        </div>
        <div>
          Tips: Try searching with other similar words Double check your
          spelling
        </div>
        <div style={{ padding: `1em 0` }}>
          <button
            type="submit"
            className="btn"
            style={{
              backgroundColor: colors.primary,
              color: colors.white,
              padding: `0.5em`,
            }}
            onClick={() => setFilter(null)}
          >
            Search Again
          </button>
        </div>
      </div>
    );
  };

  // RETURN ---------------------------------------------------
  return (
    <div style={{ margin: `${marginVertical}px 0` }}>
      <ServeSearchFilterContainer />
      <div style={{ margin: `0 ${marginHorizontal}px` }}>
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
              title,
            } = block;

            if (filter) {
              const FILTER = filter.searchInput.toLowerCase();
              if (
                !title.toLowerCase().includes(FILTER) ||
                !body.toLowerCase().includes(FILTER)
              )
                return null;
            }
            FILTER_LENGTH++;

            if (FILTER_LENGTH === 0) return <div>nothing fount</div>;

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
                  cardHeight={isFrom4Col ? 290 : null}
                  isFrom4Col={isFrom4Col ? true : null}
                  shadow // optional param
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    // add custom wrapping to card elements
    // display: "flex",
    // flexWrap: "wrap",
    // justifyContent: "center",
  },
};

export default connect(MultiPostBlock);
