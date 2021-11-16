import { useState, useEffect } from "react";
import { connect } from "frontity";
import Image from "@frontity/components/image";

const SCREEN_NAME = ({ state, actions }) => {
  // HELPERS ---------------------------------------------

  return (
    <div style={styles.container}>
      <div></div>
    </div>
  );
};

const styles = {
  container: {},
};

export default connect(SCREEN_NAME);

// useEffect(() => {
//   getMedia();
// }, []);

// // HANDLERS ----------------------------------------------------------
// const getMedia = async () => {
//   if (!background_image) return null;

//   try {
//     // Get images & populate in state
//     const response = await libraries.source.api.get({
//       endpoint: `media/${background_image}`,
//     });
//     await libraries.source.populate({
//       response,
//       state,
//     });
//     const media = state.source.attachment[background_image]; // get fetched img from state
//     await setImage(media);
//   } catch (error) {
//     console.log(`error fetching IMG ${background_image}`);
//   }
// };
