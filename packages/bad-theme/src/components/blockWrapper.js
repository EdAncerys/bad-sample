import { connect } from "frontity";
import { colors } from "../config/colors";
function BlockWrapper({ children, state, background, fullWidth, passedWidth }) {
  const CONTENT_WIDTH = state.theme.contentContainer;
  // fullwidth will be a boolean
  // passedWidth will be a value
  const WIDTH = passedWidth ? passedWidth : CONTENT_WIDTH;
  return (
    <div
      className="d-flex justify-content-center"
      style={{
        backgroundColor: background ? background : null,
      }}
    >
      <div style={{ width: fullWidth ? "100%" : WIDTH }}>{children}</div>
    </div>
  );
}
export default connect(BlockWrapper);
