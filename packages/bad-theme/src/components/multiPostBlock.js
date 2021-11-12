import { useState, useEffect } from "react";
import { connect } from "frontity";

import Card from "./card";

const MultiPostBlock = ({ state, actions, data }) => {
  const array = data || [1, 2, 3]; // data to iterate

  return (
    <div style={styles.container}>
      <div className="d-flex" style={{ justifyContent: "space-around" }}>
        {array.map((item) => {
          return (
            <Card
              key={item}
              cardTitle="Officers Of The BAD"
              title="Education"
              body="Card Body"
              url
            />
          );
        })}
      </div>
    </div>
  );
};

const styles = {
  container: {},
};

export default connect(MultiPostBlock);
