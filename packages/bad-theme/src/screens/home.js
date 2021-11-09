import React, { useState, useEffect } from "react";
import { connect } from "frontity";
import Link from "@frontity/components/link";
import Image from "@frontity/components/image";
import Loading from "../components/loading";
import Carousel from "../components/carusel";
// CONTEXT ----------------------------------------------------------------
import { useAppDispatch, useAppState, setLoadingAction } from "../context";
import { colors } from "../config/colors";

const home = ({ state, actions }) => {
  const dispatch = useAppDispatch();
  const { isLoading } = useAppState();
  const data = state.source.get(state.router.link);

  const handleSetLoading = () => {
    setLoadingAction({ dispatch, isLoading: true });
  };

  if (isLoading) return <Loading />;

  return (
    <div>
      <Carousel />
      <div>
        <p style={styles.title}>BAD</p>
      </div>
    </div>
  );
};

const styles = {
  title: {
    textAlign: "center",
    fontSize: 40,
    fontWeight: "500",
    color: colors.primary,
  },
};

export default connect(home);
