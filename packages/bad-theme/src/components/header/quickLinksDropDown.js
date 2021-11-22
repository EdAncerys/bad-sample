import { useState, useEffect } from "react";
import { connect } from "frontity";
import { Dropdown } from "react-bootstrap";

import { colors } from "../../config/colors";

const QuickLinksDropDown = ({ state, actions }) => {
  // HELPERS ---------------------------------------------

  const handler = () => {
    console.log("click");
  };

  return (
    <div className="dropdown" id="QuickLinksDropDown">
      <div>
        <Dropdown
          align="end"
          // onClick={(e) => {
          //   if (e.target.id === "dropdown-basic") {
          //     console.log("toggle");
          //   }
          // }}
        >
          <Dropdown.Toggle
            variant="shadow-none btn-m"
            style={styles.dropDownBtn}
            id="dropdown-basic"
            // onShow={() => console.log("toggle")}
          >
            Quick Links
          </Dropdown.Toggle>

          <Dropdown.Menu style={styles.dropDown}>
            <Dropdown.Item onClick={actions.context.setCreateAccountAction}>
              Create Account
            </Dropdown.Item>
            <Dropdown.Item onClick={actions.context.setEnquireAction}>
              Enquire
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>
    </div>
  );
};

const styles = {
  dropDownBtn: {
    fontSize: 16,
    backgroundColor: colors.lightSilver,
    textTransform: "capitalize",
    border: "none",
  },
  dropDown: {
    backgroundColor: colors.lightSilver,
    minWidth: 240,
    border: "none",
  },
};

export default connect(QuickLinksDropDown);
