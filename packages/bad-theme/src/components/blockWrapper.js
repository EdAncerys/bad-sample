import { connect } from "frontity";
import { colors } from "../config/colors";

const BlockWrapper = ({ children, state, background, fullWidth }) => {
  const CONTENT_WIDTH = state.theme.contentContainer;

  let STYLES = { display: "block" };
  if (fullWidth) STYLES = { display: "flex", flex: 1 };

  return (
    <div className="flex" style={{ justifyContent: "center" }}>
      <div
        style={{
          ...STYLES,
          backgroundColor: background || null,
          justifyContent: "center",
        }}
      >
        <div style={{ width: CONTENT_WIDTH }}>{children}</div>
      </div>
    </div>
  );
};
export default connect(BlockWrapper);
