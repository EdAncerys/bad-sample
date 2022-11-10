import connect from "@frontity/connect";

const ApplicationSidePanel = ({
  form,
  application,
  step,
  badApp,
  onChange,
}) => {
  // --------------------------------------------------------------------------------
  // 📌  Applications side/navigation panel.
  // --------------------------------------------------------------------------------

  const hasError = form?.dev_selected_application_types?.length === 0;
  const menu = [
    {
      title: "Step 1: The Process",
      step: 0,
    },
    {
      title: "Step 2: Category Selection",
      step: 1,
    },
    {
      title: "Step 3: Personal Information",
      step: 2,
    },
    {
      title: "Step 4: Professional / Workforce Details",
      step: 3,
    },
    {
      title: "Step 5: Application Submission",
      step: 4,
    },
  ];

  const ActionBtn = () => {
    return (
      <div className="flex" style={{ gap: 20, marginTop: 50 }}>
        <div
          className="blue-btn-reverse"
          style={{ width: 200 }}
          onClick={() => console.log("🐞 dev: ", form, application)}
        >
          log forms 📝
        </div>
      </div>
    );
  };

  const navigationHandler = ({ item }) => {
    if (item.step >= form?.step + 1) return; // 📌 dont allow user to set step higher than +1 of current step

    onChange({
      target: { name: "step", value: item.step },
    });
  };

  return (
    <div className="applications-side-panel">
      <div className="primary-title application-panel-title">
        Apply to become a member of{" "}
        {form?.bad_organisedfor === "810170001" ? "SIG" : "BAD"}
      </div>

      {!badApp && (
        <div
          className="title-link-animation"
          style={{
            padding: "2em 0 0.5em 0",
            color: "#3882CD",
            fontWeight: "bold",
          }}
        >
          {!hasError && "Form - SIG Questions"}
          {hasError && "Error"}
        </div>
      )}

      {badApp &&
        menu.map((item, key) => {
          return (
            <div
              key={key}
              className="title-link-animation"
              style={{
                padding: key === 0 ? "2em 0 0.5em 0" : "0.5em 0",
                color: step === key ? "#3882CD" : undefined,
                fontWeight: step === key ? "bold" : "normal",
              }}
              onClick={() => navigationHandler({ item })}
            >
              {item.title}
            </div>
          );
        })}

      <ActionBtn />
    </div>
  );
};

export default connect(ApplicationSidePanel);
