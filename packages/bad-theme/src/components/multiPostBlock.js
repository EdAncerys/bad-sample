import { useState, useEffect } from "react";
import { connect } from "frontity";

import Card from "./card";
import Loading from "./loading";

const MultiPostBlock = ({ state, actions, item }) => {
  if (!item) return <Loading />;
  // RETURN ---------------------------------------------------
  return (
    <div>
      <div style={styles.container}>
        {item.map((item) => {
          const { id, title, body, url, imgUrl } = item;

          return (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                margin: `1em 0`,
              }}
            >
              <Card
                key={id}
                cardTitle="Officers Of The BAD"
                title={title}
                body={body}
                url={url}
                cardWidth="90%" // optional param
                // imgUrl={imgUrl} // optional param
                shadow // optional param
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: "grid",
    gridTemplateColumns: `repeat(3, 1fr)`,
    justifyContent: "space-around",
  },
};

export default connect(MultiPostBlock);
