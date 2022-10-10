import { useState, useEffect } from "react";
import { connect } from "frontity";
import Image from "@frontity/components/image";

import { colors } from "../config/imports";
import Loading from "../components/loading";
import DownloadFileBlock from "../components/downloadFileBlock";
import ScrollTop from "../components/scrollTop";
// BLOCK WIDTH WRAPPER -------------------------------------------------------
import BlockWrapper from "../components/blockWrapper";
// --------------------------------------------------------------------------------
import { muiQuery, Parcer } from "../context";

const Pils = ({ state, actions, libraries }) => {
  const { sm, md, lg, xl } = muiQuery();

  const data = state.source.get(state.router.link);
  const pil = state.source[data.type][data.id];

  const marginHorizontal = state.theme.marginHorizontal;
  const marginVertical = state.theme.marginVertical;
  const [position, setPosition] = useState(null);

  useEffect(() => {
    // ⬇️ on component load defaults to window position TOP
    window.scrollTo({ top: 0, behavior: "smooth" }); // force scrolling to top of page
    document.documentElement.scrollTop = 0; // for safari
    setPosition(true);
  }, []);

  if (!pil || !position) return <Loading />;
  // SERVERS ---------------------------------------------
  const ServeTitle = () => {
    if (!pil.title) return null;

    return (
      <div className="flex">
        <div
          className="primary-title"
          style={{
            fontSize: !lg ? 36 : 25,
            padding: `0.5em 1em`,
            backgroundColor: colors.white,
            borderBottom: `5px solid ${colors.danger}`,
          }}
        >
          <Parcer libraries={libraries} html={pil.title.rendered} />
        </div>
      </div>
    );
  };

  const ServeBody = () => {
    if (!pil.content) return null;
    const bodyLength = pil.content.rendered.length;

    return (
      <div
        className="text-body"
        style={{
          backgroundColor: colors.white,
          padding: `2em 0`,
        }}
      >
        <Parcer libraries={libraries} html={pil.content.rendered} />
        {bodyLength > 2500 && <ScrollTop />}
      </div>
    );
  };

  const ServeDownload = () => {
    if (!pil.acf) return null;

    return (
      <div style={{ margin: `3em 0 1em` }}>
        <DownloadFileBlock block={pil.acf} disableMargin />
      </div>
    );
  };

  return (
    <BlockWrapper>
      <div
        className="text-body"
        style={{
          margin: `${marginVertical}px ${marginHorizontal}px`,
        }}
      >
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
          }}
        >
          <div style={{ marginRight: "auto" }}>
            <ServeTitle />
            <ServeDownload />
          </div>

          {/* {pil.acf?.qr_code && (
            <div style={{ width: 200, height: 200 }}>
              <Image
                src={pil.acf?.qr_code?.url}
                alt="QR Code"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            </div>
          )} */}
        </div>

        <ServeBody />
      </div>
    </BlockWrapper>
  );
};

export default connect(Pils);
