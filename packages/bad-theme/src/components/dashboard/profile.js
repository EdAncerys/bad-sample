import { useState, useEffect } from "react";
import { connect } from "frontity";
import Image from "@frontity/components/image";

import ProfileAvatar from "../../img/svg/profile.svg";
// CONTEXT ----------------------------------------------------------------
import {
  useAppDispatch,
  useAppState,
  setDashboardPathAction,
} from "../../context";

const Profile = ({ state, actions, libraries }) => {
  const Html2React = libraries.html2react.Component; // Get the component exposed by html2react.

  const { isActiveUser } = useAppState();

  const marginVertical = state.theme.marginVertical;
  const dispatch = useAppDispatch();

  // SERVERS ---------------------------------------------
  const ServeProfileAvatar = () => {
    if (!isActiveUser) return null;

    const { bad_listname, bad_profile_photo_url } = isActiveUser;

    const alt = bad_listname || "Profile Picture";

    return (
      <div className="flex" style={{ justifyContent: "flex-end" }}>
        <div
          style={{
            width: 190,
            height: 190,
            borderRadius: `50%`,
            overflow: `hidden`,
          }}
        >
          <Image
            src={bad_profile_photo_url || ProfileAvatar}
            alt={alt}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        </div>
      </div>
    );
  };

  const ServeProfileName = () => {
    if (!isActiveUser) return null;

    const { fullname } = isActiveUser;

    return (
      <div className="primary-title" style={{ fontSize: 26 }}>
        <Html2React html={fullname} />
      </div>
    );
  };

  const ServeProfileInfo = () => {
    if (!isActiveUser) return null;

    const {
      emailaddress1,
      address2_line1,
      address2_line2,
      address2_city,
      address2_postalcode,
      address2_country,
      bad_memberid,
      jobtitle,
      mobilephone,
      py3_currentplaceofwork,
    } = isActiveUser;

    const ServeEmail = () => {
      if (!emailaddress1) return null;

      return (
        <div style={styles.container}>
          <span className="primary-title">Email: </span>
          <Html2React html={emailaddress1} />
        </div>
      );
    };

    const ServeMembershipNumber = () => {
      if (!bad_memberid) return null;

      return (
        <div style={styles.container}>
          <span className="primary-title">Membership Number: </span>
          <Html2React html={bad_memberid} />
        </div>
      );
    };

    const ServeJobTitle = () => {
      if (!jobtitle) return null;

      return (
        <div style={styles.container}>
          <span className="primary-title">Job Title: </span>
          <Html2React html={jobtitle} />
        </div>
      );
    };

    const ServeMobile = () => {
      if (!mobilephone) return null;

      return (
        <div style={styles.container}>
          <span className="primary-title">Mobile:</span>
          <Html2React html={mobilephone} />
        </div>
      );
    };

    const ServePlaceOfWork = () => {
      if (!py3_currentplaceofwork) return null;

      return (
        <div style={styles.container}>
          <span className="primary-title">
            Main Place of work / Medical School:
          </span>
          <Html2React html={py3_currentplaceofwork} />
        </div>
      );
    };

    const ServeBadCategory = () => {
      const memebershpCategory =
        isActiveUser[
          "_bad_currentbadsubscrptionid_value@OData.Community.Display.V1.FormattedValue"
        ];
      if (!memebershpCategory) return null;

      return (
        <div style={styles.container}>
          <span className="primary-title">BAD Membership Category: </span>
          <Html2React html={memebershpCategory} />
        </div>
      );
    };

    const ServeAddressOne = () => {
      if (!address2_line1) return null;

      return (
        <div style={styles.container}>
          <span className="primary-title">Address Line One: </span>
          <Html2React html={address2_line1} />
        </div>
      );
    };

    const ServeAddressTwo = () => {
      if (!address2_line2) return null;

      return (
        <div style={styles.container}>
          <span className="primary-title">Address Line Two: </span>
          <Html2React html={address2_line2} />
        </div>
      );
    };

    const ServeCity = () => {
      if (!address2_city) return null;

      return (
        <div style={styles.container}>
          <span className="primary-title">City: </span>
          <Html2React html={address2_city} />
        </div>
      );
    };

    const ServePostcode = () => {
      if (!address2_postalcode) return null;

      return (
        <div style={styles.container}>
          <span className="primary-title">Postcode: </span>
          <Html2React html={address2_postalcode} />
        </div>
      );
    };

    const ServeCountry = () => {
      if (!address2_country) return null;

      return (
        <div style={styles.container}>
          <span className="primary-title">Country: </span>
          <Html2React html={address2_country} />
        </div>
      );
    };

    return (
      <div
        style={{
          paddingTop: `1em`,
          fontSize: 20,
          display: "grid",
        }}
      >
        <ServeMembershipNumber />
        <ServeBadCategory />
        <ServeJobTitle />
        <ServeEmail />
        <ServeMobile />
        <ServePlaceOfWork />
        <ServeAddressOne />
        <ServeAddressTwo />
        <ServeCity />
        <ServePostcode />
        <ServeCountry />

        <div
          className="blue-btn"
          style={{ marginTop: "1em", width: "fit-content" }}
          onClick={() =>
            setDashboardPathAction({ dispatch, dashboardPath: "My Profile" })
          }
        >
          Edit
        </div>
      </div>
    );
  };

  return (
    <div
      className="shadow"
      style={{
        display: "grid",
        gridTemplateColumns: `2fr 1fr`,
        justifyContent: "space-between",
        gap: 20,
        padding: `2em 4em`,
        marginBottom: `${marginVertical}px`,
      }}
    >
      <div style={{ display: "grid", alignItems: "center" }}>
        <ServeProfileName />
        <ServeProfileInfo />
      </div>

      <ServeProfileAvatar />
    </div>
  );
};

const styles = {
  container: {},
};

export default connect(Profile);
