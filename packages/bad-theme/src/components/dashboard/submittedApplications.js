import { useState, useEffect } from "react";
import { connect } from "frontity";

import { colors } from "../../config/imports";
import date from "date-and-time";
const DATE_MODULE = date;

// CONTEXT ----------------------------------------------------------------
import { useAppState } from "../../context";

const SubmittedApplications = ({ state, actions, libraries }) => {
  const Html2React = libraries.html2react.Component; // Get the component exposed by html2react.

  const { dynamicsApps } = useAppState();
  const marginVertical = state.theme.marginVertical;

  if (!dynamicsApps) return null; // if application data exist & not under review return null

  // HELPERS ----------------------------------------------
  // see if application list have approved applications and if so show them
  let appsData = dynamicsApps.apps.data; // get subs data form dynamic apps
  // hide component if application list has no approved applications
  if (appsData.length === 0) return null;
  // sort by application date created newest by default
  appsData = appsData.sort((a, b) => {
    const dateA = new Date(a.createdon);
    const dateB = new Date(b.createdon);
    return dateB - dateA;
  });

  // RETURN ---------------------------------------------
  return (
    <div
      className="flex-col shadow"
      style={{ padding: `2em 4em`, marginBottom: `${marginVertical}px` }}
    >
      <div className="flex-col">
        <div
          className="flex primary-title"
          style={{
            fontSize: 20,
            justifyItems: "center",
          }}
        >
          Pending For Approval Applications
        </div>
        {appsData.map((app, key) => {
          const { bad_organisedfor, core_name, createdon, bad_approvalstatus } =
            app;

          // get application date
          let appData = createdon.split(" ")[0];
          // split string and revert date with month format
          appData = appData.split("/");
          appData = `${appData[1]}/${appData[0]}/${appData[2]}`;

          const dateObject = new Date(appData);
          const formattedDate = DATE_MODULE.format(dateObject, "DD MMM YYYY");

          return (
            <div key={key} className="flex-col" style={{ paddingTop: `1em` }}>
              <div className="primary-title">{bad_organisedfor}</div>
              <div>{core_name}</div>
              <div>Application Date: {formattedDate}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const styles = {
  component: {},
};

export default connect(SubmittedApplications);
