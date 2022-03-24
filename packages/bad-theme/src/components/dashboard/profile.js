import { useState, useEffect } from "react";
import { connect } from "frontity";
import Image from "@frontity/components/image";
import ProfileAvatar from "../../img/svg/profile.svg";
// CONTEXT ----------------------------------------------------------------
import {
  useAppDispatch,
  useAppState,
  setDashboardPathAction,
  muiQuery,
} from "../../context";

const Profile = ({ state, actions, libraries }) => {
  const { sm, md, lg, xl } = muiQuery();

  const Html2React = libraries.html2react.Component; // Get the component exposed by html2react.

  const { isActiveUser } = useAppState();
  const marginVertical = state.theme.marginVertical;
  const dispatch = useAppDispatch();

  // SERVERS ---------------------------------------------
  const ServeProfileAvatar = () => {
    if (!isActiveUser) return null;

    const { bad_listname, bad_profile_photo_url } = isActiveUser;
    const alt = bad_listname || "Profile Picture";
    let imgWidth = 350;
    if (xl) {
      imgWidth = 200;
    } else {
      imgWidth = 350;
    }

    return (
      <div className="flex" style={{ justifyContent: "flex-end" }}>
        <div
          style={{
            width: imgWidth,
            height: imgWidth,
            borderRadius: `50%`,
            overflow: `hidden`,
            margin: "3em 0 0 0",
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
        <div className="flex-col" style={styles.container}>
          <span className="primary-title">Email: </span>
          <Html2React html={emailaddress1} />
        </div>
      );
    };

    const ServeMembershipNumber = () => {
      if (!bad_memberid) return null;

      return (
        <div className="flex-col" style={styles.container}>
          <span className="primary-title">Membership Number: </span>
          <Html2React html={bad_memberid} />
        </div>
      );
    };

    const ServeJobTitle = () => {
      if (!jobtitle) return null;

      return (
        <div className="flex-col" style={styles.container}>
          <span className="primary-title">Job Title: </span>
          <Html2React html={jobtitle} />
        </div>
      );
    };

    const ServeMobile = () => {
      if (!mobilephone) return null;

      return (
        <div className="flex-col" style={styles.container}>
          <span className="primary-title">Mobile: </span>
          <Html2React html={mobilephone} />
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
        <div className="flex-col" style={styles.container}>
          <span className="primary-title">BAD Membership Category: </span>
          <Html2React html={memebershpCategory} />
        </div>
      );
    };

    const ServeMainPlaceOfWork = () => {
      const mainPlaceOfWorkCategory =
        isActiveUser[
          "_parentcustomerid_value@OData.Community.Display.V1.FormattedValue"
        ];
      if (!mainPlaceOfWorkCategory) return null;

      return (
        <div className="flex-col" style={styles.container}>
          <span className="primary-title">
            Main Place of work / Medical School:{" "}
          </span>
          <Html2React html={mainPlaceOfWorkCategory} />
        </div>
      );
    };

    const ServeAddress = () => {
      return (
        <div className="flex-col" style={styles.container}>
          <span className="primary-title">Address: </span>
          <div className="flex">
            {address2_line1 && (
              <div>
                <Html2React html={address2_line1} />{" "}
              </div>
            )}
            {address2_line2 && (
              <div>
                <Html2React html={address2_line2} />{" "}
              </div>
            )}
            {address2_city && (
              <div>
                <Html2React html={address2_city} />{" "}
              </div>
            )}
            {address2_postalcode && (
              <div>
                <Html2React html={address2_postalcode} />{" "}
              </div>
            )}
            {address2_country && (
              <div>
                <Html2React html={address2_country} />{" "}
              </div>
            )}
          </div>
        </div>
      );
    };

    return (
      <div style={{ paddingTop: `1em`, fontSize: 20 }}>
        <ServeMembershipNumber />
        <ServeBadCategory />
        <ServeMainPlaceOfWork />
        <ServeJobTitle />

        <ServeEmail />
        <ServeMobile />
        <ServeAddress />

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
        gridTemplateColumns: !lg ? `1fr auto` : "1fr",
        justifyContent: "space-between",
        gap: 20,
        padding: !lg ? `2em 4em` : "1em",
        marginBottom: `${marginVertical}px`,
      }}
    >
      <div
        style={{
          display: !lg ? "grid" : "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {!lg ? null : <ServeProfileAvatar />}
        <ServeProfileName />
        <ServeProfileInfo />
      </div>

      {!lg ? <ServeProfileAvatar /> : null}
    </div>
  );
};

const styles = {
  container: {
    padding: "0.5em 0",
  },
};

export default connect(Profile);
