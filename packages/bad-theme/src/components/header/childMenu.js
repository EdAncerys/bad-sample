import { useState, useEffect } from "react";
import { connect } from "frontity";

const ChildMenu = ({ state, actions, reference }) => {
  if (!state.theme.childMenuRef) return null;

  return (
    <div className="flex pink" style={{}}>
      {state.theme.childMenuRef}
    </div>
  );
};

const styles = {
  container: {},
};

export default connect(ChildMenu);
