import { connect } from "frontity";
import Image from "@frontity/components/image";

// CONTEXT --------------------------------------------------
import { muiQuery, Parcer } from "../context";

const Profile = ({ state, actions, libraries, block }) => {
  const { sm, md, lg, xl } = muiQuery();

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
        <Parcer libraries={libraries} html={title} />
      </div>
    );
  };

  const ServeBody = () => {
    if (!body || lg) return null;

    return (
      <div
        className="primary-title"
        style={{
          fontSize: 16,
          fontWeight: "regular",
        }}
      >
        <Parcer libraries={libraries} html={body} />
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
