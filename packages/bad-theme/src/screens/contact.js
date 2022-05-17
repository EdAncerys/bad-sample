import { useState, useLayoutEffect } from "react";
import { connect } from "frontity";

import BlockBuilder from "../components/builder/blockBuilder";
import BlockWrapper from "../components/blockWrapper";

import { colors } from "../config/imports";
import MapsComponent from "../components/maps/maps";
import TitleBlock from "../components/titleBlock";
import { muiQuery } from "../context";

const AccountDashboard = ({ state, actions, libraries }) => {
  const Html2React = libraries.html2react.Component; // Get the component exposed by html2react.
  const { sm, md, lg, xl } = muiQuery();

  const data = state.source.get(state.router.link);
  const page = state.source[data.type][data.id];
  const wpBlocks = page.acf.blocks;

  const marginHorizontal = state.theme.marginHorizontal;
  const marginVertical = state.theme.marginVertical;

  // SERVERS --------------------------------------------
  const ServeInfo = () => {
    const ServeAddress = () => {
      if(lg) return null;
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
        <div className={!lg ? "flex-col" : "flex-col-reverse"} style={{ alignItems: !lg ? "flex-end" : null, display: !lg ? "null" : "flex", flexDirection: !lg ? null : "column-reverse" }}> 
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
            gridTemplateColumns: !lg ? `repeat(2, 1fr)` : "1fr",
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
      <div style={{ minHeight: !lg ? null : 300 }}>
        <MapsComponent
          zoom={!lg ? 15 : 10}
          center={{ lat: 51.52346281629359, lng: -0.13927725740945598 }}
        />
      </div>
    );
  };

  return (
    <div className="flex-col">
      <div style={{ backgroundColor: colors.bgNavy }}>
        <BlockWrapper>
          <div
            style={{
              display: "grid",
              gap: marginHorizontal,
              gridTemplateColumns: !lg ? `1fr 1.5fr` : "1fr",
              justifyContent: "center",
              padding: `${marginVertical}px ${marginHorizontal}px`,
              height: !lg ? 500 : null,
            }}
          >
            <ServeInfo />
            <ServeMaps />
          </div>
        </BlockWrapper>
      </div>

      <BlockBuilder blocks={wpBlocks} />
    </div>
  );
};

const styles = {
  container: {},
};

export default connect(AccountDashboard);
