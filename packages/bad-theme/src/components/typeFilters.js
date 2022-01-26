import { useState } from "react";
import { connect } from "frontity";

import { colors } from "../config/imports";

const TypeFilters = ({
  state,
  actions,
  libraries,
  filters,
  typeFilterRef,
  title,
  handleSearch,
  removeAllFilter,
}) => {
  const Html2React = libraries.html2react.Component; // Get the component exposed by html2react.

  if (!filters) return null;

  // HELPERS ----------------------------------------------------------------
  const handleSetTypeFilter = ({ id }) => {
    typeFilterRef.current = id;
    handleSearch();
  };

  // SERVERS ----------------------------------------------------------------
  const ServeTitle = () => {
    if (!title) return null;

    return (
      <div
        className="flex primary-title"
        style={{
          fontSize: 30,
          alignItems: "center",
        }}
      >
        {title}
      </div>
    );
  };

  const ServeAllFilter = () => {
    if (removeAllFilter) return null;

    return (
      <div
        className="shadow filter-action"
        onClick={() => handleSetTypeFilter({ id: null })}
        style={{
          backgroundColor: !typeFilterRef.current
            ? colors.primary
            : colors.white,
          color: !typeFilterRef.current ? colors.white : colors.softBlack,
        }}
      >
        <Html2React html={"All"} />
      </div>
    );
  };

  const ServeFilter = () => {
    return (
      <div className="flex-row" style={{ flexWrap: "wrap" }}>
        <ServeAllFilter />

        {filters.map((type, key) => {
          return (
            <div
              key={key}
              className="shadow filter-action"
              onClick={() => handleSetTypeFilter({ id: type.id })}
              style={{
                backgroundColor:
                  typeFilterRef.current === type.id
                    ? colors.primary
                    : colors.white,
                color:
                  typeFilterRef.current === type.id
                    ? colors.white
                    : colors.softBlack,
              }}
            >
              <Html2React html={type.name} />
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div>
      <ServeTitle />
      <ServeFilter />
    </div>
  );
};

export default connect(TypeFilters);
