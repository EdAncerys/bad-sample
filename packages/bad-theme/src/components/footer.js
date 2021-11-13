import { useState, useEffect } from "react";
import { connect } from "frontity";
import { colors } from "../config/colors";
import Image from "@frontity/components/image";

import BADLogo from "../img/svg/badLogoFooter.svg";
import Facebook from "../img/svg/facebook.svg";
import Twitter from "../img/svg/twitter.svg";
import Instagram from "../img/svg/instagram.svg";

const SCREEN_NAME = ({ state, actions }) => {
  // SERVERS ---------------------------------------------
  const ServeFooterTopRow = () => {
    return (
      <div
        className="flex-row"
        style={{
          flex: 2,
          alignItems: "center",
          borderBottom: `1px solid ${colors.silver}`,
        }}
      >
        <div className="flex" style={{ flex: 3 }}>
          <div style={{ width: 235, height: 70 }}>
            <Image src={BADLogo} className="d-block w-100" alt="BAD" />
          </div>
        </div>
        <div
          className="flex"
          style={{ flex: 4, fontSize: 11, justifyContent: "flex-end" }}
        >
          <div style={styles.footerTitle}>
            Willan House, 4 Fitzroy Square, London, W1T 5HQ |
          </div>
          <div style={styles.footerTitle}>admin@bad.org.uk |</div>
          <div style={styles.footerTitle}>+44 (0)207 383 0266</div>
        </div>
        <div className="flex" style={{ justifyContent: "space-around" }}>
          <div style={{ width: 25, height: 25 }}>
            <Image src={Facebook} className="d-block w-100" alt="BAD" />
          </div>
          <div style={{ width: 25, height: 25 }}>
            <Image src={Twitter} className="d-block w-100" alt="BAD" />
          </div>
          <div style={{ width: 25, height: 25 }}>
            <Image src={Instagram} className="d-block w-100" alt="BAD" />
          </div>
        </div>
      </div>
    );
  };

  const ServeFooterBottomRow = () => {
    return (
      <div className="flex-row" style={{ alignItems: "center", fontSize: 9 }}>
        <div className="flex">©2021 British Association of Dermatologists</div>
        <div className="flex" style={{ flex: 2, justifyContent: "flex-end" }}>
          <div style={styles.footerTitle}>Registered Charity No. 25847 |</div>
          <div style={styles.footerTitle}>Equal Opportunities Policy |</div>
          <div style={styles.footerTitle}>Privacy Policy |</div>
          <div style={styles.footerTitle}>Terms & Conditions |</div>
          <div style={styles.footerTitle}>Site produced by Skylark</div>
        </div>
      </div>
    );
  };

  return (
    <div>
      <div className="flex-col" style={styles.container}>
        <div className="flex-col" style={{ padding: "1em" }}>
          <ServeFooterTopRow />
          <ServeFooterBottomRow />
        </div>
        <div style={{ height: "20px", backgroundColor: colors.blue }} />
      </div>
    </div>
  );
};

const styles = {
  container: {
    height: 170,
    backgroundColor: colors.softBlack,
    color: colors.white,
  },
  footerTitle: {
    marginRight: 10,
  },
};

export default connect(SCREEN_NAME);
