import { connect } from "frontity";
import { colors } from "../../config/imports";
// --------------------------------------------------------------------------------
import { Parcer } from "../../context";

const VideoGalleryInfo = ({ state, actions, libraries, videoGalleryInfo }) => {
  if (!videoGalleryInfo) return null;
  const { body, condition, date, procedure, service, title } = videoGalleryInfo;

  // SERVERS ---------------------------------------------
  const ServeTitle = () => {
    if (!title) return null;

    return (
      <div
        className="flex primary-title"
        style={{ fontSize: 20, fontWeight: "bold", paddingRight: `1em` }}
      >
        <Parcer libraries={libraries} html={title} />
      </div>
    );
  };

  const ServeBody = () => {
    if (!body) return null;

    return (
      <div style={{ fontSize: 16, padding: `1em 0 0` }}>
        <Parcer libraries={libraries} html={body} />
      </div>
    );
  };

  const ServeDate = () => {
    if (!date) return null;

    return (
      <div style={{ fontSize: 12 }}>
        <Parcer libraries={libraries} html={date} />
      </div>
    );
  };

  const ServeActions = () => {
    if (!condition && !procedure && !service) return null;

    return (
      <div className="flex-row" style={{ flexWrap: "wrap" }}>
        <div style={styles.action}>
          <Parcer libraries={libraries} html={condition} />
        </div>
        <div style={styles.action}>
          <Parcer libraries={libraries} html={procedure} />
        </div>
        <div style={styles.action}>
          <Parcer libraries={libraries} html={service} />
        </div>
      </div>
    );
  };

  return (
    <div className="flex-col" style={{ padding: `1em 0` }}>
      <div className="flex-row" style={{ alignItems: "center" }}>
        <ServeTitle />
        <ServeDate />
      </div>
      <ServeBody />
      <ServeActions />
    </div>
  );
};

const styles = {
  action: {
    backgroundColor: colors.lightSilver,
    borderRadius: 5,
    padding: `0.5em 1.5em`,
    margin: `1em 1em 0 0`,
  },
};

export default connect(VideoGalleryInfo);
