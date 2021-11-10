import { useState, useEffect } from "react";
import { connect } from "frontity";
import Image from "@frontity/components/image";

const SCREEN_NAME = ({ state, actions }) => {
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

export default connect(SCREEN_NAME);
