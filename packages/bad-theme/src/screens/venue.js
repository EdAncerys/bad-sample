import { useContext } from "react";
import { connect } from "frontity";

import { colors } from "../config/imports";
import BlockBuilder from "../components/builder/blockBuilder";
import { muiQuery } from "../context";
import PromoBlock from "../components/promoBlock";
import MultiPhotoBlock from "../components/multiPhotoBlock";
// CONTEXT -------------------------------------------------------------------
import { useAppDispatch, setEnquireAction } from "../context";
// BLOCK WIDTH WRAPPER -------------------------------------------------------
import BlockWrapper from "../components/blockWrapper";

const Venue = ({ state, actions, libraries }) => {
  const Html2React = libraries.html2react.Component; // Get the component exposed by html2react.

  const dispatch = useAppDispatch();

  const data = state.source.get(state.router.link);
  const venue = state.source[data.type][data.id];
  console.log("pageData ", data, venue); // debug

  const marginHorizontal = state.theme.marginHorizontal;
  const marginVertical = state.theme.marginVertical;

  const {
    about_the_venue,
    address,
    capacity_options,
    catering,
    excerpt,
    gallery,
    square_footage,
    full_name,
    email_address,
    phone_number,
    subject,
    subject_dropdown_options,
    message,
    allow_attachments,
    contact_public_email,
    contact_public_phone_number,
    form_title,
    form_body,
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
              width: "fit-content",
              margin: "0 auto",
              paddingTop: `1em`,
            }}
          >
            <div
              className="blue-btn"
              onClick={() =>
                setEnquireAction({
                  dispatch,
                  enquireAction: {
                    contact_public_email,
                    contact_public_phone_number,
                    form_title,
                    form_body,
                    full_name,
                    email_address,
                    phone_number,
                    subject,
                    subject_dropdown_options,
                    message,
                    allow_attachments,
                  },
                })
              }
            >
              Enquire Now
            </div>
          </div>
        </div>
      );
    };

    const ServeDetails = () => {
      const ServeCapacity = () => {
        if (!capacity_options) return null;

        return (
          <div>
            <div className="flex primary-title" style={{ fontSize: 20 }}>
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
          <div style={{ paddingTop: `1em` }}>
            <div className="flex primary-title" style={{ fontSize: 20 }}>
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
          <div style={{ paddingTop: `1em` }}>
            <div className="flex primary-title" style={{ fontSize: 20 }}>
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
          <div style={{ paddingTop: `1em` }}>
            <div className="flex primary-title" style={{ fontSize: 20 }}>
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
      <div style={{ padding: `${marginVertical}px ${marginHorizontal}px` }}>
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
      </div>
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
