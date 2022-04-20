import { useState, useEffect, useRef } from "react";
import { connect } from "frontity";

import date from "date-and-time";
const DATE_MODULE = date;

import Profile from "../profile";
import ProfileProgress from "../profileProgress";
import { colors } from "../../../config/colors";
import Loading from "../../loading";
import TitleBlock from "../../titleBlock";
import ApplicationStatusOrPayment from "../ApplicationStatusOrPayment";
import Payments from "../payments";
import Card from "../../../components/card/card";
import ActionPlaceholder from "../../actionPlaceholder";

// CONTEXT ------------------------------------------------------------------
import {
  useAppState,
  useAppDispatch,
  setErrorAction,
  handleValidateMembershipChangeAction,
  handleApplyForMembershipAction,
  muiQuery,
} from "../../../context";
import { getEventsData } from "../../../helpers";

const Dashboard = ({ state, actions, libraries }) => {
  const dispatch = useAppDispatch();
  const {
    isActiveUser,
    dashboardPath,
    dynamicsApps,
    refreshJWT,
    applicationData,
  } = useAppState();
  // CONTEXT ------------------------------------------------------------------

  const { lg } = muiQuery();

  const marginHorizontal = state.theme.marginHorizontal;
  const marginVertical = state.theme.marginVertical;

  const [eventList, setEventList] = useState(null); // event data
  const [isFetching, setFetching] = useState(false);
  const [subsData, setSubs] = useState(null);
  const useEffectRef = useRef(null);

  useEffect(async () => {
    // pre fetch events data
    let data = state.source.events;
    if (!data) await getEventsData({ state, actions });
    data = state.source.events;
    if (data) data = Object.values(data);
    // 📌 sort events by date newest first
    data.sort((a, b) => {
      let dateA = a.acf.date_time;
      let dateB = b.acf.date_time;
      if (dateA) dateA = dateA[0].date;
      if (dateB) dateB = dateB[0].date;
      // convert to date object
      dateA = new Date(dateA);
      dateB = new Date(dateB);

      if (dateA > dateB) return -1;
      if (dateA < dateB) return 1;
      return 0;
    });

    // 📌 sort eventList by closest to today first (if date is set)
    data.sort((a, b) => {
      let dateA = a.acf.date_time;
      let dateB = b.acf.date_time;
      if (dateA) dateA = dateA[0].date;
      if (dateB) dateB = dateB[0].date;

      // convert to date object
      dateA = new Date(dateA);
      dateB = new Date(dateB);

      // get today's date
      let today = new Date();

      // get date difference
      let diffA = Math.abs(dateA - today);
      let diffB = Math.abs(dateB - today);

      if (diffA > diffB) return 1;
      if (diffA < diffB) return -1;

      return 0;
    });
    // convert to object & return first 2 records
    const events = data.slice(0, 4);
    setEventList(events);

    return () => {
      useEffectRef.current = ""; // clean up function
    };
  }, []);

  useEffect(() => {
    if (!dynamicsApps) return;
    // 📌 set dynamic apps data
    setSubs(dynamicsApps.subs.data);
  }, [dynamicsApps]);

  // HELPERS ----------------------------------------------
  const handleUpdateMembershipApplication = async ({ app }) => {
    // if user have application in progress break & display error
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

    // handle create new application in Dynamics
    try {
      setFetching(true);
      const appData = await handleApplyForMembershipAction({
        state,
        actions,
        dispatch,
        applicationData,
        isActiveUser,
        dynamicsApps,
        category: "BAD",
        type: app.bad_categorytype, //🤖 application type name from appData
        membershipApplication: {
          stepOne: false,
          stepTwo: false,
          stepThree: false,
          stepFour: false,
          changeAppCategory: app, // change of application
        },
        path: "/membership/application-change/", // redirect to application change page
        changeAppCategory: app, // change of application
        refreshJWT,
      });
      if (!appData) throw new Error("Failed to create application");
    } catch (error) {
      console.log(error);

      setErrorAction({
        dispatch,
        isError: {
          message: "Failed to create application record. Please try again.",
          image: "Error",
        },
      });
    } finally {
      setFetching(false);
    }
  };

  const handleDownloadConfirmationPDF = async ({ app }) => {
    try {
      setFetching(true);
      const url = await getProofOfMembershipAction({
        state,
        core_membershipsubscriptionid: app.core_membershipsubscriptionid,
        isActiveUser,
        dispatch,
        refreshJWT,
      });
      // await for link to download & open in new window to download
      window.open(url, "_blank");
    } catch (error) {
      console.log(error);
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
  const ServeApplicationStatus = () => {
    if (!dynamicsApps) return null;
    const { apps, subs } = dynamicsApps;

    const [applications, setApplications] = useState();

    useEffect(() => {
      if (!dynamicsApps) return null;

      setApplications(dynamicsApps.apps);
    }, [dynamicsApps]);

    if (apps.data.length === 0) return null;
    if (!applications) return <Loading />;
    return (
      <div>
        {applications.data.map((item, key) => {
          return (
            <ApplicationStatusOrPayment
              key={key}
              application={applications.data[key]}
            />
          );
        })}
      </div>
    );
  };

  const ServePayments = () => {
    if (!dynamicsApps) return null;

    const outstandingApps =
      dynamicsApps.apps.data.filter((item) => item.bad_sagepayid !== null)
        .length > 0;
    const outstandingSubs =
      dynamicsApps.subs.data.filter((item) => item.bad_sagepayid === null)
        .length > 0;
    const subsies = dynamicsApps.subs.data.filter(
      (item) => item.bad_sagepayid !== null
    );

    if (!outstandingSubs) return null;

    return <Payments subscriptions={dynamicsApps} dashboard />;
  };

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

  // RETURN ---------------------------------------------
  return (
    <div style={{ padding: `0 ${marginHorizontal}px` }}>
      <div>
        <Profile />
        <ProfileProgress />
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
                {subsData.map((app, key) => {
                  const {
                    bad_organisedfor,
                    core_name,
                    createdon,
                    core_membershipsubscriptionid,
                  } = app;
                  // get application date
                  let appData = createdon.split(" ")[0];
                  // split string and revert date with month format
                  appData = appData.split("/");
                  appData = `${appData[1]}/${appData[0]}/${appData[2]}`;

                  const dateObject = new Date(appData);
                  const formattedDate = DATE_MODULE.format(
                    dateObject,
                    "DD MMM YYYY"
                  );

                  const ServeChangeApplicationAction = () => {
                    // return if bad_organisedfor is BAD & in dashboard only
                    if (
                      bad_organisedfor !== "BAD" ||
                      dashboardPath !== "Dashboard"
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
                            refreshJWT,
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
                        console.log(error);
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

                    return (
                      <div
                        style={{
                          display: "grid",
                          alignItems: "center",
                          marginRight: "2em",
                        }}
                      >
                        <div
                          className="blue-btn"
                          onClick={() =>
                            handleUpdateMembershipApplication({ app })
                          }
                        >
                          Apply for BAD category change
                        </div>
                      </div>
                    );
                  };

                  const ServeMembershipActions = () => {
                    if (
                      dashboardPath === "Dashboard" ||
                      bad_organisedfor === "SIG"
                    )
                      return null;

                    return (
                      <div style={{ display: "grid", alignItems: "center" }}>
                        <div className="flex">
                          <div
                            className="blue-btn"
                            style={{ marginRight: "1em" }}
                            onClick={handleApplyForMembershipChangeAction}
                          >
                            Apply to change membership
                          </div>
                          <div
                            className="blue-btn"
                            onClick={() =>
                              handleDownloadConfirmationPDF({ app })
                            }
                          >
                            Proof of membership certificate
                          </div>
                        </div>
                      </div>
                    );
                  };

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
                          {/* <div>Application Date: {formattedDate}</div> */}
                        </div>
                        <ServeChangeApplicationAction />
                        <ServeMembershipActions />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
        <ServeApplicationStatus />
        <ServePayments />
      </div>
      <ServeEvents />
    </div>
  );
};

const styles = {
  container: {},
};

export default connect(Dashboard);
