import { useState, useEffect } from "react";
import { connect } from "frontity";
import { Dropdown } from "react-bootstrap";

import { colors } from "../../config/colors";

const QuickLinksDropDown = ({ state, actions, libraries }) => {
  const Html2React = libraries.html2react.Component; // Get the component exposed by html2react.

  const MENU_DATA = [
    {
      title: "Patient Information Leaflets",
      slug: "slug",
    },
    {
      title: "BAD Affiliated Groups",
      slug: "slug",
    },
    {
      title: "Find a Dermatologist",
      slug: "slug",
    },
    {
      title: "Patient Hub",
      slug: "slug",
    },
    {
      title: "COVID 19 Information",
      slug: "slug",
    },
    {
      title: "CED Journal",
      slug: "slug",
    },
    {
      title: "BJD Journal",
      slug: "slug",
    },
    {
      title: "SHD Journal",
      slug: "slug",
    },
    {
      title: "Clinical Guidelines",
      slug: "slug",
    },
  ];

  // HELPERS ---------------------------------------------
  const handleGoToPath = ({ slug }) => {
    actions.router.set(`/${slug}`);
  };

  // SERVERS ----------------------------------------------------------
  const ServeDivider = () => {
    return (
      <div className="flex">
        <div className="flex" />
        <div
          style={{
            height: 20,
            minWidth: 140,
            backgroundColor: colors.lightSilver,
          }}
        />
      </div>
    );
  };

  const ServeMenu = () => {
    return (
      <div style={{ paddingBottom: `1em` }}>
        {MENU_DATA.map((item, key) => {
          const { title, slug } = item;

          return (
            <div
              key={key}
              className="flex-row"
              style={{
                padding: `1em 2em`,
              }}
            >
              <Dropdown.Item
                onClick={() => handleGoToPath({ slug })}
                style={{
                  padding: `0 0 1em`,
                  borderBottom: `1px dotted ${colors.silver}`,
                }}
              >
                <Html2React html={title} />
              </Dropdown.Item>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="dropdown">
      <div>
        <Dropdown align="end">
          <Dropdown.Toggle
            variant="shadow-none btn-m"
            style={styles.dropDownBtn}
            id="dropdown-basic"
          >
            Quick Links
          </Dropdown.Toggle>
          <Dropdown.Menu style={{ border: "none", padding: 0 }}>
            <div style={{ marginTop: `-10px` }}>
              <ServeDivider />

              <div style={styles.dropDown}>
                <ServeMenu />
              </div>
            </div>
          </Dropdown.Menu>
        </Dropdown>
      </div>
    </div>
  );
};

const styles = {
  dropDownBtn: {
    fontSize: 16,
    backgroundColor: colors.lightSilver,
    textTransform: "capitalize",
    border: "none",
  },
  dropDown: {
    backgroundColor: colors.lightSilver,
    minWidth: 240,
    border: "none",
  },
};

export default connect(QuickLinksDropDown);
