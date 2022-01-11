import { useState, useEffect } from "react";
import { connect } from "frontity";

const Events = ({ state, actions, libraries }) => {
  const Html2React = libraries.html2react.Component; // Get the component exposed by html2react.

  // HELPERS ---------------------------------------------

  return (
    <div style={styles.container}>
      <div></div>
    </div>
  );
};

const styles = {
  container: {},
};

export default connect(Events);
