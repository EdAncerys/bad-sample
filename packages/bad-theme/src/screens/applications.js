import { useState, useEffect } from "react";
import { connect } from "frontity";
// --------------------------------------------------------------------------------

const Applications = ({ state, actions, libraries }) => {
  // --------------------------------------------------------------------------------
  // 📌  BAD applications page.
  // --------------------------------------------------------------------------------
  const data = state.source.get(state.router.link);
  const page = state.source[data.type][data.id];
  console.log("pageData ", data, page); // debug

  const [fetching, setFetching] = useState(false);
  const [form, setForm] = useState({});

  useEffect(() => {
    console.log("🐞 DATA fetch");

    (async () => {
      try {
        setFetching(true);
      } catch (error) {
        console.log("error", error);
      } finally {
        setFetching(false);
      }
    })();
  }, []);

  return (
    <div className="flex applications-container">
      <div>applications</div>
    </div>
  );
};

const styles = {
  container: {},
};

export default connect(Applications);
