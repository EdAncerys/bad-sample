import { connect } from "frontity";
import { colors } from "../config/colors";
import { muiQuery } from "../context";

const BlockWrapper = ({ children, state, background, fullWidth }) => {
  const { sm, md, lg, xl } = muiQuery();
  const data = state.source.get(state.router.link);

  const containerWidth = state.theme.contentContainer;

  let STYLES = !lg ? { display: "flex", flex: 1 } : null;

  if (data.isPost || data.isPage) STYLES = !lg ? { display: "grid" } : null;

  return (
    <div className="block">
      <div
        style={{
          ...STYLES,
          backgroundColor: background || null,
          justifyContent: "center",
          paddingTop: !lg ? "auto" : 0,
        }}
      >
        <div
          style={{
            width: !lg ? containerWidth : null,
            overflow: !lg ? null : "hidden",
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
};
export default connect(BlockWrapper);
