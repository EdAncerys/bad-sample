import { useState, useEffect, useRef } from "react";
import { connect } from "frontity";

import TitleBlock from "./titleBlock";
import Card from "./card/card";
import Loading from "./loading";
import { colors } from "../config/imports";
import BlockWrapper from "./blockWrapper";
import SearchContainer from "./searchContainer";
import TypeFilters from "./typeFilters";
import CloseIcon from "@mui/icons-material/Close";
import { Form } from "react-bootstrap";

// CONTEXT ----------------------------------------------------------------
import {
  useAppDispatch,
  useAppState,
  setCPTBlockAction,
  setCPTBlockTypeAction,
  muiQuery,
  getCPTTaxonomy,
  getCPTData,
} from "../context";

const CPTBlock = ({ state, actions, libraries, block }) => {
  const { sm, md, lg, xl } = muiQuery();
  const {
    colour,
    background_colour,
    post_limit,
    disable_vertical_padding,
    add_search_function,
    acf_fc_layout,
  } = block;
  const dispatch = useAppDispatch();
  const { cptBlockFilter, cptBlockTypeFilter } = useAppState();

  const [postListData, setPostListData] = useState(null);
  const [postFilter, setPostFilter] = useState(null);
  const [groupeType, setGroupeType] = useState(null);

  const chunkRef = useRef(post_limit || 8);
  const [guidanceCategory, setCategory] = useState(null);
  const [searchFilter, setFilter] = useState(null);

  const searchFilterRef = useRef(null);
  const typeFilterRef = useRef(null);

  const marginHorizontal = state.theme.marginHorizontal;
  let marginVertical = state.theme.marginVertical;
  if (disable_vertical_padding) marginVertical = 0;

  const isCovid_19 = acf_fc_layout === "covid_loop_block";
  let postPath = `derm_groups_charity`;
  let typeFilter = `dermo_group_type`;
  let guidanceFilter = `guidance_category`;
  if (isCovid_19) {
    postPath = `covid_19`;
    typeFilter = `guidance`;
  }

  let PADDING = `${marginVertical}px 0`;
  if (add_search_function) PADDING = `0 0 ${marginVertical}px 0`;

  if (!block) return <Loading />;
  // DATA pre FETCH ----------------------------------------------------------------
  useEffect(() => {
    (async () => {
      try {
        if (isCovid_19) await getCPTTaxonomy({ state, type: guidanceFilter }); // set additional filter option to COVID-19
        let cptData = await getCPTData({ state, type: postPath });
        let cptTypes = await getCPTTaxonomy({ state, type: typeFilter });

        // set post lit values from filter value in app context
        if (cptBlockFilter) {
          cptData = cptData?.filter((item) => {
            let isCatList = null;
            let isIncludes = null;
            if (item[guidanceFilter])
              isCatList = Object.values(item[guidanceFilter]);
            // check data includes selected category
            if (isCatList)
              isIncludes = isCatList.includes(Number(cptBlockFilter));

            return isIncludes;
          });
        }
        // clear filter value in app context
        setCPTBlockAction({ dispatch, cptBlockFilter: "" });
        setGroupeType(cptTypes);

        if (postPath === `derm_groups_charity`) {
          // sort groupe data by title in alphabetical order
          cptData = cptData.sort((a, b) => {
            // break if no title
            if (!a.title || !b.title) return 0;
            let tile = a.title.rendered.toLowerCase();
            let tile2 = b.title.rendered.toLowerCase();

            if (tile < tile2) return -1;
            if (tile > tile2) return 1;
            return 0;
          });
        }

        let dataChunk = cptData.slice(0, Number(chunkRef.current));
        setPostFilter(dataChunk);
        setPostListData(cptData); // apply limit on posts

        // if SIG is selected, filter by SIG type
        if (cptBlockTypeFilter) {
          // for SIGs apps get type id that represents the SIG type filter & apply
          let interestGroupsId = null;
          const sigApp = cptTypes?.filter((item) => {
            return item.name
              .toLowerCase()
              .includes("Special Interest".toLowerCase());
          });
          if (sigApp.length > 0) {
            interestGroupsId = sigApp[0].id;
          }
          // get if from  groupeType filter where name includes Special Interest Group
          typeFilterRef.current = interestGroupsId;
          setCPTBlockTypeAction({
            dispatch,
            cptBlockTypeFilter: interestGroupsId,
          });
        }
      } catch (error) {
        // console.log(error);
      }
    })();
  }, []);

  // if serach queries are set, filter the full data set
  useEffect(() => {
    if (!postListData) return null;
    let groupData = postListData;

    // --------------------------------------------------------------------------------
    // 📌 apply filters to posts
    // --------------------------------------------------------------------------------
    if (searchFilter) {
      // serach input filtering
      groupData = groupData.filter((item) => {
        let isInTitle = null;
        let isInBody = null;

        if (item.title)
          isInTitle = item.title.rendered
            .toLowerCase()
            .includes(searchFilter.toLowerCase());
        if (item.content)
          isInBody = item.content.rendered
            .toLowerCase()
            .includes(searchFilter.toLowerCase());

        return isInBody || isInTitle;
      });
    }
    if (cptBlockFilter) {
      // guidance type filtering
      groupData = groupData.filter((item) => {
        let isCatList = null;
        let isIncludes = null;
        if (item[guidanceFilter]) isCatList = item[guidanceFilter];
        // check data includes selected category
        if (isCatList) isIncludes = isCatList.includes(Number(cptBlockFilter));
        return isIncludes;
      });
    }
    if (cptBlockTypeFilter) {
      // type filtering
      groupData = groupData.filter((item) => {
        let isCatList = null;
        let isIncludes = null;
        if (item[typeFilter]) isCatList = item[typeFilter];
        // check data includes selected category
        if (isCatList)
          isIncludes = isCatList.includes(Number(cptBlockTypeFilter));
        return isIncludes;
      });
    }

    // 📌 if all filters are cleared, reset the data set & apply limit
    if (!searchFilter && !cptBlockFilter && !cptBlockTypeFilter) {
      setPostFilter(groupData.slice(0, Number(chunkRef.current)));
    } else {
      setPostFilter(groupData);
    }
  }, [searchFilter, cptBlockTypeFilter, cptBlockFilter]);

  // DATA pre FETCH ---------------------------------------------------------
  if (!postListData || !groupeType) return <Loading />;

  // HELPERS ----------------------------------------------------------------
  const handleLoadMoreFilter = async () => {
    let data = postListData;

    // increment chunkRef value by 8
    chunkRef.current = chunkRef.current + 8;
    setPostFilter(data.slice(0, Number(chunkRef.current)));
  };

  const inputSearchHandler = () => {
    const input = searchFilterRef.current.value;
    setFilter(input);
  };

  // SERVERS ----------------------------------------------------------------
  const ServeFilter = () => {
    if (!add_search_function) return null;

    const ServeSearchFilter = () => {
      if (!searchFilter) return null;

      return (
        <div className="shadow filter">
          <div>{searchFilter}</div>
          <div className="filter-icon" onClick={() => setFilter("")}>
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

    const ServeGuidanceFilter = () => {
      if (!cptBlockFilter) return null;

      let name = "Category";
      name = guidanceCategory.filter(
        (item) => item.id === Number(cptBlockFilter)
      )[0];
      if (name) name = name.name; // apply category filter name

      return (
        <div className="shadow filter">
          <div>{name}</div>
          <div
            className="filter-icon"
            onClick={() => setCPTBlockAction({ dispatch, cptBlockFilter: "" })}
          >
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

    const ServeGuidanceType = () => {
      if (!guidanceCategory) return null;

      return (
        <div
          style={{
            marginTop: "auto",
            padding: `1em 0 1em ${state.theme.marginVertical}px`,
          }}
        >
          <Form.Select
            name="guidance"
            value={cptBlockFilter}
            onChange={(e) =>
              setCPTBlockAction({ dispatch, cptBlockFilter: e.target.value })
            }
            className="input"
            style={{ height: 45 }}
          >
            <option value="" hidden>
              Select Guidance Category
            </option>
            {guidanceCategory.map((item, key) => {
              return (
                <option key={key} value={item.id}>
                  {item.name}
                </option>
              );
            })}
          </Form.Select>
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
          <div
            style={{
              padding: `0 ${marginHorizontal}px`,
              width: "100%",
            }}
            className="no-selector"
          >
            <div className="flex-row">
              <SearchContainer
                title={
                  isCovid_19
                    ? "Search for COVID 19 Resources"
                    : "Search for Dermatology Groups & Charities"
                }
                searchFilterRef={searchFilterRef}
                handleSearch={inputSearchHandler}
              />
              <ServeGuidanceType />
            </div>

            <div className="flex" style={{ margin: "0.5em 0" }}>
              <ServeSearchFilter />
              <ServeGuidanceFilter />
            </div>
            <TypeFilters
              filters={groupeType}
              typeFilterRef={typeFilterRef}
              handleSearch={({ id }) =>
                setCPTBlockTypeAction({ dispatch, cptBlockTypeFilter: id })
              }
              handleClearTypeFilter={() => {
                typeFilterRef.current = null;
                setCPTBlockTypeAction({ dispatch, cptBlockTypeFilter: null });
              }}
              title="Filter"
            />
          </div>
        </BlockWrapper>
      </div>
    );
  };

  const ServeLayout = () => {
    return (
      <div style={!lg ? styles.container : styles.containerMobile}>
        {postFilter.map((block, key) => {
          const { title, content, link, date, dermo_group_type } = block;
          const redirect = block.acf.redirect_url;
          const file = block.acf.file_download;
          let cardLink = link;
          if (redirect) cardLink = redirect.url;

          return (
            <Card
              key={key}
              title={title.rendered}
              publicationDate={date}
              body={isCovid_19 ? null : !lg ? content.rendered : null}
              link_label="Read More"
              link={file ? null : cardLink}
              downloadFile={file ? { file, label: "Download" } : null}
              colour={colour}
              cardMinHeight={250}
              bodyLimit={4}
              titleLimit={4}
              shadow
              animationType="none" // remove animation
            />
          );
        })}
      </div>
    );
  };

  const ServeMoreAction = () => {
    let isFilter = searchFilter || cptBlockTypeFilter || cptBlockFilter;

    if (post_limit || postFilter.length < chunkRef.current || isFilter)
      return null;

    return (
      <div
        className="flex"
        style={{
          justifyContent: "center",
          paddingTop: `2em`,
        }}
      >
        <div className="transparent-btn" onClick={handleLoadMoreFilter}>
          Load More
        </div>
      </div>
    );
  };

  // RETURN ---------------------------------------------------
  return (
    <div
      style={{
        padding: PADDING,
        backgroundColor: background_colour,
      }}
    >
      <BlockWrapper>
        <div style={{ padding: `0 ${marginHorizontal}px` }}>
          <TitleBlock
            block={block}
            margin={{
              marginBottom: `${
                add_search_function ? 0 : state.theme.marginVertical
              }px`,
            }}
          />
        </div>
      </BlockWrapper>
      <ServeFilter />
      <BlockWrapper>
        <div style={{ padding: `0 ${marginHorizontal}px` }}>
          <ServeLayout />
          <ServeMoreAction />
        </div>
      </BlockWrapper>
    </div>
  );
};

const styles = {
  container: {
    display: "grid",
    gridTemplateColumns: `repeat(4, 1fr)`,
    justifyContent: "space-between",
    gap: 20,
  },
  containerMobile: {
    display: "grid",
    gridTemplateColumns: `repeat(1, 1fr)`,
    justifyContent: "space-between",
    gap: 20,
  },
  input: {
    borderRadius: 10,
    paddingRight: 35,
  },
};

export default connect(CPTBlock);
