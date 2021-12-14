import { useState, useEffect } from "react";
import { connect } from "frontity";

import Benefit from "./benefit";
import { colors } from "../config/colors";
import Loading from "./loading";

const BenefitsGrid = ({ state, actions, libraries, block }) => {
  const Html2React = libraries.html2react.Component; // Get the component exposed by html2react.

  if (!block) return <Loading />;
  if (!block.benefits_card) return null;

  const marginHorizontal = state.theme.marginHorizontal;
  const marginVertical = state.theme.marginVertical;

  // RETURN ---------------------------------------------------
  return (
    <div
      style={{
        padding: `${marginVertical}px ${marginHorizontal}px`,
        backgroundColor: colors.silverFillTwo,
      }}
    >
      <div style={styles.container}>
        {block.benefits_card.map((block, key) => {
          return <Benefit key={key} block={block} />;
        })}
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: "grid",
    gridTemplateColumns: `repeat(4, 1fr)`,
    justifyContent: "space-between",
    gap: 15,
  },
};

export default connect(BenefitsGrid);
