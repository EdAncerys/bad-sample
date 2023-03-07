import { useState, useEffect, useRef } from "react";
import { connect } from "frontity";

import TitleBlock from "./titleBlock";
import Card from "./card/card";
import Accordion from "./accordion/accordion";
import Loading from "./loading";
import { colors } from "../config/imports";
import BlockWrapper from "./blockWrapper";
import SearchContainer from "./searchContainer";
import TypeFilters from "./typeFilters";

import date from "date-and-time";
const DATE_MODULE = date;

import CloseIcon from "@mui/icons-material/Close";
// CONTEXT --------------------------------------------------------
import { getFundingData, getFundingTypes, muiQuery } from "../context";
import { compose } from "@mui/system";

const CPTBlock = ({ state, actions, libraries, block }) => {
  const { lg } = muiQuery();
  const {
    colour,
    background_colour,
    post_limit,
    disable_vertical_padding,
    add_search_function,
    layout,
    preview,
    funding_filter,
  } = block;
  const [postListData, setPostListData] = useState(null);
  const [postFilter, setPostFilter] = useState(null);
  const [groupeType, setGroupeType] = useState(null);

  const [searchFilter, setFilter] = useState("");
  const [fundingFilter, setFunding] = useState("");
  const [dateFilter, setDate] = useState("");

  const filterRef = useRef("");
  const typeFilterRef = useRef(null);
  const fundingRef = useRef("");
  const dateRef = useRef("");

  const postLimit = Number(post_limit) || 10; // max limit
  const chunkRef = useRef(postLimit);

  if (!block) return <Loading />;

  const marginHorizontal = state.theme.marginHorizontal;
  let marginVertical = state.theme.marginVertical;
  if (disable_vertical_padding) marginVertical = 0;

  const isAccordion = layout === "accordion";

  let PADDING = `${marginVertical}px 0`;
  if (add_search_function) PADDING = `0 0 ${marginVertical}px 0`;

  // DATA pre FETCH ----------------------------------------------------------------
  useEffect(async () => {
    (async () => {
      try {
        let fundingList = await getFundingData({ state });
        const types = await getFundingTypes({ state });

        if (funding_filter !== "All Levels") {
          fundingList = fundingList.filter((item) =>
            item.funding_type.includes(Number(funding_filter))
          );
        }
        if (post_limit) fundingList = fundingList.slice(0, Number(post_limit)); // apply limit on posts

        setPostFilter(fundingList);
        setPostListData(fundingList);
        setGroupeType(types);
      } catch (error) {
        // console.log('⭐️ ', error);
      }
    })();
  }, []);

  // DATA pre FETCH ---------------------------------------------------------
  if (!postListData || !groupeType) return <Loading />;

  // HELPERS ----------------------------------------------------------------
  const handleLoadMoreFilter = async () => {
    // increment chunk by postLimit
    chunkRef.current = chunkRef.current + postLimit;
    handleSearch();
  };

  const handleSearch = () => {
    const input = filterRef.current.value;
    const type = typeFilterRef.current;
    const date = dateRef.current;
    const funding = fundingRef.current;

    let data = postListData;

    if (type) {
      data = data.filter((item) => item.funding_type.includes(type));
    }

    if (funding) {
      data = data.filter((item) => item.acf.amount_filter === funding);
    }

    if (date) {
      data = data.filter((item) => {
        const closingDate = item.acf.closing_date;
        if (!closingDate) return null;
        // format dates to MMMM YYYY
        const dateObject = new Date(closingDate);
        const formattedDate = DATE_MODULE.format(dateObject, "MMMM YYYY");
        return formattedDate === date;
      });
    }

    if (input) {
      data = data.filter((item) => {
        let title = item.title.rendered;
        let content = item.acf.overview;

        if (title) title = title.toLowerCase().includes(input.toLowerCase());
        if (content)
          content = content.toLowerCase().includes(input.toLowerCase());

        return title || content;
      });
    }

    if (post_limit) data = data.slice(0, Number(chunkRef.current)); // apply limit on posts

    setPostFilter(data);
    setFilter(input);
  };

  const handleTypeSearch = ({ id }) => {
    typeFilterRef.current = id;
    handleSearch();
  };

  const handleClearTypeFilter = () => {
    typeFilterRef.current = null;
    handleSearch();
  };

  const handleClearSearchFilter = () => {
    setFilter(null);
    filterRef.current.value = "";

    handleSearch();
  };

  const handleClearFundingFilter = () => {
    setFunding("");
    fundingRef.current = "";

    handleSearch();
  };

  const handleDateSearch = ({ e }) => {
    const date = e.target.value;
    dateRef.current = date;
    setDate(date);

    handleSearch();
  };

  const handleFundingSearch = ({ e }) => {
    const funding = e.target.value;
    fundingRef.current = funding;
    setFunding(funding);

    handleSearch();
  };

  const handleClearDateFilter = () => {
    setDate("");
    dateRef.current = "";

    handleSearch();
  };

  // SERVERS ----------------------------------------------------------------
  const ServeAmountFilter = () => {
    let data = postListData;
    // set dateFilter to post dates
    let allFundings = [];
    data.filter((item) => {
      const fundingFilter = item.acf.amount_filter;
      if (fundingFilter) allFundings.push(fundingFilter);
    });
    // get unique month & year from allDates array and set to allDates
    let uniqueFundings = [...new Set(allFundings)];
    // sort funding by amount assending
    uniqueFundings.sort((a, b) => a - b);
    // add comma to each thousand
    uniqueFundings = uniqueFundings.map((item) => {
      return item.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    });

    return (
      <div
        style={{
          marginTop: "auto",
          padding: `1em 0 1em ${state.theme.marginVertical}px`,
        }}
      >
        <select
          name="guidance"
          value={fundingFilter}
          onChange={(e) => handleFundingSearch({ e })}
          className="input"
          style={{ height: 45, borderRadius: 10, width: !lg ? null : "100%" }}
        >
          <option value="" hidden>
            Select Funding Rate
          </option>
          {uniqueFundings.map((item, key) => {
            return (
              <option key={key} value={item}>
                £ {item}
              </option>
            );
          })}
        </select>
      </div>
    );
  };

  const ServeClosingDates = () => {
    let data = postListData;
    // set dateFilter to post dates
    let allDates = [];
    data.filter((item) => {
      const date = item.acf.closing_date;
      if (date) {
        // format dates to MMMM YYYY
        const dateObject = new Date(date);
        const formattedDate = DATE_MODULE.format(dateObject, "MMMM YYYY");

        allDates.push(formattedDate);
      }
    });
    // get unique month & year from allDates array and set to allDates
    let uniqueDates = [...new Set(allDates)];
    // if no dates, return null
    if (!uniqueDates.length) return null;

    return (
      <div
        style={{
          marginTop: "auto",
          padding: !lg
            ? `1em 0 1em ${state.theme.marginVertical}px`
            : `0em 0 1em ${state.theme.marginVertical}px`,
        }}
      >
        <select
          name="guidance"
          value={dateFilter}
          onChange={(e) => handleDateSearch({ e })}
          className="input"
          style={{ height: 45, borderRadius: 10, width: !lg ? null : "100%" }}
        >
          <option value="" hidden>
            Select Closing Date
          </option>
          {uniqueDates.map((item, key) => {
            return (
              <option key={key} value={item}>
                {item}
              </option>
            );
          })}
        </select>
      </div>
    );
  };

  const ServeFilter = () => {
    if (!add_search_function) return null;

    const ServeSearchFilter = () => {
      if (!searchFilter) return null;

      return (
        <div className="shadow filter">
          <div>{searchFilter}</div>
          <div className="filter-icon" onClick={handleClearSearchFilter}>
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

    const ServeFundingFilter = () => {
      if (!fundingFilter) return null;

      return (
        <div className="shadow filter">
          <div>{fundingFilter} £</div>
          <div className="filter-icon" onClick={handleClearFundingFilter}>
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

    const ServeDateFilter = () => {
      if (!dateFilter) return null;

      return (
        <div className="shadow filter">
          <div>{dateFilter}</div>
          <div className="filter-icon" onClick={handleClearDateFilter}>
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
        className="no-selector"
      >
        <BlockWrapper>
          <div style={{ padding: `0 ${marginHorizontal}px` }}>
            <div className={!lg ? "flex" : "flex-col"}>
              <SearchContainer
                title={isAccordion ? null : "Research Funding"}
                width="100%"
                searchFilterRef={filterRef}
                handleSearch={handleSearch}
              />
              <ServeAmountFilter />
              <ServeClosingDates />
            </div>
            <div className="flex" style={{ margin: "0.5em 0" }}>
              <ServeSearchFilter />
              <ServeFundingFilter />
              <ServeDateFilter />
            </div>
            {/* <TypeFilters
              filters={groupeType}
              handleSearch={handleTypeSearch}
              typeFilterRef={typeFilterRef}
              handleClearTypeFilter={handleClearTypeFilter}
              title="Filter"
            /> */}
          </div>
        </BlockWrapper>
      </div>
    );
  };

  const ServeLayout = () => {
    if (isAccordion)
      return (
        <div>
          <Accordion
            block={{
              accordion_item: postFilter,
              disable_vertical_padding,
            }}
            fundingBlock
            hasPreview={preview}
          />
        </div>
      );

    return (
      <div
        style={{
          display: "grid",
          gridTemplateColumns: !lg ? `repeat(3, 1fr)` : "1fr",
          justifyContent: "space-between",
          gap: 20,
          padding: `0 ${marginHorizontal}px`,
        }}
      >
        {postFilter.map((block, key) => {
          const { title, content, link, date, dermo_group_type } = block.acf;

          return (
            <Card
              key={key}
              fundingHeader={block}
              publicationDate={date}
              body={block.acf.overview}
              bodyLimit={4}
              link_label="Read More"
              link={block.acf.external_application_link}
              colour={colour}
              shadow
            />
          );
        })}
      </div>
    );
  };

  const ServeMoreAction = () => {
    if (!post_limit || postFilter.length < chunkRef.current) return null;

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
        <TitleBlock
          block={block}
          margin={{
            marginBottom: `${
              add_search_function ? 0 : state.theme.marginVertical
            }px`,
          }}
        />
      </BlockWrapper>
      <ServeFilter />
      <BlockWrapper>
        <ServeLayout />
        <ServeMoreAction />
      </BlockWrapper>
    </div>
  );
};

const styles = {
  container: {},
};

export default connect(CPTBlock);
