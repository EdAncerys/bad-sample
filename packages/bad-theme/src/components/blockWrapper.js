import { connect } from "frontity";
import { colors } from "../config/colors";
function BlockWrapper({ children, state, background, fullwidth, passedWidth }) {
  const CONTENT_WIDTH = state.theme.contentContainer;
  // fullwidth will be a boolean
  // passedWidth will be a value
  return (
    <div
      className="d-flex justify-content-center"
      style={{ backgroundColor: colors.danger }}
    >
      <div style={{ width: CONTENT_WIDTH }}>{children}</div>
    </div>
  );
}
export default connect(BlockWrapper);
