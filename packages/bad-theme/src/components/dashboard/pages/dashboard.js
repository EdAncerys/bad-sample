import { useState, useEffect, useRef } from "react";
import { connect } from "frontity";

import date from "date-and-time";
const DATE_MODULE = date;

import Profile from "../profile";
import ProfileProgress from "../profileProgress";
import { colors } from "../../../config/colors";
import Loading from "../../loading";
import TitleBlock from "../../titleBlock";
import Payments from "../payments";
import Card from "../../../components/card/card";
import ActionPlaceholder from "../../actionPlaceholder";

// CONTEXT ------------------------------------------------------------------
import {
  useAppState,
  useAppDispatch,
  setErrorAction,
  handleValidateMembershipChangeAction,
  handleUpdateMembershipApplication,
  muiQuery,
  getEventsData,
  handleSortFilter,
  getApplicationStatus,
} from "../../../context";

const Dashboard = ({ state, actions, libraries }) => {
  const dispatch = useAppDispatch();
  const { isActiveUser, dashboardPath, dynamicsApps, applicationData } =
    useAppState();

  const { lg } = muiQuery();

  const marginHorizontal = state.theme.marginHorizontal;
  const marginVertical = state.theme.marginVertical;

  const [eventList, setEventList] = useState(null); // event data
  const [isFetching, setFetching] = useState(false);
  const [subsData, setSubs] = useState(null);

  useEffect(async () => {
    let events = await getEventsData({ state });
    if (!events) return;
    // ⬇️⬇ sort events by date
    events = handleSortFilter({ list: events }); // enable this to sort events by date
    // show only 4 events
    events = events.slice(0, 4);

    // --------------------------------------------------------------------------------
    // 📌  Trigger application refetch on component mount. bug fix for payment triggering fetch payment history
    // --------------------------------------------------------------------------------
    await getApplicationStatus({
      state,
      dispatch,
      contactid: isActiveUser.contactid,
    });

    // sort subs by core_endon (ending year) date & get year DD/MM/YYYY
    const subs = dynamicsApps.subs.data.sort((a, b) => {
      // get year from core_endon date only
      const yearA = a.core_endon.split("/")[2];
      const yearB = b.core_endon.split("/")[2];

      // sort by year (ending year)
      if (yearA > yearB) return -1;
      if (yearA < yearB) return 1;
      return 0;
    });

    setSubs(subs); // set subs data
    setEventList(events); // set event list
  }, []);

  // HELPERS ----------------------------------------------
  const handleDownloadConfirmationPDF = async ({ app }) => {
    try {
      setFetching(true);
      const url = await getProofOfMembershipAction({
        state,
        core_membershipsubscriptionid: app.core_membershipsubscriptionid,
        isActiveUser,
        dispatch,
      });
      // await for link to download & open in new window to download
      window.open(url, "_blank");
    } catch (error) {
      // console.log(error);
    } finally {
      setFetching(false);
    }
  };

  const handleApplyForMembershipChangeAction = () => {
    // check if user have application in progress break & display error
    if (applicationData) {
      const type = applicationData[0].bad_categorytype;
      const confirmationMsg = `You already have ${type} application open and unsubmitted! Please complete it before changing BAD application category.`;

      setErrorAction({
        dispatch,
        isError: {
          message: confirmationMsg,
          image: "Error",
        },
      });
      return;
    }
    // otherwise handle create new application in Dynamics & redirect to application page
    setGoToAction({ state, path: "/membership/step-1-the-process/", actions });
  };

  // SERVERS ---------------------------------------------
  const ServeEvents = () => {
    if (!eventList) return <Loading />;

    return (
      <div
        className="shadow"
        style={{
          padding: !lg ? `2em 4em` : `1em`,
          marginBottom: `${marginVertical}px`,
        }}
      >
        <TitleBlock
          block={{ text_align: "left", title: "Upcoming Events" }}
          disableMargin
        />

        <div
          style={{
            marginTop: !lg ? null : `1em`,
            display: "grid",
            gridTemplateColumns: !lg ? `repeat(4, 1fr)` : "1fr",
            gap: 20,
          }}
        >
          {eventList.map((block, key) => {
            const title = block.title.rendered;

            return (
              <Card
                key={key}
                title={title}
                link_label="Read More"
                link={block.link}
                colour={colors.turquoise}
                eventHeader={block.acf}
                isFrom4Col
                titleLimit={4}
                shadow
              />
            );
          })}
        </div>
      </div>
    );
  };

  if (dashboardPath !== "Dashboard") return null;

  // 📌 If user dont have any subscription dont render the component
  let isSubsData = subsData;
  if (subsData && subsData.length === 0) isSubsData = null;

  // RETURN ---------------------------------------------
  return (
    <div style={{ padding: `0 ${marginHorizontal}px` }}>
      <div>
        <Profile />
        <ProfileProgress />
        <Payments subscriptions={dynamicsApps} dashboard />

        {subsData && (
          <div style={{ position: "relative" }}>
            <ActionPlaceholder
              isFetching={isFetching}
              background="transparent"
            />
            <div
              className="flex-col shadow"
              style={{
                padding: !lg ? `2em 4em` : "1em",
                marginBottom: `${marginVertical}px`,
              }}
            >
              <div className="flex-col">
                <div
                  className="flex primary-title"
                  style={{
                    fontSize: 20,
                    justifyItems: "center",
                  }}
                >
                  Current Subscriptions
                </div>

                {!isSubsData && (
                  <div
                    className="primary-title"
                    style={{
                      fontWeight: "bold",
                      display: "grid",
                      alignItems: "center",
                      paddingTop: "1em",
                    }}
                  >
                    You have no current membership activity.
                  </div>
                )}

                {subsData.map((app, key) => {
                  const {
                    bad_organisedfor,
                    core_name,
                    createdon,
                    core_endon,
                    core_membershipsubscriptionid,
                    bad_sagepayid,
                    bad_outstandingpayments,
                    core_totalamount,
                  } = app;

                  // get application date
                  let appData = createdon.split(" ")[0];
                  // split string and revert date with month format
                  appData = appData.split("/");
                  appData = `${appData[1]}/${appData[0]}/${appData[2]}`;

                  const ServeChangeApplicationAction = ({ show }) => {
                    // return if bad_organisedfor is BAD & in dashboard only
                    if (
                      bad_organisedfor !== "BAD" ||
                      dashboardPath !== "Dashboard" ||
                      show
                    )
                      return null;
                    const [appStatus, setStatus] = useState(null);

                    // check if application been previously submitted
                    useEffect(async () => {
                      try {
                        let isSubmitted =
                          await handleValidateMembershipChangeAction({
                            state,
                            core_membershipsubscriptionid,
                            isActiveUser,
                            dispatch,
                          });

                        if (isSubmitted) {
                          // check if user have submitted application for this category
                          isSubmitted = isSubmitted.filter((app) => {
                            return (
                              app._bad_existingsubscriptionid_value ===
                              core_membershipsubscriptionid
                            );
                          });
                        }

                        setStatus(isSubmitted); // set status to submitted
                      } catch (error) {
                        // console.log(error);
                      }
                    }, []);

                    if (!appStatus) return <Loading />;

                    if (appStatus.length > 0)
                      return (
                        <div
                          className="primary-title"
                          style={{
                            fontWeight: "bold",
                            justifyItems: "center",
                            display: "grid",
                            alignItems: "center",
                          }}
                        >
                          BAD category change pending approval.
                        </div>
                      );

                    // 📌 if app is approved & payed for only render the button
                    if (
                      bad_outstandingpayments.includes("-") ||
                      bad_outstandingpayments === "£0.00"
                    )
                      return (
                        <div
                          style={{
                            display: "grid",
                            alignItems: "center",
                          }}
                        >
                          <div
                            className="blue-btn"
                            onClick={() =>
                              handleUpdateMembershipApplication({
                                state,
                                actions,
                                dispatch,
                                isActiveUser,
                                dynamicsApps,
                                app,
                                applicationData,
                                setFetching,
                              })
                            }
                          >
                            Apply for BAD category change
                          </div>
                        </div>
                      );
                    return null;
                  };

                  const ServeCurrentMemberships = ({ show }) => {
                    const isFrozen =
                      isActiveUser.core_membershipstatus ===
                      state.theme.frozenMembership;

                    if (
                      bad_organisedfor === "SIG" ||
                      show // hide acctions if application is not current year
                    )
                      return null;

                    // if dashboard do not show actions except for frozen memberships
                    if (!isFrozen) return null;

                    return (
                      <div style={{ display: "grid", alignItems: "center" }}>
                        <div className="flex">
                          {isFrozen && <div>Frozen Membership</div>}
                        </div>
                      </div>
                    );
                  };

                  const ServeMembershipHistory = ({ show }) => {
                    if (
                      bad_organisedfor === "SIG" ||
                      show // hide acctions if application is not current year
                    )
                      return null;

                    return (
                      <div style={{ display: "grid", alignItems: "center" }}>
                        <div className="flex">
                          {!bad_sagepayid && <div>Lapsed Membership</div>}
                          {bad_sagepayid && <div>{core_totalamount}</div>}
                        </div>
                      </div>
                    );
                  };

                  // --------------------------------------------------------------------------------
                  // 📌  Disable all action if application is not current year | frozen
                  // --------------------------------------------------------------------------------
                  const currentYear = new Date().getFullYear();
                  const isFrozen =
                    isActiveUser.core_membershipstatus !==
                    state.theme.frozenMembership;

                  // dont show data if bad_organisedfor & core_name is not set
                  if (!bad_organisedfor || !core_name) return null;

                  return (
                    <div
                      key={key}
                      className="flex-col"
                      style={{ paddingTop: `1em` }}
                    >
                      <div
                        className="flex"
                        style={{ flexDirection: !lg ? null : "column" }}
                      >
                        <div
                          className="flex"
                          style={{ display: "grid", alignItems: "center" }}
                        >
                          <div className="primary-title">
                            {bad_organisedfor}
                          </div>
                          <div>{core_name}</div>
                        </div>
                        <ServeChangeApplicationAction
                          show={!core_endon.includes(currentYear) || !isFrozen}
                        />
                        <ServeCurrentMemberships
                          show={!core_endon.includes(currentYear)}
                        />
                        <ServeMembershipHistory
                          show={core_endon.includes(currentYear)}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
      <ServeEvents />
    </div>
  );
};

const styles = {
  container: {},
};

export default connect(Dashboard);
