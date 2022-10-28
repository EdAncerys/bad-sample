import { connect } from "frontity";
// --------------------------------------------------------------------------------
import { setGoToAction, colors } from "../context";

const ApplicationSidePannel = ({ state, actions, form, step }) => {
  // --------------------------------------------------------------------------------
  // 📌  Applications side/navigation panel.
  // --------------------------------------------------------------------------------

  const menu = [
    {
      title: "Step 1: The Process",
      path: "/membership/step-1-the-process/",
    },
    {
      title: "Step 2: Category Selection",
      path: "/membership/step-2-category-selection/",
    },
    {
      title: "Step 3: Personal Information",
      path: "/membership/step-3-personal-information/",
    },
    {
      title: "Step 4: Professional Details",
      path: "/membership/step-4-professional-details/",
    },
  ];

  console.log("🐞 props ", step);

  return (
    <div className="applications-side-pannel">
      <div className="primary-title application-panel-title">
        Apply to become a member of BAD
      </div>

      {menu.map((item, key) => {
        return (
          <div
            key={key}
            className="title-link-animation"
            style={{
              padding: key === 0 ? "2em 0 0.5em 0" : "0.5em 0",
              color: step === key ? colors.blue : colors.black,
              fontWeight: step === key ? "bold" : "normal",
            }}
            onClick={() => {
              setGoToAction({
                state,
                path: item.path,
                actions,
              });
            }}
          >
            {item.title}
          </div>
        );
      })}
    </div>
  );
};

export default connect(ApplicationSidePannel);
