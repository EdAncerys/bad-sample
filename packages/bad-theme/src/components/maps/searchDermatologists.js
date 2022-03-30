import { useState, useEffect, useLayoutEffect, useRef } from "react";
import { connect } from "frontity";

import GooglePlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from "react-google-places-autocomplete";
import SearchContainer from "../searchContainer";

import BlockWrapper from "../blockWrapper";
import Loading from "../loading";
import { colors } from "../../config/imports";
import { v4 as uuidv4 } from "uuid";

// CONTEXT ----------------------------------------------------------------
import { useAppDispatch, muiQuery } from "../../context";

const SearchDermatologists = ({ state, actions, libraries, block }) => {
  const { sm, md, lg, xl } = muiQuery();

  const dispatch = useAppDispatch();

  const { disable_vertical_padding, background_colour } = block;

  const marginHorizontal = state.theme.marginHorizontal;
  let marginVertical = state.theme.marginVertical;
  if (disable_vertical_padding) marginVertical = 0;

  const addressFilterRef = useRef(null);
  const nameFilterRef = useRef(null);

  const [uniqueId, setUniqueId] = useState(null);
  const [isReady, setIsReady] = useState(null);

  useEffect(async () => {
    setIsReady(true);

    return () => {
      addressFilterRef.current = false; // clean up function
    };
  }, []);

  // hook applies after React has performed all DOM mutations
  useLayoutEffect(() => {
    const blockId = uuidv4(); // add unique id
    setUniqueId(blockId);
  }, []);

  if (!isReady) return <Loading />; // awaits pre fetch & data

  // HELPERS ----------------------------------------------------------------
  const handleSearch = () => {
    let addressInput = "";
    let nameInput = "";
    let distanceInput = "";

    const serachParams = {
      addressInput,
      nameInput,
      distanceInput,
    };

    // state.theme.addressFilter = input;
  };

  // SERVERS --------------------------------------------------

  // RETURN ---------------------------------------------------
  return (
    <div
      style={{
        padding: `${marginVertical}px 0`,
        backgroundColor: background_colour,
      }}
      className="no-selector"
    >
      <div
        style={{
          backgroundColor: colors.silverFillTwo,
          marginBottom: `${state.theme.marginVertical}px`,
          padding: `2em 0`,
        }}
      >
        <BlockWrapper>
          <div
            className="flex-row"
            style={{ padding: `0 ${marginHorizontal}px` }}
          >
            <SearchContainer
              title="Search For Dermatologists"
              addressFilterRef={addressFilterRef}
              handleSearch={handleSearch}
            />

            <SearchContainer
              title="Search By Name"
              addressFilterRef={nameFilterRef}
              handleSearch={handleSearch}
            />
          </div>
        </BlockWrapper>
      </div>
    </div>
  );
};

const styles = {
  input: {
    borderRadius: 10,
  },
};

export default connect(SearchDermatologists);
