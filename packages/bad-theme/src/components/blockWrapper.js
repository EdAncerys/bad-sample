import { connect } from "frontity";
import { colors } from "../config/colors";

const BlockWrapper = ({ children, state, background }) => {
  const data = state.source.get(state.router.link);

  const CONTENT_WIDTH = state.theme.contentContainer;

  let STYLES = { display: "flex", flex: 1 };
  let PAGE_STYLES = "flex";

  if (data.isPost || data.isPage) {
    PAGE_STYLES = "block";
    STYLES = { display: "grid" };
  }

  return (
    <div className={PAGE_STYLES} style={{ justifyContent: "center" }}>
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
