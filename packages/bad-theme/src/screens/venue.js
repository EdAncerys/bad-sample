import { useEffect } from "react";
import { connect } from "frontity";

import { colors } from "../config/imports";
import BlockBuilder from "../components/builder/blockBuilder";
import PromoBlock from "../components/promoBlock";
import MultiPhotoBlock from "../components/multiPhotoBlock";
import Card from "../components/card/card";
import GalleryCarousel from "../components/card/galleryCarousel";
// CONTEXT -------------------------------------------------------------------
import { useAppDispatch, setEnquireAction, muiQuery } from "../context";
// BLOCK WIDTH WRAPPER -------------------------------------------------------
import BlockWrapper from "../components/blockWrapper";

const Venue = ({ state, actions, libraries }) => {
  const Html2React = libraries.html2react.Component; // Get the component exposed by html2react.
  const { sm, md, lg, xl } = muiQuery();

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
    floor,
  } = venue.acf;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" }); // force scrolling to top of page
    document.documentElement.scrollTop = 0; // for safari
  }, []);

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
          <div style={{ paddingTop: !lg ? `1em` : 0 }}>
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

      const ServeFloor = () => {
        if (!floor) return null;

        return (
          <div style={{ paddingTop: `1em` }}>
            <div className="flex primary-title" style={{ fontSize: 20 }}>
              Floor:
            </div>

            <div className="flex">
              <Html2React html={floor} /> floor
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
        <div
          style={
            !lg
              ? { padding: `0 3em` }
              : {
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  marginTop: "1em",
                }
          }
        >
          <ServeCapacity />
          <ServeSqFootage />
          <ServeAddress />
          <ServeFloor />
          <ServeCatering />
        </div>
      );
    };

    return (
      <div
        style={
          !lg
            ? { ...styles.infoContainer, padding: `${marginVertical}px 0 0` }
            : {
                ...styles.infoContainerMobile,
                padding: `${marginVertical}px 0 0`,
              }
        }
      >
        <ServeAbout />
        <ServeDetails />
      </div>
    );
  };

  // RETURN ---------------------------------------------------
  return (
    <div>
      <div
        style={{
          padding: `0 ${marginVertical}px`,
          backgroundColor: colors.bgNavy,
        }}
      >
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
        </BlockWrapper>
      </div>
      <BlockWrapper>
        <div style={{ padding: `${marginVertical}px ${marginHorizontal}px` }}>
          <ServeInfo />
          <GalleryCarousel
            gallery={gallery}
            height={state.theme.bannerHeight * 1.5}
            padding={`${marginVertical}px 0`}
          />
        </div>
      </BlockWrapper>
    </div>
  );
};

const styles = {
  infoContainer: {
    display: "grid",
    gridTemplateColumns: `1fr 1fr`,
    gap: `10em`,
  },
  venueDetailsMobile: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
  },
};

export default connect(Venue);
