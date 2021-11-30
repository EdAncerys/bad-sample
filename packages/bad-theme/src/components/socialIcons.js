import { connect } from "frontity";
import Image from "@frontity/components/image";
import Link from "@frontity/components/link";

import { colors } from "../config/colors";
import Facebook from "../img/svg/facebookColour.svg";
import Twitter from "../img/svg/twitterColour.svg";
import Instagram from "../img/svg/instagramColour.svg";

const SocialIcons = ({ state, actions, libraries, block }) => {
  const Html2React = libraries.html2react.Component; // Get the component exposed by html2react.

  const marginHorizontal = state.theme.marginHorizontal;
  const marginVertical = state.theme.marginVertical;

  // RETURN ---------------------------------------------------
  return (
    <div style={{ margin: `${marginVertical}px ${marginHorizontal}px` }}>
      <div
        className="flex"
        style={{ justifyContent: "center", padding: `2em 0` }}
      >
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
            <Image src={Instagram} className="d-block h-100" alt="Instagram" />
          </Link>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {},
  socials: {
    width: 77,
    height: 77,
    cursor: "pointer",
    margin: `0 1em`,
  },
};

export default connect(SocialIcons);
