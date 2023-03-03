import { connect } from "frontity";
import { colors } from "../../config/imports";
import { MENU_DATA } from "../../config/data";
// CONTEXT ----------------------------------------------------
import {
  useAppDispatch,
  useAppState,
  setGoToAction,
  setErrorAction,
  loginAction,
  getWileyAction,
  Parcer,
} from "../../context";

const QuickLinksDropDown = ({ state, actions, libraries }) => {
  const dispatch = useAppDispatch();
  const { isActiveUser, dynamicsApps } = useAppState();

  // HANDLERS ----------------------------------------------------
  const handleActiveMenu = ({ mouseLeave }) => {
    const selector = document.querySelector(`#quick-link-menu`);
    const btn = document.querySelector(`#drop-down-btn`);

    if (mouseLeave) {
      if (selector) selector.style.display = "none";
      if (btn) btn.classList.remove = "shadow";
      return;
    }
    if (selector) selector.style.display = "block";
    if (btn) btn.classList.add = "shadow";
  };

  const onClickLinkHandler = async ({ title, url }) => {
    const isMembersOnly = title.includes("Journal");
    let authLink = url;

    // HANDLERS ----------------------------------------------------
    const handelLogin = () => {
      setErrorAction({ dispatch, isError: null });
      loginAction({ state });
    };

    const handelRedirect = () => {
      setErrorAction({ dispatch, isError: null });

      // --------------------------------------------------------------------------------
      // 📌  Redirect handler
      // Handles internal/external link logic
      // --------------------------------------------------------------------------------
      setGoToAction({ state, path: authLink, actions });
    };

    // 📌 check if logged in user exists & user is BAD member to replace auth link
    if (isMembersOnly && isActiveUser) {
      const redirect = encodeURI(url);
      const queryState = encodeURI(`additional state params`);
      let path =
        state.auth.APP_URL +
        `/ouredirect?redirect=${redirect}&state=${queryState}`;

      actions.router.set(path); // ⚠️ redirect to codecolect route handler for auth users

      return;
    }

    if (isMembersOnly && !isActiveUser) {
      // 📌 track notification error action
      const isCED = title?.includes("CED") || title?.includes("BJD");
      const label = isCED ? "Visit the CED Website" : "Visit the Wiley Website";

      setErrorAction({
        dispatch,
        isError: {
          message: `BAD members, make sure you are logged in to your BAD account to get free access to our journals. <br/> To continue to the publication without logging in, click to visit the '${label}'`,
          image: "Error",
          action: [
            {
              label,
              handler: handelRedirect,
            },
            { label: "Login", handler: handelLogin },
          ],
        },
      });
      return;
    }

    setGoToAction({ state, path: authLink, actions });
  };

  // SERVERS ----------------------------------------------------------
  const ServeDivider = () => {
    return (
      <div className="relative">
        <div
          style={{
            position: "absolute",
            height: 35,
            width: 155,
            backgroundColor: colors.lightSilver,
            top: -35,
            right: 0,
          }}
        />
      </div>
    );
  };

  const ServeMenu = () => {
    return (
      <ul
        id="quick-link-menu"
        className="dropdown-menu dropdown-menu-end shadow quick-link"
        style={{
          marginTop: `1em`,
          border: "none",
          backgroundColor: colors.lightSilver,
        }}
      >
        <ServeDivider />

        {MENU_DATA.map((item, key) => {
          const { title, url } = item;
          // 📌 check if logged in user exists & user is BAD member to allow access to PushFar & user have valid permisions
          let serviceAccess =
            isActiveUser &&
            isActiveUser.core_membershipstatus !== state.theme.frozenMembership
              ? isActiveUser.bad_selfserviceaccess === state.theme.serviceAccess
              : false;

          if (title === "PushFar Mentoring platform" && !serviceAccess)
            return null;

          return (
            <li
              key={key}
              className="flex-row"
              style={{ marginRight: `2em` }}
              onClick={() => onClickLinkHandler({ title, url })}
            >
              <a className="dropdown-item" style={{ padding: `0.5em 0` }}>
                <div
                  className="quick-link-title"
                  style={{ width: `fit-content` }}
                >
                  <Parcer libraries={libraries} html={title} />
                </div>
              </a>
            </li>
          );
        })}
      </ul>
    );
  };

  return (
    <div
      className="dropdown quick-link"
      onMouseEnter={handleActiveMenu}
      onMouseLeave={() => {
        handleActiveMenu({ mouseLeave: true });
      }}
    >
      <div
        id="drop-down-btn"
        className="dropdown-toggle drop-down-btn"
        type="button"
      >
        Quick Links
      </div>
      <ServeMenu />
    </div>
  );
};

const styles = {
  container: {},
};

export default connect(QuickLinksDropDown);
