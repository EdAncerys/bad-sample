import { connect } from "frontity";
// --------------------------------------------------------------------------------

const Caption = ({ caption }) => {
  if (!caption) return null;

  return <div style={{ margin: "0.5em 0", fontSize: 14 }}>*{caption}</div>;
};

export default connect(Caption);
