import { useState, useEffect } from "react";
import { connect } from "frontity";
import Image from "@frontity/components/image";

import Card from "./card";
import ButtonsRow from "./buttonsRow";

const HeroBanner = ({ state, actions, url }) => {
  const CARD_WIDTH = "80%";
  const CARD_HEIGHT = "300px";
  const CARD_OFFSET_RIGHT = "-50px";
  const OFFSET_BOTTOM = "-50px";
  const URL =
    url ||
    "https://www.skinhealthinfo.org.uk/wp-content/uploads/2020/12/pexels-polina-tankilevitch-3735747-scaled-e1607434622754.jpg";

  // SERVERS ----------------------------------------------------------------
  const ServeContent = () => {
    return (
      <div className="flex-col">
        <div className="flex-row">
          <div
            className="flex"
            style={{
              justifyContent: "flex-end",
              marginRight: CARD_OFFSET_RIGHT,
              paddingTop: 25,
            }}
          >
            <Card
              cardTitle="Card Header Title"
              title="Card body Lorem Ipsum is simply dummy text of the printing and typesetting"
              body="Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
              cardWidth={CARD_WIDTH}
              // imgUrl="https://www.skinhealthinfo.org.uk/wp-content/uploads/2020/12/pexels-polina-tankilevitch-3735747-scaled-e1607434622754.jpg"
            />
          </div>
          <div className="flex" style={{ minHeight: 350 }}>
            <Image className="d-block w-100" src={URL} alt="BAD" />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex-col" style={styles.container}>
      <ServeContent />
      <div style={{ marginTop: OFFSET_BOTTOM }}>
        <ButtonsRow />
      </div>
    </div>
  );
};

const styles = {
  container: {},
};

export default connect(HeroBanner);
