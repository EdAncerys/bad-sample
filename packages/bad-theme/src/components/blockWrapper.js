import { connect } from "frontity";
function BlockWrapper({ children, state }) {
  const CONTENT_WIDTH = state.theme.contentContainer;

  return (
    <div className="d-flex justify-content-center">
      <div style={{ width: CONTENT_WIDTH }}>{children}</div>
    </div>
  );
}
export default connect(BlockWrapper);
