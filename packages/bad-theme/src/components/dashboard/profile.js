import { connect } from "frontity";
import ProfileAvatar from "./profileAvatar";

// CONTEXT ----------------------------------------------------------------
import {
  useAppDispatch,
  useAppState,
  setDashboardPathAction,
  muiQuery,
  Parcer,
} from "../../context";

const Profile = ({ state, actions, libraries }) => {
  const { sm, md, lg, xl } = muiQuery();

  const { isActiveUser } = useAppState();
  const marginVertical = state.theme.marginVertical;
  const dispatch = useAppDispatch();

  // SERVERS ---------------------------------------------
  const ServeProfileName = () => {
    if (!isActiveUser) return null;

    const { fullname } = isActiveUser;

    return (
      <div className="primary-title" style={{ fontSize: 26 }}>
        <Parcer libraries={libraries} html={fullname} />
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
          <Parcer libraries={libraries} html={emailaddress1} />
        </div>
      );
    };

    const ServeMembershipNumber = () => {
      if (!bad_memberid) return null;

      return (
        <div className="flex-col" style={styles.container}>
          <span className="primary-title">Membership Number: </span>
          <Parcer libraries={libraries} html={bad_memberid} />
        </div>
      );
    };

    const ServeJobTitle = () => {
      if (!jobtitle) return null;

      return (
        <div className="flex-col" style={styles.container}>
          <span className="primary-title">Job Title: </span>
          <Parcer libraries={libraries} html={jobtitle} />
        </div>
      );
    };

    const ServeMobile = () => {
      if (!mobilephone) return null;

      return (
        <div className="flex-col" style={styles.container}>
          <span className="primary-title">Mobile: </span>
          <Parcer libraries={libraries} html={mobilephone} />
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
          <Parcer libraries={libraries} html={memebershpCategory} />
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
            Main Hospital / Place of Work / Medical School details:{" "}
          </span>
          <Parcer libraries={libraries} html={mainPlaceOfWorkCategory} />
        </div>
      );
    };

    const ServeAddress = () => {
      return (
        <div className="flex-col" style={styles.container}>
          <span className="primary-title">Home Address: </span>
          <div className="flex-col">
            {address2_line1 && (
              <div className="flex">
                <Parcer libraries={libraries} html={address2_line1} />
              </div>
            )}
            {address2_line2 && (
              <div className="flex">
                <Parcer libraries={libraries} html={address2_line2} />
              </div>
            )}
            {address2_city && (
              <div className="flex">
                <Parcer libraries={libraries} html={address2_city} />
              </div>
            )}
            {address2_postalcode && (
              <div className="flex">
                <Parcer libraries={libraries} html={address2_postalcode} />
              </div>
            )}
            {address2_country && (
              <div className="flex">
                <Parcer libraries={libraries} html={address2_country} />
              </div>
            )}
          </div>
        </div>
      );
    };

    return (
      <div style={{ paddingTop: `1em` }}>
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
        {!lg ? null : <ProfileAvatar />}
        <ServeProfileName />
        <ServeProfileInfo />
      </div>

      {!lg ? <ProfileAvatar /> : null}
    </div>
  );
};

const styles = {
  container: {
    padding: "0.5em 0",
  },
};

export default connect(Profile);
