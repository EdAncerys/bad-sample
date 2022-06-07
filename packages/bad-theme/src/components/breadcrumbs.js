import { useState, useEffect } from "react";
import { connect } from "frontity";
import { colors } from "../config/imports";

import BlockWrapper from "./blockWrapper";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { setGoToAction, muiQuery } from "../context";

const Breadcrumbs = ({ state, actions, libraries }) => {
  const { sm, md, lg, xl } = muiQuery();

  const Html2React = libraries.html2react.Component; // Get the component exposed by html2react.
  const urlPath = state.router.link;
  const data = state.source.get(urlPath);

  const [wpMenu, setWpMenu] = useState([]);

  if (urlPath.includes("/redirect/")) return null;
  const marginHorizontal = state.theme.marginHorizontal;
  const directions = urlPath.split("/").slice(1, -1);
  const directionLength = directions.length;
  const MARGIN = 10;
  let KEY = 0;

  useEffect(() => {
    // getting wp menu from state
    const data = state.theme.menu;
    if (!data) return;

    setWpMenu(data);
  }, [state.theme.menu]);

  // SERVERS ---------------------------------------------
  const ServePatchDirections = ({ item, nextKey }) => {
    let titleName = item;
    // title name tweaks
    if (titleName === "derm_groups_charity")
      titleName = "Dermatology Groups & Charities";
    if (titleName === "covid_19") titleName = "COVID-19";
    if (titleName === "pils") titleName = "Patient Information Leaflets";
    if (titleName === "the-bsds") titleName = "The BSDS";

    let chevron = (
      <ChevronRightIcon style={{ fontSize: 16, color: colors.darkSilver }} />
    );
    if (nextKey === directionLength) chevron = null;

    // HELPERS ---------------------------------------------
    const handleGoToLink = () => {
      const goToPath = urlPath.split("/").slice(1, nextKey + 1);
      let goToLink = `/${goToPath.join("/")}`;
      // console.log("goToPath", goToPath, "goToLink", goToLink);
      // REDIRECT HANDLERS -------------------------------------------------
      if (goToLink === "/derm_groups_charity/")
        goToLink = "/derm-groups-charity";
      if (goToLink === "/covid_19") goToLink = "/covid-19";
      if (goToLink === "/pils") goToLink = "/patient-information-leaflets";
      if (goToLink === "/derm_groups_charity")
        goToLink = "/derm-groups-charity";
      if (goToLink === "/venues") goToLink = "/events-content/venues";
      if (goToLink === "/events-content/venues")
        goToLink = "/events-content/venue-hire";

      actions.router.set(`${goToLink}`);
    };

    if (item[0] !== "home")
      wpMenu.map((menuItem) => {
        // check for nested child_items
        // console.log("Menu", menuItem);
        if (menuItem.child_items && !lg)
          menuItem.child_items.map((childItem) => {
            if (lg) return null;
            // check for nested child_items
            if (childItem.child_items) {
              childItem.child_items.map((childItem) => {
                if (childItem.slug === item.toLowerCase())
                  titleName = <Html2React html={childItem.title} />;
                return;
              });
            }
            if (childItem.slug === item.toLowerCase())
              titleName = <Html2React html={childItem.title} />;
            return;
          });

        if (menuItem.slug === item.toLowerCase()) {
          titleName = <Html2React html={menuItem.title} />;
          return;
        }
        if (typeof titleName == "string" && titleName.includes("-"))
          titleName = <Html2React html={titleName.replace(/-/g, " ")} />;
      });

    return (
      <div>
        <div className="flex-row" style={styles.link} onClick={handleGoToLink}>
          <div style={styles.linkValue}>{titleName}</div>
          {!lg ? (
            <div style={{ margin: `0 ${MARGIN}px` }}>{chevron}</div>
          ) : null}
        </div>
      </div>
    );
  };

  const ServeTitle = () => {
    return (
      <div>
        <div
          className="flex"
          style={{
            marginRight: MARGIN * 2,
            marginLeft: !lg ? null : MARGIN * 2,
            fontSize: 14,
            alignItems: "center",
          }}
        >
          {!lg ? "You're here:" : "Go back to: "}
        </div>
      </div>
    );
  };

  const ServeNewsMediaPreFix = () => {
    if (!data.isPost && data.type !== "post") return null;

    return (
      <div>
        <div
          className="flex-row"
          style={styles.link}
          onClick={() =>
            setGoToAction({ state, path: "/news-media/", actions })
          }
        >
          <div style={styles.linkValue}>News & Media</div>
          <div style={{ margin: `0 10px` }}>
            <ChevronRightIcon
              style={{ fontSize: 16, color: colors.darkSilver }}
            />
          </div>
        </div>
      </div>
    );
  };

  if (data.isError) return null;
  if (urlPath === "/") return null; // disable breadcrumbs in home page
  if (urlPath === "/search/") return null; // disable breadcrumbs in search page
  if (urlPath.includes("codecollect")) return null; // disable breadcrumbs in user login process form B2C

  return (
    <BlockWrapper background={colors.lightSilver}>
      <div className="flex" style={{ ...styles.wrapper }}>
        <ServeTitle />
        <ServeNewsMediaPreFix />
        {directions.map((item) => {
          KEY += 1;
          if (lg && KEY > 1) return null;
          return <ServePatchDirections key={KEY} item={item} nextKey={KEY} />;
        })}
      </div>
    </BlockWrapper>
  );
};

const styles = {
  wrapper: {
    height: 50,
    flexWrap: "wrap",
    alignItems: "center",
  },
  link: {
    alignItems: "center",
    fontSize: 12,
    cursor: "pointer",
  },
  linkValue: {
    fontSize: 14,
    fontWeight: "bold",
    color: colors.blue,
    textTransform: "capitalize",
  },
};

export default connect(Breadcrumbs);
