import { connect } from "frontity";

const BlockWrapper = ({ children, state, background }) => {
  const data = state.source.get(state.router.link);

  const CONTENT_WIDTH = state.theme.contentContainer;

  let STYLES = { display: "flex", flex: 1 };

  if (data.isPost || data.isPage) STYLES = { display: "grid" };

  return (
    <div className="block">
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
