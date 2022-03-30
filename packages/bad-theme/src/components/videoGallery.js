import { connect } from "frontity";
import Card from "./card/card";
import Loading from "./loading";

// CONTEXT -----------------------------------------------------
import { muiQuery } from "../context";

const VideoGallery = ({ state, actions, block }) => {
  if (!block) return <Loading />;
  if (!block.video_card) return null;

  const { sm, md, lg, xl } = muiQuery();

  const { disable_vertical_padding } = block;

  const marginHorizontal = state.theme.marginHorizontal;
  let marginVertical = state.theme.marginVertical;
  if (disable_vertical_padding) marginVertical = 0;

  // RETURN ---------------------------------------------------
  return (
    <div style={{ margin: `${marginVertical}px ${marginHorizontal}px` }}>
      <div style={!lg ? styles.container : styles.containerMobile}>
        {block.video_card.map((block, key) => {
          const {
            body,
            colour,
            condition,
            date,
            procedure,
            service,
            title,
            video,
          } = block;

          return (
            <div key={key} className="flex">
              <Card
                gallery={video}
                videoGalleryInfo={{
                  body,
                  condition,
                  date,
                  procedure,
                  service,
                  title,
                }}
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
    gap: 20,
  },
};

export default connect(VideoGallery);
