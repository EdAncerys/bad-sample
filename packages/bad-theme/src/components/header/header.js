import { connect, Global, css } from "frontity";
import bootStrapCSS from "../../css/bootstrap.min.css";
import { colors } from "../../config/imports";
// css imports ------------------------------------------------------------
import animations from "aos/dist/aos.css";
import globalCSS from "../../css/main.css";
import carousel from "../../css/carousel.css";
import accordion from "../../css/accordion.css";
import nav from "../../css/nav.css";
import input from "../../css/input.css";
import custom from "../../css/custom.css";
import customMobile from "../../css/custom-mobile.css";
import buttons from "../../css/buttons.css";
import iFrame from "../../css/iFrame.css";
// COMPONENTS -------------------------------------------------------------
import HTMLHead from "./htmlHead";
import HeaderActions from "./headerActions";
import Navigation from "./navigation";
import Loading from "../loading";
// CONTEXT ----------------------------------------------------------------
import { muiQuery } from "../../context";

const Header = ({ state, actions }) => {
  const { sm, md, lg, xl } = muiQuery();
  const endPoint = state.router.link;
  const data = state.source.get(endPoint);

  const ServeNavigation = () => {
    if (endPoint.includes("/redirect/"))
      return (
        <div style={{ paddingTop: `55%` }}>
          <Loading />
        </div>
      );

    return (
      <div className="bad-header no-selector" style={styles.container}>
        <HeaderActions />
        {!lg ? <Navigation /> : null}
      </div>
    );
  };

  return (
    <>
      <Global
        styles={css`
          ${bootStrapCSS}, ${globalCSS}, ${carousel}, ${accordion}, ${nav}, ${input},  ${buttons}, ${iFrame}, ${animations}, ${!lg
            ? custom
            : customMobile},
        `}
      />
      <HTMLHead />
      {!lg ? (
        <div className="bad-header" style={styles.container}>
          <HeaderActions />
          <Navigation />
        </div>
      ) : (
        <div
          className="flex-col"
          style={
            !lg
              ? styles.container
              : {
                  ...styles.container,
                  position: "sticky",
                  zIndex: "999",
                  top: 0,
                }
          }
        >
          <HTMLHead />
          <ServeNavigation />
        </div>
      )}
    </>
  );
};

const styles = {
  container: {
    backgroundColor: `${colors.white}`,
  },
};

export default connect(Header);
