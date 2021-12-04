import { useState, useEffect } from "react";
import { connect, styled } from "frontity";

import Loading from "../components/loading";
import { colors } from "../config/colors";
import { setGoToAction } from "../context";

const PilsArchive = ({ state, actions, libraries }) => {
  const Html2React = libraries.html2react.Component; // Get the component exposed by html2react.

  const [isReady, seIsReady] = useState(false);
  const data = state.source.get(state.router.link);
  const { totalPages, page, next } = data; // check if data have multiple pages

  // DATA pre FETCH ----------------------------------------------------------------
  useEffect(async () => {
    // fetch data via wp API page by page
    let isThereNextPage = next;
    while (isThereNextPage) {
      await actions.source.fetch(isThereNextPage); // fetch next page
      const nextPage = state.source.get(isThereNextPage).next; // check ifNext page & set next page
      isThereNextPage = nextPage;
    }
    seIsReady(true);
  }, []);
  const PIL_LIST = Object.values(state.source.pils); // add pill object to data array
  // DATA pre FETCH ----------------------------------------------------------------

  const marginHorizontal = state.theme.marginHorizontal;
  const marginVertical = state.theme.marginVertical;

  if (!isReady) return <Loading />;

  let ALPHABET = ["0-9"];
  PIL_LIST.map((item) => {
    const pilTitle = item.title.rendered;
    if (!pilTitle) return null;

    if (!isNaN(pilTitle[0])) {
      if (ALPHABET.includes("0-9")) return null;
      ALPHABET.push("0-9");
    }
    if (ALPHABET.includes(pilTitle[0].toUpperCase())) return null;
    ALPHABET.push(pilTitle[0].toUpperCase());
  });

  if (!ALPHABET.length) return <Loading />; // awaits for pil data to be processed

  // SERVERS --------------------------------------------------------
  const ServePilsList = ({ item }) => {
    const ServePil = ({ pil }) => {
      const { link, title } = pil;
      if (!title.rendered) return null;
      if (item !== title.rendered[0] && isNaN(title.rendered[0])) return null;
      if (item !== "0-9" && !isNaN(title.rendered[0])) return null;

      return (
        <div
          style={{ fontSize: 16, marginBottom: `0.25em`, cursor: "pointer" }}
          onClick={() => setGoToAction({ path: link, actions })}
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

  // RETURN ----------------------------------------------------------------
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

export default connect(PilsArchive);
