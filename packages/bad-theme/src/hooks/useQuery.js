import { useEffect } from "react";
import { muiQuery } from "../context";

export const useQuery = ({ state }) => {
  const { sm, md, lg, xl, xxl } = muiQuery();

  useEffect(() => {
    // ⬇️ handle container width change ⬇️
    // main container width change
    if (!lg) state.theme.contentContainer = 950;
    if (!xl) state.theme.contentContainer = 1150;
    if (!xxl) state.theme.contentContainer = 1350;

    // other change
    if (lg) state.theme.marginHorizontal = 10;
    if (lg) state.theme.marginVertical = 10;
    if (lg) state.theme.fontSize = 22;
    if (lg) state.theme.footerHeight = 2;
  }, [sm, md, lg, xl, xxl]);
};
