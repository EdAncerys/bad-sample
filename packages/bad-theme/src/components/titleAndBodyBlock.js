import { connect } from "frontity";
import Loading from "./loading";

// CONTEXT -----------------------------------------------------
import { muiQuery, Parcer } from "../context";

const TitleAndBodyBlock = ({ state, actions, libraries, block }) => {
  const { sm, md, lg, xl } = muiQuery();

  if (!block) return <Loading />;

  const { body, title, text_align, disable_vertical_padding } = block;

  const marginHorizontal = state.theme.marginHorizontal;
  let marginVertical = state.theme.marginVertical;
  if (disable_vertical_padding) marginVertical = 0;

  let ALIGNMENT = "start";
  if (text_align === "centre") ALIGNMENT = "center";
  if (text_align === "right") ALIGNMENT = "end";

  // SERVERS ---------------------------------------------
  const ServeTitle = () => {
    if (!title) return null;

    return (
      <div
        className="flex primary-title"
        style={{
          fontSize: 26,
          textAlign: ALIGNMENT,
          justifyContent: ALIGNMENT,
        }}
      >
        <Parcer libraries={libraries} html={title} />
      </div>
    );
  };

  const ServeBody = () => {
    if (!body) return null;

    return (
      <div
        className="flex-col"
        style={{
          fontSize: 16,
          fontWeight: "bold",
          paddingTop: `1em`,
          textAlign: ALIGNMENT,
          justifyContent: ALIGNMENT,
        }}
      >
        <Parcer libraries={libraries} html={body} />
      </div>
    );
  };

  return (
    <div style={{ margin: `${marginVertical}px ${marginHorizontal}px` }}>
      <div className="flex-col">
        <ServeTitle />
        <ServeBody />
      </div>
    </div>
  );
};

const styles = {
  container: {},
};

export default connect(TitleAndBodyBlock);
