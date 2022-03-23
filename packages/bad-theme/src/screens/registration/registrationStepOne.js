import { useState, useEffect, useRef } from "react";
import { connect } from "frontity";

import { colors } from "../../config/imports";
import SideBarMenu from "./sideBarMenu";
import BlockWrapper from "../../components/blockWrapper";
import ActionPlaceholder from "../../components/actionPlaceholder";
// CONTEXT -----------------------------------------------------------------
import {
  useAppDispatch,
  useAppState,
  setGoToAction,
  setUserStoreAction,
} from "../../context";

const RegistrationStepOne = ({ state, actions }) => {
  const data = state.source.get(state.router.link);
  const page = state.source[data.type][data.id];

  const dispatch = useAppDispatch();
  const { applicationData, isActiveUser, dynamicsApps } = useAppState();

  const [isFetching, setFetching] = useState(false);
  const marginHorizontal = state.theme.marginHorizontal;
  const marginVertical = state.theme.marginVertical;

  // HANDLERS --------------------------------------------
  const handleSaveExit = async () => {
    await setUserStoreAction({
      state,
      actions,
      dispatch,
      applicationData,
      isActiveUser,
      dynamicsApps,
    });
    if (isActiveUser) setGoToAction({ path: `/membership/`, actions });
  };

  const handleNext = async () => {
    setFetching(true);
    const store = await setUserStoreAction({
      state,
      actions,
      dispatch,
      applicationData,
      membershipApplication: { stepOne: true }, // set stepOne to complete
      isActiveUser,
    });
    setFetching(false);
    if (!store.success) return; // if store not saved, return

    if (isActiveUser)
      setGoToAction({
        path: `/membership/step-2-category-selection/`,
        actions,
      });
  };

  // SERVERS ---------------------------------------------
  const ServeActions = () => {
    return (
      <div
        className="flex"
        style={{
          justifyContent: "flex-end",
          padding: `2em 1em 0 1em`,
        }}
      >
        <div
          className="transparent-btn"
          onClick={() => setGoToAction({ path: `/membership/`, actions })}
        >
          Back
        </div>
        <div
          className="transparent-btn"
          style={{ margin: `0 1em` }}
          onClick={handleSaveExit}
        >
          Save & Exit
        </div>
        <div className="blue-btn" onClick={handleNext}>
          Next
        </div>
      </div>
    );
  };

  const ServeContent = () => {
    return (
      <div style={{ position: "relative" }}>
        <ActionPlaceholder isFetching={isFetching} background="transparent" />
        <div style={styles.wrapper}>
          <div className="primary-title" style={styles.title}>
            The Process
          </div>
          <div style={{ paddingTop: `0.75em` }}>
            Please follow the below steps to complete your application. All of
            the information required to submit your application is listed below.
          </div>
          <div style={{ paddingTop: `0.75em` }}>
            Once your membership application has been completed, it will be
            reviewed by the BAD’s membership team and then presented to the BAD
            Executive committee for approval at the quarterly Executive Meeting.
            You will receive an email on completion of your application with the
            date of the next meeting. Shortly following the meeting you will be
            contacted with the outcome of the application. Successful applicants
            will then be prompted to make payment to activate their membership.
          </div>
          <div
            className="caps-btn"
            onClick={() =>
              setGoToAction({
                path: `/membership/categories-of-membership/`,
                actions,
              })
            }
            style={{ paddingTop: `1em` }}
          >
            BAD membership categories
          </div>
          <div
            className="primary-title"
            style={{
              ...styles.title,
              marginTop: `1em`,
              paddingTop: `1em`,
              borderTop: `1px solid ${colors.silverFillTwo}`,
            }}
          >
            You Will Need:
          </div>
          <div>
            <ul>
              <li>CV</li>
              <li>Main Hospital / Place of Work / Medical School details</li>
              <li>GMC/IMC number (except students)</li>
              <li>Current Post</li>
              <li>Medical School (for student category only)</li>
              <li>
                Proposers (two proposers are needed for all applications, with
                the exception of medical students who only require one)
              </li>
            </ul>
          </div>
        </div>
        <ServeActions />
      </div>
    );
  };

  return (
    <BlockWrapper>
      <div
        style={{
          margin: `${marginVertical}px ${marginHorizontal}px`,
        }}
      >
        <div style={styles.container}>
          <SideBarMenu />
          <ServeContent />
        </div>
      </div>
    </BlockWrapper>
  );
};

const styles = {
  container: {
    display: "grid",
    gridTemplateColumns: `1fr 2fr`,
    justifyContent: "space-between",
    gap: 20,
  },
  wrapper: {
    borderBottom: `1px solid ${colors.silverFillTwo}`,
    padding: `0 1em 2em`,
  },
  title: {
    fontSize: 20,
  },
  subTitle: {
    fontWeight: "bold",
    padding: `0.75em 0`,
  },
};

export default connect(RegistrationStepOne);
