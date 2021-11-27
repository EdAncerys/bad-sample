import { useState, useEffect } from "react";
import { connect } from "frontity";
import { colors } from "../config/colors";
import Link from "@frontity/components/link";
import Image from "@frontity/components/image";

import Loading from "./loading";
import PDF from "../img/svg/pdf.svg";

const DownloadFileBlock = ({
  state,
  actions,
  libraries,
  block,
  disableMargin,
}) => {
  const Html2React = libraries.html2react.Component; // Get the component exposed by html2react.

  if (!block) return <Loading />;

  const { file, title } = block;
  if (!title.length) return null;
  if (!file) return null;

  const marginHorizontal = state.theme.marginHorizontal;
  const marginVertical = state.theme.marginVertical;
  const ICON_WIDTH = 35;

  // SERVERS ---------------------------------------------
  const ServeActions = () => {
    if (!title) return null;

    return (
      <div
        style={{
          borderBottom: `1px solid ${colors.black}`,
          textTransform: "uppercase",
          fontSize: 12,
          cursor: "pointer",
          marginLeft: `2em`,
        }}
      >
        <Link link={file.url} target="_blank" download>
          {/* <Html2React html={title} /> */}
          Link Download
        </Link>

        <a href={file.url} target="_blank" download>
          {/* <Html2React html={title} /> */}
          HTML Download
        </a>
      </div>
    );
  };

  return (
    <div
      style={{
        margin: disableMargin ? 0 : `${marginVertical}px ${marginHorizontal}px`,
      }}
    >
      <div className="flex-row pink" style={{ alignItems: "center" }}>
        <div
          style={{
            width: ICON_WIDTH,
            height: ICON_WIDTH,
            marginRight: `1em`,
          }}
        >
          <Image
            src={PDF}
            style={{
              width: "100%",
              height: "100%",
            }}
          />
        </div>

        <ServeActions />
      </div>
    </div>
  );
};

const styles = {
  container: {},
};

export default connect(DownloadFileBlock);
