import { useState, useEffect } from "react";
import { connect } from "frontity";
import Image from "@frontity/components/image";

const SCREEN_NAME = ({ state, actions, libraries }) => {
  const Html2React = libraries.html2react.Component; // Get the component exposed by html2react.

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

let fish = {
  firstChild: "Salmon 1",
  secondChild: {
    firstChild: "Salmon 2",
    thirdChild: {
      firstChild: "Salmon 3",
      fourthChild: {
        firstChild: "Salmon 4",
        fifthChild: {
          firstChild: "Salmon 5",
        },
      },
    },
  },
};

let dog = {
  firstChild: "Dog 1",
  secondChild: {
    firstChild: "dog 2",
    thirdChild: {
      firstChild: "dog 3",
      fourthChild: {
        firstChild: "dog 4",
        fifthChild: {
          firstChild: "dog 5",
        },
      },
    },
  },
};

let newObject = Object.entries(fish).reduce((object, [key, obj_value]) => {
  let newKey = dog[key];
  object[newKey || key] = obj_value;

  console.log(object);
  return object;
}, {});

let data = {
  id: "001",
  type: "A",
  value_001: "aaaaa",
  "data:": {},
  children: [
    { id: "002", type: "A", value_002: "aaaaa", "data:": {}, children: [] },
    {
      id: "003",
      type: "A",
      value_003: "aaaaa",
      "data:": {},
      children: [{ id: "00001", type: "B", children: [] }],
    },
    {
      id: "004",
      type: "A",
      value_004: "aaaaa",
      "data:": {},
      children: [
        { id: "005", type: "A", value_005: "aaaaa", "data:": {}, children: [] },
        {
          id: "006",
          type: "A",
          value_006: "aaaaa",
          "data:": {},
          children: [
            { id: "00002", type: "B", children: { value_007: "aaaaa" } },
          ],
        },
      ],
    },
    { id: "00003", type: "B", children: [] },
  ],
};

let mutateObject = (obj_key, obj_value, obj) =>
  obj.constructor === Object &&
  Object.keys(obj).forEach((key) => {
    if (key === obj_key) obj[key] = obj_value;
    mutateObject(obj_key, obj_value, obj[key]);
  });

let updateObject = (obj, obj_key, obj_value, new_value) => {
  return JSON.parse(
    JSON.stringify(obj).replace(
      new RegExp(`"${obj_key}":"${obj_value}"`),
      `"${obj_key}":"${new_value}"`
    )
  );
};

let updateObjectAnyValue = (obj, obj_key, new_value) => {
  return JSON.parse(
    JSON.stringify(obj).replace(
      new RegExp(`"${obj_key}":"[^]*"`),
      `"${obj_key}":"${new_value}"`
    )
  );
};
