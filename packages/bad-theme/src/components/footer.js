import { useState, useEffect } from "react";
import { connect } from "frontity";
import { colors } from "../config/imports";
import Image from "@frontity/components/image";
import Link from "@frontity/components/link";

import BlockWrapper from "./blockWrapper";

import BADLogo from "../img/svg/badLogoFooter.svg";
import Facebook from "../img/svg/facebook.svg";
import Twitter from "../img/svg/twitter.svg";
import Instagram from "../img/svg/instagram.svg";
import { muiQuery } from "../context";
const Footer = ({ state, actions }) => {
  const { sm, md, lg, xl } = muiQuery();

  const endPoint = state.router.link;
  if (endPoint.includes("/redirect/")) return null;

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
        style={{
          padding: `1em 0`,
          borderBottom: `1px solid ${colors.darkSilver}`,
        }}
      >
        <div
          className={!lg ? "flex-row" : "flex-col"}
          style={{
            flex: 2,
            alignItems: !lg ? "center" : "flex-start",
          }}
        >
          <div className="flex" style={{ flex: 3 }}>
            <div style={{ width: 235, height: 70 }}>
              <Image src={BADLogo} className="d-block h-100" alt="BAD Logo" />
            </div>
          </div>
          <div
            className="flex"
            style={{ flex: 5, fontSize: 11, justifyContent: "flex-end" }}
          >
            {!lg ? (
              <div style={styles.footerInfo}>
                <div>Willan House, 4 Fitzroy Square, London, W1T 5HQ</div>
                <ServeDivider />
              </div>
            ) : null}
            <div style={styles.footerInfo}>
              <div>admin@bad.org.uk</div>
              <ServeDivider />
            </div>
            <div style={styles.footerInfo}>+44 (0)207 383 0266</div>
          </div>
          <div
            className="flex"
            style={{
              justifyContent: "space-around",
              paddingLeft: !lg ? `3em` : 0,
              width: !lg ? null : "100%",
              marginTop: !lg ? null : "1em",
            }}
          >
            <div style={!lg ? styles.socials : styles.socialsMobile}>
              <Link
                link={`https://www.facebook.com/BritishAssociationOfDermatologists/`}
                target="_blank"
              >
                <span className="facebook-icon" />
              </Link>
            </div>
            <div style={!lg ? styles.socials : styles.socialsMobile}>
              <Link
                link={`https://www.twitter.com/HealthySkin4All/`}
                target="_blank"
              >
                <span className="twitter-icon" />
              </Link>
            </div>
            <div style={!lg ? styles.socials : styles.socialsMobile}>
              <Link
                link={`https://www.instagram.com/explore/locations/1020258048/british-association-of-dermatologists?hl=en`}
                target="_blank"
              >
                <span className="instagram-icon" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const ServeFooterBottomRow = () => {
    return (
      <div
        className={!lg ? "flex-row" : "flex-col"}
        style={{
          alignItems: "center",
          fontSize: !lg ? 9 : 15,
          padding: `2em 0`,
        }}
      >
        <div className="flex">
          ©{`${year}`} British Association of Dermatologists
        </div>
        <div className="flex" style={{ flex: 2, justifyContent: "flex-end" }}>
          <div className="footer-title-link" style={styles.footerLink}>
            <Link
              link={`https://skylarkcreative.co.uk/`}
              target="_blank"
              style={styles.footerLink}
            >
              Registered Charity No. 25847
            </Link>
            <ServeDivider />
          </div>
          <div className="footer-title-link" style={styles.footerLink}>
            <Link
              link={`https://skylarkcreative.co.uk/`}
              target="_blank"
              style={styles.footerLink}
            >
              Privacy Policy
            </Link>
            <ServeDivider />
          </div>
          <div className="footer-title-link" style={styles.footerLink}>
            <Link
              link={`https://skylarkcreative.co.uk/`}
              target="_blank"
              style={styles.footerLink}
            >
              Terms & Conditions
            </Link>
            <ServeDivider />
          </div>
          <div className="footer-title-link">
            <Link
              link={`https://skylarkcreative.co.uk/`}
              target="_blank"
              style={styles.footerLink}
            >
              Site produced by Skylark
            </Link>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="no-selector">
      <div className="flex-col" style={{ ...styles.container }}>
        <div
          className="flex-col"
          style={{ padding: `0 ${marginHorizontal / 2}px` }}
        >
          <BlockWrapper>
            <ServeFooterTopRow />
            <ServeFooterBottomRow />
          </BlockWrapper>
        </div>
        <div style={{ height: "20px", backgroundColor: colors.primary }} />
      </div>
    </div>
  );
};

const styles = {
  container: {
    backgroundColor: colors.footer,
    color: colors.white,
    textTransform: "uppercase",
  },
  footerInfo: {
    display: "flex",
  },
  footerLink: {
    display: "flex",
    fontSize: 9,
  },
  socials: {
    width: 25,
    height: 25,
    cursor: "pointer",
  },
  socialsMobile: {
    width: 50,
    height: 50,
    cursor: "pointer",
  },
};

export default connect(Footer);
