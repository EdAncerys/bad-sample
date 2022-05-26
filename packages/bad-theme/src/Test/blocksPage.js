import React from "react";
import { connect } from "frontity";

import { colors } from "../config/imports";
import BlockBuilder from "../components/builder/blockBuilder";
import BlockWrapper from "../components/blockWrapper";

import Wiley from "../components/authentication/wiley";
import Sagepay from "../components/authentication/sagepay";
import OCP from "../components/authentication/ocp";
import ButtonsRow from "../components/buttonsRow";

const BlocksPage = ({ state }) => {
  const data = state.source.get(state.router.link);
  const page = state.source[data.type][data.id];
  const wpBlocks = page.acf.blocks;
  // console.log("page data: ", page); // debug

  // 📌 if env is dev, show the blocks.
  if (state.auth.ENVIRONMENT !== "DEVELOPMENT") return null;

  return (
    <div>
      <div>
        <div className="primary-title" style={styles.title}>
          BLOCK BUILDER 😈
        </div>

        <BlockWrapper>
          {/* <Wiley /> */}
          {/* <Sagepay /> */}
          {/* <OCP /> */}
          {/* <ButtonsRow
            block={{
              buttons: [
                {
                  contact_form: true,
                  full_name: true,
                  email_address: true,
                  phone_number: true,
                  subject: true,
                  subject_dropdown_options: { 1: "a", 2: "b", 3: "c" },
                  isHospitalChange: true,
                  job_title: true,
                  message: true,
                  allow_attachments: true,

                  title: "Visit The BJD Website",
                },
              ],
            }}
          /> */}
        </BlockWrapper>
      </div>

      <BlockBuilder blocks={wpBlocks} block={{ facebook_link: "" }} />
    </div>
  );
};

const styles = {
  title: {
    fontSize: 26,
    textAlign: "center",
    fontWeight: "500",
    color: colors.primary,
    backgroundColor: "#66806A",
  },
};

export default connect(BlocksPage);
