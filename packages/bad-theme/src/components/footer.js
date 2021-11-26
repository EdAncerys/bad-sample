import { useState, useEffect } from "react";
import { connect } from "frontity";
import { colors } from "../config/colors";
import Image from "@frontity/components/image";
import Link from "@frontity/components/link";

import BADLogo from "../img/svg/badLogoFooter.svg";
import Facebook from "../img/svg/facebook.svg";
import Twitter from "../img/svg/twitter.svg";
import Instagram from "../img/svg/instagram.svg";

const Footer = ({ state, actions }) => {
  const date = new Date();
  const year = date.getFullYear();
  const marginHorizontal = state.theme.marginHorizontal;
  const marginVertical = state.theme.marginVertical;

  // SERVERS ---------------------------------------------
  const ServeDivider = () => {
    return <div style={{ padding: `0 10px` }}>|</div>;
  };

  const ServeFooterTopRow = () => {
    return (
      <div
        className="flex-row"
        style={{
          flex: 2,
          alignItems: "center",
          borderBottom: `1px solid ${colors.darkSilver}`,
        }}
      >
        <div className="flex" style={{ flex: 3 }}>
          <div style={{ width: 235, height: 70 }}>
            <Image src={BADLogo} className="d-block h-100" alt="BAD Logo" />
          </div>
        </div>
        <div
          className="flex"
          style={{ flex: 4, fontSize: 11, justifyContent: "flex-end" }}
        >
          <div style={styles.footerTitle}>
            <div>Willan House, 4 Fitzroy Square, London, W1T 5HQ</div>
            <ServeDivider />
          </div>
          <div style={styles.footerTitle}>
            <div>admin@bad.org.uk</div>
            <ServeDivider />
          </div>
          <div style={styles.footerTitle}>+44 (0)207 383 0266</div>
        </div>
        <div className="flex" style={{ justifyContent: "space-around" }}>
          <div style={styles.socials}>
            <Link link={`https://www.facebook.com/`} target="_blank">
              <Image src={Facebook} className="d-block h-100" alt="Facebook" />
            </Link>
          </div>
          <div style={styles.socials}>
            <Link link={`https://www.twitter.com/`} target="_blank">
              <Image src={Twitter} className="d-block h-100" alt="Twitter" />
            </Link>
          </div>
          <div style={styles.socials}>
            <Link link={`https://www.instagram.com/`} target="_blank">
              <Image
                src={Instagram}
                className="d-block h-100"
                alt="Instagram"
              />
            </Link>
          </div>
        </div>
      </div>
    );
  };

  const ServeFooterBottomRow = () => {
    return (
      <div className="flex-row" style={{ alignItems: "center", fontSize: 9 }}>
        <div className="flex">
          ©{`${year}`} British Association of Dermatologists
        </div>
        <div className="flex" style={{ flex: 2, justifyContent: "flex-end" }}>
          <div style={styles.footerTitle}>
            <div>Registered Charity No. 25847</div>
            <ServeDivider />
          </div>
          <div style={styles.footerTitle}>
            <div>Equal Opportunities Policy</div>
            <ServeDivider />
          </div>
          <div style={styles.footerTitle}>
            <div>Privacy Policy</div>
            <ServeDivider />
          </div>
          <div style={styles.footerTitle}>
            <div>Terms & Conditions</div>
            <ServeDivider />
          </div>
          <div style={styles.footerTitle}>Site produced by Skylark</div>
        </div>
      </div>
    );
  };

  return (
    <div>
      <div
        className="flex-col"
        style={{
          ...styles.container,
          margin: `${marginVertical}px 0 0`,
        }}
      >
        <div
          className="flex-col"
          style={{ padding: `0 ${marginHorizontal / 2}px` }}
        >
          <ServeFooterTopRow />
          <ServeFooterBottomRow />
        </div>
        <div style={{ height: "20px", backgroundColor: colors.primary }} />
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
    display: "flex",
  },
  socials: {
    width: 25,
    height: 25,
    cursor: "pointer",
  },
};

export default connect(Footer);
