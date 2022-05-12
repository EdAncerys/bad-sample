import { connect } from "frontity";
import Image from "@frontity/components/image";

// CONTEXT --------------------------------------------------
import { muiQuery } from "../context";

const Profile = ({ state, actions, libraries, block }) => {
  const { sm, md, lg, xl } = muiQuery();

  const Html2React = libraries.html2react.Component; // Get the component exposed by html2react.
  const PROFILE_PICTURE_WIDTH = 190;
  const { background_image, body, title } = block;

  // SERVERS ----------------------------------------------------------------
  const ServeProfilePicture = () => {
    if (!background_image) return null;
    const alt = title || "BAD";

    return (
      <div
        style={{
          width: PROFILE_PICTURE_WIDTH,
          height: PROFILE_PICTURE_WIDTH,
          borderRadius: "50%",
          overflow: "hidden",
          margin: `0 auto`,
        }}
      >
        <Image
          src={background_image.url}
          alt={alt}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      </div>
    );
  };

  const ServeTitle = () => {
    if (!title) return null;

    return (
      <div
        className="primary-title"
        style={{ fontSize: 20, margin: `0.75em 0` }}
      >
        <Html2React html={title} />
      </div>
    );
  };

  const ServeBody = () => {
    if (!body) return null;
    if (lg) return null;
    return (
      <div
        className="primary-title"
        style={{
          fontSize: 16,
          fontWeight: "regular",
        }}
      >
        <Html2React html={body} />
      </div>
    );
  };

  const ServeProfile = () => {
    return (
      <div style={{ textAlign: "center" }}>
        <ServeTitle />
        <ServeBody />
      </div>
    );
  };

  return (
    <div style={{ margin: `2em auto` }}>
      <div>
        <ServeProfilePicture />
        <ServeProfile />
      </div>
    </div>
  );
};

const styles = {
  container: {},
};

export default connect(Profile);
