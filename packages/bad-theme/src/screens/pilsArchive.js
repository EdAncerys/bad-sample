import { useState, useEffect, useRef } from "react";
import { connect } from "frontity";

import Loading from "../components/loading";
import { colors } from "../config/imports";
import { setGoToAction } from "../context";
import SearchContainer from "../components/searchContainer";

import CloseIcon from "@mui/icons-material/Close";

import { muiQuery } from "../context";
// BLOCK WIDTH WRAPPER -------------------------------------------------------
import BlockWrapper from "../components/blockWrapper";

const PilsArchive = ({ state, actions, libraries }) => {
  const { sm, md, lg, xl } = muiQuery();

  const Html2React = libraries.html2react.Component; // Get the component exposed by html2react.

  const data = state.source.get(state.router.link);
  const pilPageData = state.source[data.type][data.id];
  // console.log("pageData ", data); // debug

  const [searchFilter, setSearchFilter] = useState(null);
  const [pilList, setPilList] = useState(null);

  const searchFilterRef = useRef(true);

  const marginHorizontal = state.theme.marginHorizontal;
  const marginVertical = state.theme.marginVertical;

  // DATA pre FETCH ----------------------------------------------------------------
  useEffect(async () => {
    // fetch data via wp API page by page
    await actions.source.fetch(`/pils/`); // fetch pil archive page content
    let pilArhive = await state.source.get(`/pils/`);
    const { totalPages, page, next } = pilArhive; // check if data have multiple pages

    let isThereNextPage = next;
    while (isThereNextPage) {
      await actions.source.fetch(isThereNextPage); // fetch next page
      const nextPage = state.source.get(isThereNextPage).next; // check ifNext page & set next page
      isThereNextPage = nextPage;
    }

    setPilList(Object.values(state.source.pils)); // add pill object to data array

    return () => {
      searchFilterRef.current = false; // clean up function
    };
  }, []);
  // DATA pre FETCH ----------------------------------------------------------------

  if (!pilList) return <Loading />;

  let ALPHABET = [];
  pilList.map((item) => {
    const pilTitle = item.title.rendered;
    if (!pilTitle) return null;

    if (!isNaN(pilTitle[0])) {
      if (ALPHABET.includes("0-9")) return null;
      ALPHABET.push("0-9");
    }
    if (isNaN(pilTitle[0]) && !ALPHABET.includes(pilTitle[0].toUpperCase()))
      ALPHABET.push(pilTitle[0].toUpperCase());
  });
  ALPHABET.sort(); // sorts array alphabetically

  // HELPERS ----------------------------------------------------------------
  const handleSearch = () => {
    const input = searchFilterRef.current.value.toLowerCase();
    if (!!input) {
      const filter = pilList.filter((pil) =>
        pil.title.rendered.toLowerCase().includes(input)
      );

      setSearchFilter(input);
      setPilList(filter);
    }
  };

  const handleClearFilter = () => {
    setSearchFilter(null);
    setPilList(Object.values(state.source.pils));
  };

  // SERVERS --------------------------------------------------------
  const ServePilsList = ({ item }) => {
    const ServePil = ({ pil }) => {
      const { link, title } = pil;
      if (!title.rendered) return null;
      if (item !== title.rendered[0] && isNaN(title.rendered[0])) return null;
      if (item !== "0-9" && !isNaN(title.rendered[0])) return null;

      return (
        <div
          className="pil-title"
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
          className="primary-title"
          style={{
            fontSize: !lg ? 36 : 25,
            borderBottom: `1px solid ${colors.darkSilver}`,
          }}
        >
          {item}
        </div>
        <div style={{ padding: `1em 0` }}>
          {pilList.map((pil, key) => {
            if (searchFilter) {
              if (
                !pil.title.rendered
                  .toLowerCase()
                  .includes(searchFilter.toLowerCase())
              )
                return null;
            }

            return <ServePil key={key} pil={pil} />;
          })}
        </div>
      </div>
    );
  };

  const ServeInfo = () => {
    if (!pilPageData) return null;

    const { title, content } = pilPageData;

    const ServeTitle = () => {
      if (!title) return null;

      return (
        <div
          className="flex primary-title"
          style={{ fontSize: !lg ? 36 : 25, alignItems: "center" }}
        >
          <Html2React html={title.rendered} />
        </div>
      );
    };

    const ServeBody = () => {
      if (!content) return null;

      return (
        <div className="flex-col" style={{ padding: `1em 0`, width: "70%" }}>
          <Html2React html={content.rendered} />
        </div>
      );
    };
    return (
      <div
        className="flex-col"
        style={{ padding: `${marginVertical}px ${marginHorizontal}px` }}
      >
        <ServeTitle />
        <ServeBody />
      </div>
    );
  };

  const ServeFilter = () => {
    const ServeSearchFilter = () => {
      if (!searchFilter) return null;

      return (
        <div className="shadow filter">
          <div>{searchFilter}</div>
          <div className="filter-icon" onClick={handleClearFilter}>
            <CloseIcon
              style={{
                fill: colors.darkSilver,
                padding: 0,
              }}
            />
          </div>
        </div>
      );
    };

    return (
      <div
        style={{
          backgroundColor: colors.silverFillTwo,
          marginBottom: `${state.theme.marginVertical}px`,
          padding: `2em 0`,
        }}
      >
        <BlockWrapper>
          <div style={{ padding: `0 ${marginHorizontal}px` }}>
            <SearchContainer
              title="Search for Patient Information Leaflets"
              width="70%"
              searchFilterRef={searchFilterRef}
              handleSearch={handleSearch}
            />
            <div className="flex" style={{ margin: "0.5em 0" }}>
              <ServeSearchFilter />
            </div>
          </div>
        </BlockWrapper>
      </div>
    );
  };

  // RETURN ----------------------------------------------------------------
  return (
    <div>
      <BlockWrapper>
        <ServeInfo />
      </BlockWrapper>
      <ServeFilter />
      <BlockWrapper>
        <div style={{ margin: `${marginVertical}px ${marginHorizontal}px` }}>
          <div style={styles.container}>
            {ALPHABET.map((item, key) => {
              return <ServePilsList key={key} item={item} />;
            })}
          </div>
        </div>
      </BlockWrapper>
    </div>
  );
};

const styles = {
  container: {
    display: "grid",
    gridTemplateColumns: `repeat(3, 1fr)`,
    gap: 20,
  },
  input: {
    borderRadius: 10,
  },
};

export default connect(PilsArchive);
