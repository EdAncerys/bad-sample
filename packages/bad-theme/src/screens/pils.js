import React from "react";
import { connect, styled } from "frontity";

import Loading from "../components/loading";
import { colors } from "../config/colors";
import { ALPHABET } from "../helpers/data";

const Pils = ({ state, actions, libraries }) => {
  const Html2React = libraries.html2react.Component; // Get the component exposed by html2react.
  const data = state.source.get(state.router.link);
  const PIL_LIST = Object.values(state.source.pils);

  const marginHorizontal = state.theme.marginHorizontal;
  const marginVertical = state.theme.marginVertical;

  if (!PIL_LIST) return <Loading />;

  // HELPERS ----------------------------------------------------
  const handleGoToAction = ({ slug }) => {
    actions.router.set(slug);
  };

  // SERVERS --------------------------------------------------------
  const ServePilsList = ({ item }) => {
    const ServePil = ({ pil }) => {
      // console.log("--------", pil);
      const { slug, title } = pil;
      if (!title.rendered) return null;
      if (item !== title.rendered[0]) return null;

      return (
        <div
          className="pink"
          style={{ fontSize: 16, marginBottom: `0.25em`, cursor: "pointer" }}
          onClick={() => handleGoToAction({ slug })}
        >
          <Html2React html={title.rendered} />
        </div>
      );
    };

    return (
      <div>
        <div
          style={{
            fontSize: 36,
            fontWeight: "bold",
            borderBottom: `1px solid ${colors.darkSilver}`,
          }}
        >
          {item}
        </div>
        <div style={{ padding: `1em 0` }}>
          {PIL_LIST.map((pil, key) => {
            return <ServePil key={key} pil={pil} />;
          })}
        </div>
      </div>
    );
  };

  return (
    <div style={{ margin: `${marginVertical}px ${marginHorizontal}px` }}>
      <div style={styles.container}>
        {ALPHABET.map((item, key) => {
          return <ServePilsList key={key} item={item} />;
        })}
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: "grid",
    gridTemplateColumns: `repeat(3, 1fr)`,
    gap: 20,
  },
};

export default connect(Pils);
