import { useState, useLayoutEffect } from "react";
import { connect } from "frontity";

import BlockBuilder from "../components/builder/blockBuilder";
import BlockWrapper from "../components/blockWrapper";

import { colors } from "../config/imports";
import MapsComponent from "../components/maps/maps";
import TitleBlock from "../components/titleBlock";

const AccountDashboard = ({ state, actions, libraries }) => {
  const Html2React = libraries.html2react.Component; // Get the component exposed by html2react.

  const data = state.source.get(state.router.link);
  const page = state.source[data.type][data.id];
  const wpBlocks = page.acf.blocks;

  const marginHorizontal = state.theme.marginHorizontal;
  const marginVertical = state.theme.marginVertical;

  // SERVERS --------------------------------------------
  const ServeInfo = () => {
    const ServeAddress = () => {
      return (
        <div
          className="flex-col"
          style={{ borderRight: `1px solid ${colors.darkSilver}` }}
        >
          <div>Willan House</div>
          <div>4 Fitzroy Square</div>
          <div>London</div>
          <div>W17 5HQ</div>
        </div>
      );
    };

    const ServeContact = () => {
      return (
        <div className="flex-col" style={{ alignItems: "flex-end" }}>
          <div>Tel: +44 (0)207 383 0266</div>
          <div>Fax: +44 (0)207 388 5263</div>
          <div>Email: Admin@bad.org.uk</div>
        </div>
      );
    };

    return (
      <div className="flex-col" style={{ margin: `auto 0` }}>
        <TitleBlock block={{ title: "Contact Us" }} disableMargin />
        <TitleBlock
          block={{ title: "British Association of Dermatologists" }}
          margin="1em 0"
          fontSize={20}
        />

        <div
          style={{
            display: "grid",
            gap: 20,
            gridTemplateColumns: `repeat(2, 1fr)`,
            padding: `1em 0`,
          }}
        >
          <ServeAddress />
          <ServeContact />
        </div>
      </div>
    );
  };

  const ServeMaps = () => {
    return (
      <div>
        <MapsComponent />
      </div>
    );
  };

  return (
    <div className="flex-col">
      <BlockWrapper>
        <div
          style={{
            display: "grid",
            gap: marginHorizontal,
            gridTemplateColumns: `repeat(2, 1fr)`,
            justifyContent: "center",
            padding: `${marginVertical}px ${marginHorizontal}px`,
            height: 400,
          }}
        >
          <ServeInfo />
          <ServeMaps />
        </div>
      </BlockWrapper>

      <BlockBuilder blocks={wpBlocks} />
    </div>
  );
};

const styles = {
  container: {},
};

export default connect(AccountDashboard);
