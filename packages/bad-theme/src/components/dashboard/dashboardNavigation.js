import { useState, useEffect } from "react";
import { connect } from "frontity";

import { colors } from "../../config/imports";

const DashboardNavigation = ({ state, actions, libraries }) => {
  const Html2React = libraries.html2react.Component; // Get the component exposed by html2react.

  const marginVertical = state.theme.marginVertical;

  // HELPERS ----------------------------------------------------------------
  const handleNavigate = () => {
    const searchInput = document.querySelector(`#searchInput${id}`).value;

    const serveFilterOne = document.querySelector(`#serveFilterOne${id}`).value;
    const serveFilterTwo = document.querySelector(`#serveFilterTwo${id}`).value;

    if (!!searchInput) setSearchFilter(searchInput);
    if (!!serveFilterOne) setGradesFilter(serveFilterOne);
    if (!!serveFilterTwo) setLocationsFilter(serveFilterTwo);
  };

  return (
    <div
      className="shadow"
      style={{
        display: "flex",
        justifyContent: "space-around",
        padding: `${marginVertical}px 0`,
        marginBottom: `${marginVertical}px`,
      }}
    >
      <div
        style={{ borderBottom: `1px solid ${colors.darkSilver}` }}
        onClick={handleNavigate}
      >
        Dashboard
      </div>
      <div>Events</div>
      <div>Directory</div>
      <div>My Account</div>
    </div>
  );
};

const styles = {
  container: {},
};

export default connect(DashboardNavigation);
