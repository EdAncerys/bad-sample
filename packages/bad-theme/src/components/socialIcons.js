import { connect } from "frontity";
import Image from "@frontity/components/image";
import Link from "@frontity/components/link";

import { colors } from "../config/imports";
import Facebook from "../img/svg/facebookColour.svg";
import Twitter from "../img/svg/twitterColour.svg";
import Instagram from "../img/svg/instagramColour.svg";

const SocialIcons = ({ state, actions, libraries, block }) => {
  const Html2React = libraries.html2react.Component; // Get the component exposed by html2react.

  if (!block) return null;

  const { disable_vertical_padding } = block;

  const marginHorizontal = state.theme.marginHorizontal;
  let marginVertical = state.theme.marginVertical;
  if (disable_vertical_padding) marginVertical = 0;

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
        className="primary-title"
        style={{
          fontSize: 24,
          fontWeight: "bold",
          color: colors.softBlack,
          padding: `1em 0`,
        }}
      >
        <Html2React html={title} />
      </div>
    );
  };

  const ServeSocialContent = () => {
    if (!social_links) return null;

    return (
      <div
        style={{
          display: "grid",
          gridTemplateColumns: COLUMNS_NUMBER,
          gap: 20,
          alignItems: "flex-end",
        }}
      >
        {social_links.map((block, key) => {
          let paddingTop = 0;
          if (key !== 0 && links_per_row === "One") paddingTop = `1em`;

          return (
            <div key={key} style={{ paddingTop: paddingTop }}>
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
      <ServeSocialContent />
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
