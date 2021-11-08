const Root = () => {
  return (
    <>
      You can edit your package in:
      <pre>packages/bad-theme/src/index.js</pre>
    </>
  );
};

export default {
  name: "bad-theme",
  roots: {
    theme: Root
  },
  state: {
    theme: {}
  },
  actions: {
    theme: {}
  }
};
