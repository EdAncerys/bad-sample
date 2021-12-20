import { connect } from "frontity";
import Image from "@frontity/components/image";
import Link from "@frontity/components/link";

import { colors } from "../config/colors";
import Facebook from "../img/svg/facebookColour.svg";
import Twitter from "../img/svg/twitterColour.svg";
import Instagram from "../img/svg/instagramColour.svg";

const SocialIcons = ({ state, actions, libraries, block }) => {
  const Html2React = libraries.html2react.Component; // Get the component exposed by html2react.

  if (!block) return null;

  const marginHorizontal = state.theme.marginHorizontal;
  const marginVertical = state.theme.marginVertical;

  const { links_per_row, social_links } = block;

  let COLUMNS_NUMBER = `1fr`;
  if (links_per_row === "Two") COLUMNS_NUMBER = ` 1fr 1fr`;
  if (links_per_row === "Three") COLUMNS_NUMBER = ` 1fr 1fr 1fr`;

  const ServeIcon = ({ url, icon }) => {
    if (!url) return null;

    return (
      <div style={styles.socials}>
        <Link link={url} target="_blank">
          <Image
            src={icon}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        </Link>
      </div>
    );
  };

  const ServeTitle = ({ title }) => {
    if (!title) return null;

    return (
      <div
        style={{
          fontSize: 24,
          fontFamily: "Roboto",
          fontWeight: "bold",
          color: colors.black,
          paddingBottom: `1em`,
        }}
      >
        <Html2React html={title} />
      </div>
    );
  };

  const ServeSocialContent = () => {
    if (!social_links) return null;

    return (
      <div>
        {social_links.map((block, key) => {
          return (
            <div key={key}>
              <div className="flex" style={{ justifyContent: "center" }}>
                <ServeTitle title={block.title} />
              </div>
              <div className="flex" style={{ justifyContent: "center" }}>
                <ServeIcon icon={Facebook} url={block.facebook} />
                <ServeIcon icon={Twitter} url={block.twitter} />
                <ServeIcon icon={Instagram} url={block.instagram} />
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  // RETURN ---------------------------------------------------
  return (
    <div style={{ margin: `${marginVertical}px ${marginHorizontal}px` }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: COLUMNS_NUMBER,
          gap: 20,
        }}
      >
        <ServeSocialContent />
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
