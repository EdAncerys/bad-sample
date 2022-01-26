import { useState, useMemo } from "react";
import { connect } from "frontity";

import { colors } from "../config/imports";

const TypeFilter = ({
  state,
  actions,
  libraries,
  filters,
  typeFilterRef,
  title,
  handleSearch,
}) => {
  const Html2React = libraries.html2react.Component; // Get the component exposed by html2react.

  if (!filters) return null;

  const [typeFilter, setTypeFilter] = useState(null);

  const handleSetTypeFilter = ({ id }) => {
    setTypeFilter(id);
    typeFilterRef.current = id;

    handleSearch();
  };

  const ServeTitle = () => {
    return (
      <div
        className="flex primary-title"
        style={{
          fontSize: 30,
          alignItems: "center",
        }}
      >
        {title || "Search"}
      </div>
    );
  };

  const ServeFilter = () => {
    return (
      <div className="flex-row" style={{ flexWrap: "wrap" }}>
        <div
          className="shadow filter-action"
          onClick={() => handleSetTypeFilter({ id: null })}
          style={{
            backgroundColor: !typeFilter ? colors.primary : colors.white,
            color: !typeFilter ? colors.white : colors.softBlack,
          }}
        >
          <Html2React html={"All"} />
        </div>

        {filters.map((type, key) => {
          return (
            <div
              key={key}
              className="shadow filter-action"
              onClick={() => handleSetTypeFilter({ id: type.id })}
              style={{
                backgroundColor:
                  typeFilter === type.id ? colors.primary : colors.white,
                color: typeFilter === type.id ? colors.white : colors.softBlack,
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
      {useMemo(
        () => (
          <ServeFilter />
        ),
        [typeFilter]
      )}
    </div>
  );
};

export default connect(TypeFilter);
