import { useState, useEffect } from "react";
import { connect } from "frontity";

import Card from "./card";
import Loading from "./loading";

const MultiPostBlock = ({ state, actions, item }) => {
  if (!item) return <Loading />;
  // RETURN ---------------------------------------------------
  return (
    <div style={styles.container}>
      <div className="d-flex" style={{ justifyContent: "space-around" }}>
        {item.map((item) => {
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
