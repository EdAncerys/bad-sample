import { useContext } from "react";
import { connect } from "frontity";

import { colors } from "../config/imports";
import BlockBuilder from "../components/builder/blockBuilder";
import { muiQuery } from "../context";
import PromoBlock from "../components/promoBlock";
import MultiPhotoBlock from "../components/multiPhotoBlock";
import { setGoToAction } from "../context";
// BLOCK WIDTH WRAPPER -------------------------------------------------------
import BlockWrapper from "../components/blockWrapper";

const Venue = ({ state, actions, libraries }) => {
  const Html2React = libraries.html2react.Component; // Get the component exposed by html2react.
  const data = state.source.get(state.router.link);
  const venue = state.source[data.type][data.id];
  console.log("pageData ", data, venue); // debug

  const marginHorizontal = state.theme.marginHorizontal;
  const marginVertical = state.theme.marginVertical;

  const { sm, md, lg, xl } = muiQuery();

  const {
    about_the_venue,
    address,
    capacity_options,
    catering,
    enquiry_email,
    excerpt,
    gallery,
    square_footage,
    colour,
  } = venue.acf;

  // SERVERS ---------------------------------------------------
  const ServeInfo = () => {
    const ServeAbout = () => {
      if (!about_the_venue) return null;

      return (
        <div className="flex-col">
          <div className="flex">
            <div>
              <Html2React html={about_the_venue} />
            </div>
          </div>
          <div
            style={{
              justifyContent: "center",
              backgroundColor: colors.lightSilver,
              padding: `3em`,
              margin: `2em 0 0`,
            }}
          >
            <button
              type="submit"
              className="btn"
              style={{
                backgroundColor: colors.primary,
                color: colors.white,
                padding: `1em 4em`,
              }}
              onClick={() => setGoToAction({ path: "/", actions })}
            >
              Enquire Now
            </button>
          </div>
        </div>
      );
    };

    const ServeDetails = () => {
      console.log("capacity_options", capacity_options);

      const ServeCapacity = () => {
        if (!capacity_options) return null;

        return (
          <div>
            <div
              className="flex primary-title"
              style={{
                fontSize: 20,
                color: colors.black,
                fontWeight: "bold",
              }}
            >
              Capacity:
            </div>
            {capacity_options.map((item, key) => {
              return (
                <div key={key} className="flex-row">
                  <div style={{ paddingRight: 5 }}>
                    <Html2React html={item.layout} />
                  </div>
                  <div>
                    <Html2React html={item.capacity} />
                  </div>
                </div>
              );
            })}
          </div>
        );
      };

      const ServeSqFootage = () => {
        if (!square_footage) return null;

        return (
          <div style={{ paddingTop: `2em` }}>
            <div
              className="flex primary-title"
              style={{
                fontSize: 20,
                color: colors.black,
                fontWeight: "bold",
              }}
            >
              Square Footage:
            </div>

            <div className="flex">
              <Html2React html={square_footage} />
            </div>
          </div>
        );
      };

      const ServeAddress = () => {
        if (!address) return null;

        return (
          <div style={{ paddingTop: `2em` }}>
            <div
              className="flex primary-title"
              style={{
                fontSize: 20,
                color: colors.black,
                fontWeight: "bold",
              }}
            >
              Address:
            </div>

            <div className="flex">
              <Html2React html={address} />
            </div>
          </div>
        );
      };

      const ServeCatering = () => {
        if (!catering) return null;

        return (
          <div style={{ paddingTop: `2em` }}>
            <div
              className="flex primary-title"
              style={{
                fontSize: 20,
                color: colors.black,
                fontWeight: "bold",
              }}
            >
              Catering:
            </div>

            <div className="flex">
              <Html2React html={catering} />
            </div>
          </div>
        );
      };

      return (
        <div styles={{ padding: `0 3em` }}>
          <ServeCapacity />
          <ServeSqFootage />
          <ServeAddress />
          <ServeCatering />
        </div>
      );
    };

    return (
      <div
        style={{ ...styles.infoContainer, padding: `${marginVertical}px 0 0` }}
      >
        <ServeAbout />
        <ServeDetails />
      </div>
    );
  };

  // RETURN ---------------------------------------------------
  return (
    <BlockWrapper>
      <PromoBlock
        block={{
          title: venue.title.rendered,
          body: excerpt,
          background_image: gallery[0],
          padding: "small",
        }}
        disableMargin
      />
      <ServeInfo />
      <MultiPhotoBlock block={gallery} />
    </BlockWrapper>
  );
};

const styles = {
  infoContainer: {
    display: "grid",
    gridTemplateColumns: `1fr 1fr`,
    gap: 20,
  },
};

export default connect(Venue);
