import { useState, useEffect, useRef } from "react";
import { connect } from "frontity";

import Card from "./card/card";
import Loading from "./loading";

// CONTEXT --------------------------------------------------
import { muiQuery, getVenuesData } from "../context";

const VenueHireGallery = ({ state, actions, block }) => {
  const { sm, md, lg, xl } = muiQuery();

  if (!block) return <Loading />;

  const { disable_vertical_padding } = block;

  const [venueList, setVenueList] = useState(null);
  const mountedRef = useRef(true);
  const marginHorizontal = state.theme.marginHorizontal;
  let marginVertical = state.theme.marginVertical;
  if (disable_vertical_padding) marginVertical = 0;

  // DATA pre FETCH ----------------------------------------------------------------
  useEffect(async () => {
    const venues = await getVenuesData({ state });
    setVenueList(venues);

    return () => {
      mountedRef.current = false; // clean up function
    };
  }, []);

  // DATA pre FETCH ----------------------------------------------------------------
  if (!venueList) return <Loading />;

  // RETURN ---------------------------------------------------
  return (
    <div style={{ margin: `${marginVertical}px ${marginHorizontal}px` }}>
      <div style={!lg ? styles.container : styles.containerMobile}>
        {venueList.map((block, key) => {
          const { gallery, colour } = block.acf;

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
  containerMobile: {
    display: "grid",
    gridTemplateColumns: `repeat(1, 1fr)`,
    justifyContent: "space-between",
    gap: 10,
  },
};

export default connect(VenueHireGallery);
