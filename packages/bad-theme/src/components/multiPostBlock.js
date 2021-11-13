import { useState, useEffect } from "react";
import { connect } from "frontity";

import Card from "./card";
import { DATA } from "../config/data.js";

const MultiPostBlock = ({ state, actions, data }) => {
  const array = data || DATA; // data to iterate

  return (
    <div style={styles.container}>
      <div className="d-flex" style={{ justifyContent: "space-around" }}>
        {array.map((item) => {
          const { id, title, body, url, imgUrl } = item;

          return (
            <Card
              key={id}
              cardTitle="Officers Of The BAD"
              title={title}
              body={body}
              url={url}
              imgUrl={imgUrl}
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
