import { useState, useEffect } from "react";
import { connect } from "frontity";

import Card from "./card/card";
import Loading from "./loading";

const VenueHireGallery = ({ state, actions, block }) => {
  if (!block) return <Loading />;

  const { disable_vertical_padding } = block;

  const [venueList, setVenueList] = useState(null);

  const marginHorizontal = state.theme.marginHorizontal;
  let marginVertical = state.theme.marginVertical;
  if (disable_vertical_padding) marginVertical = 0;

  // DATA pre FETCH ----------------------------------------------------------------
  useEffect(async () => {
    const path = `/venues/`;
    await actions.source.fetch(path); // fetch CPT venues

    const venues = state.source.get(path);
    const { totalPages, page, next } = venues; // check if venues have multiple pages
    // fetch venues via wp API page by page
    let isThereNextPage = next;
    while (isThereNextPage) {
      await actions.source.fetch(isThereNextPage); // fetch next page
      const nextPage = state.source.get(isThereNextPage).next; // check ifNext page & set next page
      isThereNextPage = nextPage;
    }

    const VENUE_LIST = Object.values(state.source["venues"]); // add venues object to data array
    setVenueList(VENUE_LIST);

    return () => {
      mountedRef.current = false;   // clean up function
    };
  }, []);
  // DATA pre FETCH ----------------------------------------------------------------
  if (!venueList) return <Loading />;

  // RETURN ---------------------------------------------------
  return (
    <div style={{ margin: `${marginVertical}px ${marginHorizontal}px` }}>
      <div style={styles.container}>
        {venueList.map((block, key) => {
          const {
            about_the_venue,
            address,
            capacity_options,
            catering,
            enquiry_email,
            excerpt,
            gallery,
            square_footage,
            colour,
          } = block.acf;

          return (
            <div key={key} className="flex">
              <Card
                gallery={gallery}
                venueInfo={block}
                colour={colour}
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
  container: {
    display: "grid",
    gridTemplateColumns: `repeat(2, 1fr)`,
    justifyContent: "space-between",
    gap: 20,
  },
};

export default connect(VenueHireGallery);
